require('dotenv').config();
const sequelize = require('./sequelize');

const serverConfig = require('./serverConfig.js');
const env = process.env.NODE_ENV || 'development';
const token = process.env.TOKEN;
const version = process.env.VERSION;
let botID = undefined;


const Config = {
  "development": {
    "sequelize": {},
    "serverConfig": serverConfig,
    "token": token,
    "version": version,
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