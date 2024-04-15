
const { Sequelize } = require('sequelize');
const { config } = require('./config/config');
const sequelize = new Sequelize(config.sequelize);
const models = {
  Carta: require('./models/carta')(sequelize),
  Jugador: require('./models/jugador')(sequelize),
  Cromo: require('./models/cromo')(sequelize)
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { models };
