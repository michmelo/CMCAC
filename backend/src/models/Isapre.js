const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Isapre = sequelize.define('Isapre', {
  id_isapre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_isapre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  porc_bono: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Porcentaje de bono (2, 3, 4, 5)'
  }
}, {
  tableName: 'isapres',
  timestamps: false
});

module.exports = Isapre;