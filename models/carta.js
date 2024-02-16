'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Carta extends Model {
    static associate(models) {
      Carta.belongsToMany(models.Jugador, {through: 'Cromo', as: 'poseedores'});
    }
  }
  Carta.init({
    nombre: {
      type: DataTypes.STRING,
      unique: 'compositeIndex' // Adding unique constraint for the nombre, serie pair
    },
    serie: {
      type: DataTypes.STRING,
      unique: 'compositeIndex' // Adding unique constraint for the nombre, serie pair
    },
    rareza: DataTypes.INTEGER,
    numero: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Carta',
  });
  return Carta;
};
