const joi = require('joi');

const movieSchema = joi.object({
  title: joi.string().required(),
});

module.exports = movieSchema;
