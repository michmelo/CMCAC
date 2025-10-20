const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TipoContrato = sequelize.define('TipoContrato', {
  id_tipo_contrato: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_contrato: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  porc_incentivo: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Porcentaje de incentivo (1, 2, 3)'
  }
}, {
  tableName: 'tipos_contrato',
  timestamps: false
});

module.exports = TipoContrato;