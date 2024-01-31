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
        defaultValue:0
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
  },{
    sequelize,
    modelName: 'Cromo',
  });
  return Cromo;
};