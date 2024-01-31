// sequelize.js

const { Sequelize } = require('sequelize');
const config = require('./config/config');
const sequelize = new Sequelize(config.development);
const models = {
  Carta: require('./models/carta')(sequelize),
  Jugador: require('./models/jugador')(sequelize),
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { models };
