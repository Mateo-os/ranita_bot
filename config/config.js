require('dotenv').config();
const sequelize = require('./sequelize');

const env = process.env.NODE_ENV || 'development';
const host = (process.env.DBHOST || 'localhost');
const port = (process.env.PORT || 3306);
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD;
const name = process.env.DBNAME;
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const version = process.env.VERSION;
const owner = process.env.IDOWNER;

const Config = {
  "development": {
    "sequelize": {},
    "token": token,
    "prefix": prefix,
    "version": version,
    "owner": owner,
  },
}

const config = Config[env];
config.sequelize = sequelize[env];
module.exports = config;