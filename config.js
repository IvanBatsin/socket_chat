const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: __dirname + '/.env'});

module.exports = {
  PORT: process.env.PORT || 3000
}