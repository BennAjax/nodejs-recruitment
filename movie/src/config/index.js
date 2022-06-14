const dotenv = require('dotenv');

// load env configuration as early as possible
dotenv.config();
const appName = 'Netguru-Assessment';

const config = {
  applicationName: appName,
  port: process.env.PORT,
  mongodb: {
    dsn: process.env.MONGODB_URI,
    options: {
      dbName: 'netguru-movie',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

module.exports = config;
