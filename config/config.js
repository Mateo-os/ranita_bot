require('dotenv').config();

const port = (process.env.PORT || 3306);
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD
const name = process.env.DBNAME

const config = {
    "development": {
      "username": user,
      "password": password,
      "database": name,
      "host": "localhost",
      "port": port,
      "dialect": "mysql",
      "define":{
        "freezeTableName":true,
      },
      "logging":false,
    },
}
module.exports = config;