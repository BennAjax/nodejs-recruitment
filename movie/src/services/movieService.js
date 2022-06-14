const movieRepository = require('../data/repository/movieRepository');
const MovieAdaptor = require('../adaptors/OmdbAdaptor');
const {
  BASIC_USER,
  QUOTA_EXCEEDED_MESSAGE,
  MOVIE_ADAPTOR_ERROR,
  MOVIE_CREATION_ERROR,
  INVALID_ARGUMENT,
} = require('../lib/constants');
const UnauthorizedError = require('../lib/errors/UnauthorizedError');
const InternalError = require('../lib/errors/InternalError');

const createMovie = async (user, title) => {
  if (!user || !title) throw new Error(INVALID_ARGUMENT);

  if (user.role === BASIC_USER) {
    const movieCount = await movieRepository.getMovieCountByUser(user.userId);
    if (movieCount > 4) throw new UnauthorizedError(QUOTA_EXCEEDED_MESSAGE);
  }

  const movie = await MovieAdaptor.getMovie(title);
  if (!movie) throw new InternalError(MOVIE_ADAPTOR_ERROR);

  const data = {
    userId: user.userId,
    title: movie.Title,
    released: movie.Released === 'N/A' ? new Date() : new Date(movie.Released),
    genre: movie.Genre,
    director: movie.Director,
  };

  try {
    await movieRepository.createMovie(data);
  } catch (e) {
    throw new InternalError(MOVIE_CREATION_ERROR);
  }
};

const getMovieByUser = (userId) => {
  if (!userId) throw new Error(INVALID_ARGUMENT);

  return movieRepository.getMovieByUser(userId);
};

module.exports = { createMovie, getMovieByUser };
