'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
  class Carta extends Model {
    static associate(models) {
      // define association here
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