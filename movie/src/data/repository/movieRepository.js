const Movie = require('../models/Movie');

const createMovie = async (data) => Movie.create(data);
const getMovieByUser = async (userId) => Movie.find({ userId });
const getMovieCountByUser = async (userId) => {
  const result = await Movie.aggregate([
    { $project: { userId: 1, month: { $month: '$createdAt' } } },
    { $match: { userId, month: new Date().getMonth() + 1 } },
    { $count: 'movies' },
  ]);

  return result.length > 0 ? result[0].movies : 0;
};
module.exports = { createMovie, getMovieByUser, getMovieCountByUser };
