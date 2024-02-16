require('dotenv').config();

const host = (process.env.DBHOST || 'localhost');
const port = (process.env.PORT || 3306);
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD;
const name = process.env.DBNAME;

const config ={
    "development": {
        "username": user,
        "password": password,
        "database": name,
        "host": host,
        "port": port,
        "dialect": "mysql",
        "logging": false,
        "define": {
        "freezeTableName": true,
        }, 
    }
}

module.exports = config;