'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Jugador extends Model {
    static associate(models) {
      Jugador.belongsToMany(models.Carta, { through: 'Cromo', as: 'cartas' });
    }
  }
  Jugador.init({
    nombre: DataTypes.STRING,
    id_discord: DataTypes.BIGINT,
    id_servidor: DataTypes.BIGINT,
    rolls: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    freerolls: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    recycle_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    coins: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Jugador',
  });
  return Jugador;
};