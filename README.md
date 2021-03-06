# Movie service
[![movie-ci](https://github.com/BennAjax/nodejs-recruitment/actions/workflows/ci.yml/badge.svg)](https://github.com/BennAjax/nodejs-recruitment/actions/workflows/ci.yml)

1. Auth Microservice 
1. Movie Microservice


### Prerequisites

You need to have &nbsp;`docker` &nbsp;and &nbsp;`docker-compose`&nbsp; installed on your computer to run the service

&nbsp;
### Run locally

1. Clone this repository
1. Run from root dir

```
JWT_SECRET=secret docker-compose up 
```

By default the auth service will start on &nbsp; `http://localhost:3000` &nbsp;and movie service with start on &nbsp;`http://localhost:4000`.


To stop the services run

```
docker-compose down
```
&nbsp;
### Technology stack
- Node.js (Javascript)
- Express.js
- MongoDB 
- Mongoose
- Jest 
- Super Test
- Swagger UI

&nbsp;
### Documentation
Visit &nbsp;`http://localhost:4000/docs` &nbsp; when the service is started

&nbsp;
### Running Tests

To run tests, add .env from .env.example, install modules and  run the following command

```
  cd movie && npm run test
```

&nbsp;
### Improvements
The following improvments could be made in a real-world scenerio

- API Gateway for microservice
- Use Typescript
- Use Clean Architecture: Uncle Bob (for easy scalibility)
- Use pre commit hooks

