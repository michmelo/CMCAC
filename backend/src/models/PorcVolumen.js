const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PorcVolumen = sequelize.define('PorcVolumen', {
  id_rango: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad_minima: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad_maxima: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'NULL = sin límite superior'
  },
  porcentaje: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  }
}, {
  tableName: 'porc_total_auditorias',
  timestamps: false
});

module.exports = PorcVolumen;