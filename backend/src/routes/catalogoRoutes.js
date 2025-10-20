const express = require('express');
const router = express.Router();
const { Profesion, TipoContrato, Isapre, PorcMonto, PorcVolumen } = require('../models');

// Obtener profesiones
router.get('/profesiones', async (req, res) => {
  try {
    const profesiones = await Profesion.findAll({ order: [['nombre_profesion', 'ASC']] });
    res.json(profesiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener tipos de contrato
router.get('/tipos-contrato', async (req, res) => {
  try {
    const tipos = await TipoContrato.findAll();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener ISAPREs
router.get('/isapres', async (req, res) => {
  try {
    const isapres = await Isapre.findAll({ order: [['nombre_isapre', 'ASC']] });
    res.json(isapres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener rangos de porcentaje por monto
router.get('/porc-monto', async (req, res) => {
  try {
    const rangos = await PorcMonto.findAll({ order: [['monto_minimo', 'ASC']] });
    res.json(rangos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener rangos de porcentaje por volumen
router.get('/porc-volumen', async (req, res) => {
  try {
    const rangos = await PorcVolumen.findAll({ order: [['cantidad_minima', 'ASC']] });
    res.json(rangos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;