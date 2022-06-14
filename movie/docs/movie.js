const createMovie = {
  tags: ['Movies'],
  description: 'Create a new movie',
  operationId: 'createMovie',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createMovieBody',
        },
      },
    },
    required: true,
  },
  responses: {
    201: {
      description: 'Movie created successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Successful',
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'title is required',
              },
            },
          },
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
};

const createMovieBody = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      example: 'Hello',
    },
  },
};

const getMovie = {
  tags: ['Movies'],
  description: 'Get list of movies created by user',
  operationId: 'GetMovie',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    200: {
      description: 'Get list movies',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                userId: {
                  type: 'number',
                  example: 123,
                },
                title: {
                  type: 'string',
                  example: 'hello',
                },
                released: {
                  type: 'date-time',
                  example: '2022-06-14T13:08:53.533Z',
                },
                genre: {
                  type: 'string',
                  example: 'Action',
                },
                director: {
                  type: 'string',
                  example: 'Marcus',
                },
              },
            },
          },
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
};

module.exports = { createMovie, createMovieBody, getMovie };
