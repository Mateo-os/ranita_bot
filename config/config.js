require('dotenv').config();

const port = (process.env.PORT || 3306);

const config = {
    "development": {
      "username": "Ranita",
      "password": "ribbit",
      "database": "las3ranas",
      "host": "localhost",
      "port": port,
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "root",
      "password": null,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
}
module.exports = config;