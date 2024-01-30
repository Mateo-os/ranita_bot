// sequelize.js

const { Sequelize } = require('sequelize');
const config = require('./config/config');
const sequelize = new Sequelize(config.development);

const models = {
  Carta: require('./models/carta')(sequelize),
  // Add other models here
};

module.exports = { sequelize, models };
