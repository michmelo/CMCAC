const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ErrorProceso = sequelize.define('ErrorProceso', {
  id_error: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_error: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  tipo_error: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'LIMITE_EXCEDIDO, ERROR_CALCULO, etc.'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  run_auditor: {
    type: DataTypes.STRING(12),
    allowNull: true
  },
  mes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'error_proceso',
  timestamps: false
});

module.exports = ErrorProceso;