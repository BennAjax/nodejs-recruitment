const { createMovie, createMovieBody, getMovie } = require('./movie');

const apiDocumentation = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'Movie API - Documentation',
    description: 'A documentation for a microservice based movie API',
    termsOfService: '',
    contact: {
      name: 'Ochuko Oseaje',
      email: 'bennkeys1@gmail.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000/',
      description: 'Local Server',
    },
  ],
  tags: [
    {
      name: 'Movies',
    },
  ],
  paths: {
    '/movies': {
      get: getMovie,
      post: createMovie,
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      createMovieBody,
    },
  },
};

module.exports = apiDocumentation;
