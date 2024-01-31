'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Jugador extends Model {
    static associate(models) {
      Jugador.belongsToMany(models.Carta, {through: 'Cromo', as: 'cartas'});
    }
  }
  Jugador.init({
    nombre: DataTypes.STRING,
    id_discord: DataTypes.BIGINT,
    id_servidor: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Jugador',
  });
  return Jugador;
};