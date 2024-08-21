require('dotenv').config();
const sequelize = require('./sequelize');

const serverConfig = require('./serverConfig.js');
const env = process.env.NODE_ENV || 'development';
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const version = process.env.VERSION;
const owner = process.env.IDOWNER;
const albumURL = process.env.ALBUMURL;
let botID = undefined;


const Config = {
  "development": {
    "sequelize": {},
    "serverConfig": serverConfig,
    "albumURL": albumURL,
    "token": token,
    "prefix": prefix,
    "version": version,
    "owner": owner,
    "botID": () => botID,
  },
}


const config = Config[env];
config.sequelize = sequelize[env];

function setBotID(id){
  botID = id;
  config.botID = () => botID;
}

module.exports = { config, setBotID};