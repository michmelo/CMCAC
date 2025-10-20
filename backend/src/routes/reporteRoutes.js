const express = require('express');
const router = express.Router();
const {
  obtenerResumenProfesion,
  obtenerDetallePorAuditor,
  obtenerTopAuditores,
  compararPeriodos,
  obtenerEstadisticasMes,
  obtenerVistaPrevia
} = require('../controllers/reporteController');

// Resumen por profesión
router.get('/resumen-profesion', obtenerResumenProfesion);

// Detalle por auditor
router.get('/detalle-auditor', obtenerDetallePorAuditor);

// Top auditores del mes
router.get('/top-auditores', obtenerTopAuditores);

// Comparar períodos
router.get('/comparar', compararPeriodos);

// Estadísticas del mes
router.get('/estadisticas', obtenerEstadisticasMes);

// Vista previa
router.get('/vista-previa', obtenerVistaPrevia);

module.exports = router;