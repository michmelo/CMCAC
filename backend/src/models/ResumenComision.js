const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ResumenComision = sequelize.define('ResumenComision', {
  id_resumen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 12 }
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_profesion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profesiones',
      key: 'id_profesion'
    }
  },
  total_auditores: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_auditorias: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monto_total_auditorias: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  total_comisiones: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  }
}, {
  tableName: 'resumen_comisiones_auditorias_mes',
  timestamps: true
});

module.exports = ResumenComision;