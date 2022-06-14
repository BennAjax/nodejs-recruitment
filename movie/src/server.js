const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const config = require('./config');
const APIError = require('./lib/errors/APIError');
const routes = require('./routes');
const apiDocumentation = require('../docs/apidocumentation');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(helmet());

// initialize mongodb connection with mongoose
// TODO: use the logger instead of the debugger
if (!process.env.TEST) {
  mongoose
    .connect(config.mongodb.dsn, config.mongodb.options)
    .then(() => console.log('Successfully connected to MongoDb'))
    .catch((err) => console.log('Could not connect to MongoDb', err));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(apiDocumentation));

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => res.status(404).json({ error: 'Resource Not Found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.status).json({ status: err.message });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  if (!process.env.TEST) console.log(`Server Running on Port ${PORT}`);
});

module.exports = server;
