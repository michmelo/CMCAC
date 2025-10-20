const express = require('express');
const router = express.Router();
const { ErrorProceso } = require('../models');
const { sequelize } = require('../config/database');

// Obtener errores con filtros
router.get('/', async (req, res) => {
  try {
    const { mes, anio, tipoError } = req.query;
    const where = {};
    
    if (mes) where.mes = mes;
    if (anio) where.anio = anio;
    if (tipoError) where.tipo_error = tipoError;

    const errores = await ErrorProceso.findAll({
      where,
      order: [['fecha_error', 'DESC']]
    });
    res.json(errores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener estadísticas de errores
router.get('/estadisticas', async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const where = {};
    
    if (mes) where.mes = mes;
    if (anio) where.anio = anio;

    // Total de errores
    const totalErrores = await ErrorProceso.count({ where });

    // Errores por tipo
    const erroresPorTipo = await ErrorProceso.findAll({
      where,
      attributes: [
        'tipo_error',
        [sequelize.fn('COUNT', sequelize.col('tipo_error')), 'cantidad']
      ],
      group: ['tipo_error']
    });

    // Excesos de límite
    const excesosLimite = await ErrorProceso.count({
      where: { ...where, tipo_error: 'LIMITE_EXCEDIDO' }
    });

    res.json({
      totalErrores,
      excesosLimite,
      erroresPorTipo,
      tasaExito: totalErrores > 0 ? 
        ((1 - (totalErrores / 100)) * 100).toFixed(2) : 100
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Limpiar errores
router.delete('/limpiar', async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const where = {};
    
    if (mes) where.mes = mes;
    if (anio) where.anio = anio;

    const eliminados = await ErrorProceso.destroy({ where });
    
    res.json({ 
      message: 'Errores eliminados correctamente',
      cantidad: eliminados
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;