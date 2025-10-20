const express = require('express');
const router = express.Router();
const { Auditor, Profesion, TipoContrato, Isapre } = require('../models');

// Obtener todos los auditores
router.get('/', async (req, res) => {
  try {
    const auditores = await Auditor.findAll({
      include: [
        { model: Profesion, as: 'profesion' },
        { model: TipoContrato, as: 'tipoContrato' },
        { model: Isapre, as: 'isapre' }
      ]
    });
    res.json(auditores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener auditor por RUN
router.get('/:run', async (req, res) => {
  try {
    const auditor = await Auditor.findByPk(req.params.run, {
      include: [
        { model: Profesion, as: 'profesion' },
        { model: TipoContrato, as: 'tipoContrato' },
        { model: Isapre, as: 'isapre' }
      ]
    });
    if (!auditor) {
      return res.status(404).json({ error: 'Auditor no encontrado' });
    }
    res.json(auditor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear auditor
router.post('/', async (req, res) => {
  try {
    const auditor = await Auditor.create(req.body);
    res.status(201).json(auditor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar auditor
router.put('/:run', async (req, res) => {
  try {
    const auditor = await Auditor.findByPk(req.params.run);
    if (!auditor) {
      return res.status(404).json({ error: 'Auditor no encontrado' });
    }
    await auditor.update(req.body);
    res.json(auditor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar auditor (desactivar)
router.delete('/:run', async (req, res) => {
  try {
    const auditor = await Auditor.findByPk(req.params.run);
    if (!auditor) {
      return res.status(404).json({ error: 'Auditor no encontrado' });
    }
    await auditor.update({ activo: false });
    res.json({ message: 'Auditor desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;