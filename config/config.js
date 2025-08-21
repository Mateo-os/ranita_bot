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
const albumURL = process.env.ALBUMURL;
const initial_rolls = (process.env.INITIALROLLS || 10) 
let botID = undefined;


const Config = {
  "development": {
    "sequelize": {},
    "albumURL": albumURL,
    "token": token,
    "prefix": prefix,
    "version": version,
    "owner": owner,
    "botID": () => botID,
    "initial_rolls":initial_rolls
  },
}


const config = Config[env];
config.sequelize = sequelize[env];

function setBotID(id){
  botID = id;
  config.botID = () => botID;
}

module.exports = { config, setBotID};