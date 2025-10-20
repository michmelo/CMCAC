const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PorcMonto = sequelize.define('PorcMonto', {
  id_rango: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  monto_minimo: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  monto_maximo: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'NULL = sin límite superior'
  },
  porcentaje: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  }
}, {
  tableName: 'porc_monto_auditorias',
  timestamps: false
});

module.exports = PorcMonto;