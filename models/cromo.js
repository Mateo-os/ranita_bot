'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Cromo extends Model {
    static associate(models) {
    }
  }
  Cromo.init({
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue:1
    },
  },{
    sequelize,
    modelName: 'Cromo',
  });
  return Cromo;
};