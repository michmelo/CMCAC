const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Auditoria = sequelize.define('Auditoria', {
  id_auditoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  run_auditor: {
    type: DataTypes.STRING(12),
    allowNull: false,
    references: {
      model: 'auditores',
      key: 'run_auditor'
    }
  },
  fecha_finalizacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha de finalización de la auditoría'
  },
  monto_auditoria: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  tipo_auditoria: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Financiera, Económica, Administrativa, etc.'
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'finalizada',
    comment: 'finalizada, en_proceso, pendiente'
  }
}, {
  tableName: 'auditorias',
  timestamps: true
});

module.exports = Auditoria;