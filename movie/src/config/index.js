const dotenv = require('dotenv');

// load env configuration as early as possible
dotenv.config();
const appName = 'Netguru-Assessment';
// TODO: verify every here is
const config = {
  applicationName: appName,
  port: process.env.PORT,
  mongodb: {
    dsn: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    options: {
      dbName: 'netguru-movie',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

module.exports = config;
