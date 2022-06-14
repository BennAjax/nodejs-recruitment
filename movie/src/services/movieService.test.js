const movieRepository = require('../data/repository/movieRepository');
const movieService = require('./movieService');
const MovieAdaptor = require('../adaptors/OmdbAdaptor');
const UnauthorizedError = require('../lib/errors/UnauthorizedError');
const InternalError = require('../lib/errors/InternalError');
const {
  QUOTA_EXCEEDED_MESSAGE,
  INVALID_ARGUMENT,
  MOVIE_ADAPTOR_ERROR,
  MOVIE_CREATION_ERROR,
} = require('../lib/constants');

jest.mock('../data/repository/movieRepository');
jest.mock('../adaptors/OmdbAdaptor');
jest.mock('../data/repository/movieRepository');

describe('Movie Service', () => {
  describe('createMovie', () => {
    const user = [
      {
        userId: 123,
        name: 'Basic Thomas',
        role: 'basic',
        iat: 1606221838,
        exp: 1606223638,
        iss: 'https://www.netguru.com/',
        sub: '123',
      },
      {
        userId: 432,
        name: 'Premium John',
        role: 'premium',
        iat: 1606221838,
        exp: 1606223638,
        iss: 'https://www.netguru.com/',
        sub: '432',
      },
    ];

    test('should throw Invalid Argument', async () => {
      try {
        await movieService.createMovie(null, 'snakeman');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should throw Quota Exceeded Error for basic user', async () => {
      movieRepository.getMovieCountByUser.mockImplementation(() => 6);

      try {
        await movieService.createMovie(user[0], 'snakeman');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedError);
        expect(e.message).toBe(QUOTA_EXCEEDED_MESSAGE);
      }
    });

    test('should throw when no movie is fetched', async () => {
      MovieAdaptor.getMovie.mockImplementation(() => null);

      try {
        await movieService.createMovie(user[1], 'snakeman');
      } catch (e) {
        expect(e).toBeInstanceOf(InternalError);
        expect(e.message).toBe(MOVIE_ADAPTOR_ERROR);
      }
    });

    test('should throw when an error occurred in movie creation', async () => {
      MovieAdaptor.getMovie.mockImplementation(() => ({}));
      movieRepository.createMovie.mockImplementation(() => {
        throw new Error();
      });

      try {
        await movieService.createMovie(user[1], 'snakeman');
      } catch (e) {
        expect(e).toBeInstanceOf(InternalError);
        expect(e.message).toBe(MOVIE_CREATION_ERROR);
      }
    });

    test('should successfully create a movie', async () => {
      movieRepository.getMovieCountByUser.mockImplementation(() => 4);
      MovieAdaptor.getMovie.mockImplementation(() => ({}));
      movieRepository.createMovie.mockImplementation(() => ({}));

      await movieService.createMovie(user[0], 'snakeman');
    });
  });

  describe('getMovieByUser', () => {
    test('should throw Invalid Arguments', async () => {
      try {
        await movieService.getMovieByUser();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should return movie by user', async () => {
      const movie = {
        userId: 123,
        title: 'Island Man',
        released: new Date(),
        genre: 'Action',
        director: 'Marcus Hodge',
      };

      movieRepository.getMovieByUser.mockImplementation(() => movie);

      const result = await movieService.getMovieByUser(123);
      expect(result).toMatchObject(movie);
    });
  });
});
