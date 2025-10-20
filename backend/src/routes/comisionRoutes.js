const express = require('express');
const router = express.Router();
const {
  procesarComisionesMes,
  consultarPorAuditor,
  calcularComision,
  obtenerResumenMes,
  obtenerDetalleMes
} = require('../controllers/comisionController');

// Procesar comisiones del mes
router.post('/procesar', procesarComisionesMes);

// Consultar comisiones por auditor
router.get('/consultar', consultarPorAuditor);

// Calcular comisión (simulación)
router.post('/calcular', calcularComision);

// Obtener resumen del mes
router.get('/resumen', obtenerResumenMes);

// Obtener detalle del mes
router.get('/detalle', obtenerDetalleMes);

module.exports = router;