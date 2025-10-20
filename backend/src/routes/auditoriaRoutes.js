const express = require('express');
const router = express.Router();
const { Auditoria, Auditor } = require('../models');

// Obtener todas las auditorías
router.get('/', async (req, res) => {
  try {
    const { mes, anio, estado } = req.query;
    const where = {};
    
    if (estado) where.estado = estado;
    if (mes && anio) {
      const primerDia = new Date(anio, mes - 1, 1);
      const ultimoDia = new Date(anio, mes, 0);
      where.fecha_finalizacion = {
        [require('../config/database').sequelize.Sequelize.Op.between]: [primerDia, ultimoDia]
      };
    }

    const auditorias = await Auditoria.findAll({
      where,
      include: [{ model: Auditor, as: 'auditor' }],
      order: [['fecha_finalizacion', 'DESC']]
    });
    res.json(auditorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear auditoría
router.post('/', async (req, res) => {
  try {
    const auditoria = await Auditoria.create(req.body);
    res.status(201).json(auditoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar auditoría
router.put('/:id', async (req, res) => {
  try {
    const auditoria = await Auditoria.findByPk(req.params.id);
    if (!auditoria) {
      return res.status(404).json({ error: 'Auditoría no encontrada' });
    }
    await auditoria.update(req.body);
    res.json(auditoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;