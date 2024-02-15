require('dotenv').config();

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

const config = {
  "development": {
    "sequelize": {
      "username": user,
      "password": password,
      "database": name,
      "host": host,
      "port": port,
      "dialect": "mysql",
      "define": {
        "freezeTableName": true,
      },
      "logging": false,
    },
    "token": token,
    "prefix": prefix,
    "version": version,
    "owner": owner,
  },
}

module.exports = config[env];