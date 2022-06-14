const movieService = require('../services/movieService');

const createMovie = (req, res, next) =>
  movieService
    .createMovie(req.user, req.body.title)
    .then(() => res.status(201).json({ status: 'Successful' }))
    .catch((err) => next(err));

const getMovieByUser = (req, res, next) =>
  movieService
    .getMovieByUser(req.user.userId)
    .then((results) => res.status(200).json(results))
    .catch((err) => next(err));

module.exports = { createMovie, getMovieByUser };
