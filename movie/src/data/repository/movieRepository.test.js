const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const { createMovie, getMovieByUser, getMovieCountByUser } = require('./movieRepository');

let mongoServer;
jest.setTimeout(20000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ binary: { version: '4.2.8' } });
  await mongoose.connect(mongoServer.getUri(), { dbName: 'testDB' });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(() => {
  mongoose.connection.collection('movies').deleteMany();
});

describe('Movie Repository', () => {
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

  describe('createMovie', () => {
    test('should insert a movie', async () => {
      await createMovie(movies[0]);

      const actual = await Movie.find();
      expect(actual).toHaveLength(1);
      expect(actual[0]).toMatchObject(movies[0]);
    });

    test('should reject missing properties', async () => {
      try {
        const movieCopy = { ...movies[0] };
        delete movieCopy.director;
        await createMovie(movieCopy);
      } catch (e) {
        expect(e.message).toEqual('Movie validation failed: director: Director is required');
      }
    });
  });

  describe('getMovieByUserId', () => {
    test('should return all movies of user', async () => {
      await Movie.insertMany(movies);

      const userMovies = await getMovieByUser(123);
      expect(userMovies).toHaveLength(2);
      expect(userMovies[0]).toMatchObject(movies[0]);
      expect(userMovies[1]).toMatchObject(movies[1]);
    });

    test('should return no movie for user', async () => {
      const userMovies = await getMovieByUser(123);
      expect(userMovies).toHaveLength(0);
    });
  });

  describe('getMovieCountByUser', () => {
    test('should return movie count for current month', async () => {
      await Movie.insertMany(movies);

      const movieCount = await getMovieCountByUser(123);
      expect(movieCount).toEqual(2);
    });

    test('should return no movie count for current month', async () => {
      await Movie.insertMany(movies);

      const movieCount = await getMovieCountByUser(412);
      expect(movieCount).toEqual(0);
    });
  });
});
