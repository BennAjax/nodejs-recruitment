const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const app = require('../server');
const MovieAdaptor = require('../adaptors/OmdbAdaptor');
const Movie = require('../data/models/Movie');
const { BASIC_USER, PREMIUM_USER, QUOTA_EXCEEDED_MESSAGE } = require('../lib/constants');

let mongoServer;
const request = supertest(app);

jest.setTimeout(20000);
jest.mock('../adaptors/OmdbAdaptor');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ binary: { version: '4.2.8' } });
  if (mongoose.connection.readyState !== 1) await mongoose.connect(mongoServer.getUri(), { dbName: 'testDB' });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
  app.close();
});

afterEach(() => {
  mongoose.connection.collection('movies').deleteMany();
});

describe('Routes and Movie Controller', () => {
  const createToken = (type) =>
    jwt.sign(
      {
        userId: 123,
        name: 'Thomas Hodge',
        role: type,
      },
      'xxxxx', // TODO: fix this
      {
        issuer: 'https://www.netguru.com/',
        subject: `123`,
        expiresIn: 30 * 60,
      }
    );

  describe('Health', () => {
    test('should return 200 for health', () => {
      request
        .get('/health')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.status).toBe('OK');
        });
    });
  });

  describe('POST: Create Movies', () => {
    test('should return 400 when no token is provided', () => {
      request
        .post('/movies')
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('No token provided');
        });
    });

    test('should return 400 when token is invalid', () => {
      request
        .post('/movies')
        .set('Authorization', 'Bearer xxxxxxx')
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('Invalid token');
        });
    });

    test('should return 400 when validation fails', () => {
      request
        .post('/movies')
        .set('Authorization', `Bearer ${createToken(BASIC_USER)}`)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('title is required');
        });
    });

    test('should create a movie successfully', async () => {
      const movie = {
        userId: 123,
        Title: 'Island Man',
        Released: new Date(),
        Genre: 'Action',
        Director: 'Marcus Hodge',
      };

      MovieAdaptor.getMovie.mockImplementation(() => movie);

      const res = await request
        .post('/movies')
        .send({ title: 'Island' })
        .set('Authorization', `Bearer ${createToken(BASIC_USER)}`)
        .expect(httpStatus.CREATED);

      const actual = await Movie.find({});
      expect(res.body.status).toBe('Successful');
      expect(actual).toHaveLength(1);
      expect(actual[0]).toMatchObject({
        userId: 123,
        title: 'Island Man',
        genre: 'Action',
        director: 'Marcus Hodge',
      });
    });

    test('should return 401 when basic user exceeds monthly limit', async () => {
      const movie = {
        userId: 123,
        Title: 'Island Man',
        Released: new Date(),
        Genre: 'Action',
        Director: 'Marcus Hodge',
      };

      MovieAdaptor.getMovie.mockImplementation(() => movie);

      const init = async () =>
        request
          .post('/movies')
          .send({ title: 'Island' })
          .set('Authorization', `Bearer ${createToken(BASIC_USER)}`)
          .expect(httpStatus.CREATED);

      await init();
      await init();
      await init();
      await init();
      await init();

      const res = await request
        .post('/movies')
        .send({ title: 'Island' })
        .set('Authorization', `Bearer ${createToken(BASIC_USER)}`);

      const actual = await Movie.find({});
      expect(actual).toHaveLength(5);
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
      expect(res.body.status).toBe(QUOTA_EXCEEDED_MESSAGE);
    });

    test('should create more than 5 movies for premium user monthly', async () => {
      const movie = {
        userId: 123,
        Title: 'Island Man',
        Released: new Date(),
        Genre: 'Action',
        Director: 'Marcus Hodge',
      };

      MovieAdaptor.getMovie.mockImplementation(() => movie);

      const init = async () =>
        request
          .post('/movies')
          .send({ title: 'Island' })
          .set('Authorization', `Bearer ${createToken(PREMIUM_USER)}`)
          .expect(httpStatus.CREATED);

      await init();
      await init();
      await init();
      await init();
      await init();

      const res = await request
        .post('/movies')
        .send({ title: 'Island' })
        .set('Authorization', `Bearer ${createToken(PREMIUM_USER)}`);

      const actual = await Movie.find({});
      expect(actual).toHaveLength(6);
      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body.status).toBe('Successful');
    });
  });

  describe('GET: Movies', () => {
    test('should get all user movies ', async () => {
      const movies = [
        {
          userId: 123,
          title: 'Big Boys',
          released: new Date(),
          genre: 'Action',
          director: 'Marcus',
        },
        {
          userId: 123,
          title: 'Snake Island',
          released: new Date(),
          genre: 'Action',
          director: 'Jones',
        },
        {
          userId: 412,
          title: 'Think Like a Man',
          released: new Date(),
          genre: 'Love',
          director: 'Becky',
          createdAt: new Date('2022-04-13'),
        },
      ];

      await Movie.insertMany(movies);

      const res = await request
        .get('/movies')
        .send({ title: 'Island' })
        .set('Authorization', `Bearer ${createToken(PREMIUM_USER)}`)
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        userId: 123,
        title: 'Big Boys',
        genre: 'Action',
        director: 'Marcus',
      });
    });
  });
});
