'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
  class Carta extends Model {
    static associate(models) {
      Carta.belongsToMany(models.Jugador, {through: 'Cromo', as: 'poseedores'});
    }
  }
  Carta.init({
    nombre: DataTypes.STRING,
    serie: DataTypes.STRING,
    rareza: DataTypes.INTEGER,
    numero: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Carta',
  });
  return Carta;
};