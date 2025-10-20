const { executeQuery, executeQueryMany } = require('../config/database');
const {
  ResumenComision,
  DetalleComision,
  Profesion,
  Auditor,
  Auditoria
} = require('../models');

// Obtener resumen por profesión
const obtenerResumenProfesion = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'Mes y año requeridos' });
    }

    const resumen = await ResumenComision.findAll({
      where: { mes, anio },
      order: [['total_comisiones', 'DESC']]
    });

    // Calcular totales generales
    const totales = resumen.reduce((acc, item) => ({
      totalAuditores: acc.totalAuditores + item.TOTAL_AUDITORES,
      totalAuditorias: acc.totalAuditorias + item.TOTAL_AUDITORIAS,
      totalMontoAuditorias: acc.totalMontoAuditorias + parseFloat(item.MONTO_TOTAL_AUDITORIAS),
      totalComisiones: acc.totalComisiones + parseFloat(item.TOTAL_COMISIONES)
    }), {
      totalAuditores: 0,
      totalAuditorias: 0,
      totalMontoAuditorias: 0,
      totalComisiones: 0
    });

    res.json({
      mes,
      anio,
      resumen,
      totales
    });

  } catch (error) {
    console.error('Error en resumen por profesión:', error);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
};

// Obtener detalle por auditor
const obtenerDetallePorAuditor = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'Mes y año requeridos' });
    }

    const detalle = await DetalleComision.findAll({
      where: { mes, anio },
      order: [['comision_total', 'DESC']]
    });

    res.json({
      mes,
      anio,
      detalle,
      total: detalle.length
    });

  } catch (error) {
    console.error('Error en detalle por auditor:', error);
    res.status(500).json({ error: 'Error al obtener detalle' });
  }
};

// Obtener top auditores
const obtenerTopAuditores = async (req, res) => {
  try {
    const { mes, anio, limite = 10 } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'Mes y año requeridos' });
    }

    const topAuditores = await DetalleComision.findAll({
      where: { mes, anio },
      order: [['comision_total', 'DESC']]
    });
    
    // Limitar resultados
    const topAuditoresLimitados = topAuditores.slice(0, parseInt(limite));

    res.json(topAuditoresLimitados);

  } catch (error) {
    console.error('Error en top auditores:', error);
    res.status(500).json({ error: 'Error al obtener top auditores' });
  }
};

// Comparar períodos
const compararPeriodos = async (req, res) => {
  try {
    const { mes1, anio1, mes2, anio2 } = req.query;

    if (!mes1 || !anio1 || !mes2 || !anio2) {
      return res.status(400).json({ error: 'Se requieren dos períodos completos' });
    }

    const periodo1 = await ResumenComision.findAll({
      where: { mes: mes1, anio: anio1 }
    });

    const periodo2 = await ResumenComision.findAll({
      where: { mes: mes2, anio: anio2 }
    });

    // Calcular totales de cada período
    const calcularTotales = (data) => data.reduce((acc, item) => ({
      totalComisiones: acc.totalComisiones + parseFloat(item.TOTAL_COMISIONES),
      totalAuditorias: acc.totalAuditorias + item.TOTAL_AUDITORIAS,
      totalAuditores: acc.totalAuditores + item.TOTAL_AUDITORES
    }), { totalComisiones: 0, totalAuditorias: 0, totalAuditores: 0 });

    const totales1 = calcularTotales(periodo1);
    const totales2 = calcularTotales(periodo2);

    // Calcular variaciones
    const variaciones = {
      comisiones: totales2.totalComisiones - totales1.totalComisiones,
      comisionesPorcentaje: totales1.totalComisiones > 0 
        ? ((totales2.totalComisiones - totales1.totalComisiones) / totales1.totalComisiones * 100)
        : 0,
      auditorias: totales2.totalAuditorias - totales1.totalAuditorias,
      auditores: totales2.totalAuditores - totales1.totalAuditores
    };

    res.json({
      periodo1: {
        mes: mes1,
        anio: anio1,
        datos: periodo1,
        totales: totales1
      },
      periodo2: {
        mes: mes2,
        anio: anio2,
        datos: periodo2,
        totales: totales2
      },
      variaciones
    });

  } catch (error) {
    console.error('Error en comparación de períodos:', error);
    res.status(500).json({ error: 'Error al comparar períodos' });
  }
};

// Obtener estadísticas generales del mes
const obtenerEstadisticasMes = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'Mes y año requeridos' });
    }

    // Total comisiones
    const totalComisionesResult = await executeQuery(
      'SELECT SUM(comision_total) as total FROM detalle_comisiones_auditorias_mes WHERE mes = :mes AND anio = :anio',
      [mes, anio]
    );
    const totalComisiones = totalComisionesResult.rows?.[0]?.TOTAL || 0;

    // Cantidad de auditores con comisión
    const auditoresConComisionResult = await executeQuery(
      'SELECT COUNT(*) as total FROM detalle_comisiones_auditorias_mes WHERE mes = :mes AND anio = :anio',
      [mes, anio]
    );
    const auditoresConComision = auditoresConComisionResult.rows?.[0]?.TOTAL || 0;

    // Cantidad de auditorías del período
    const primerDia = new Date(anio, mes - 1, 1);
    const ultimoDia = new Date(anio, mes, 0);

    const totalAuditoriasResult = await executeQuery(
      'SELECT COUNT(*) as total FROM auditorias WHERE fecha_finalizacion BETWEEN :fecha_inicio AND :fecha_fin AND estado = :estado',
      [primerDia, ultimoDia, 'finalizada']
    );
    const totalAuditorias = totalAuditoriasResult.rows?.[0]?.TOTAL || 0;

    // Promedio por auditor
    const promedioPorAuditor = auditoresConComision > 0 
      ? totalComisiones / auditoresConComision 
      : 0;

    // Comisión máxima y mínima
    const comisionMaximaResult = await executeQuery(
      'SELECT MAX(comision_total) as maximo FROM detalle_comisiones_auditorias_mes WHERE mes = :mes AND anio = :anio',
      [mes, anio]
    );
    const comisionMaxima = comisionMaximaResult.rows?.[0]?.MAXIMO || 0;

    const comisionMinimaResult = await executeQuery(
      'SELECT MIN(comision_total) as minimo FROM detalle_comisiones_auditorias_mes WHERE mes = :mes AND anio = :anio',
      [mes, anio]
    );
    const comisionMinima = comisionMinimaResult.rows?.[0]?.MINIMO || 0;

    // Auditores con límite aplicado
    const auditoresConLimiteResult = await executeQuery(
      'SELECT COUNT(*) as total FROM detalle_comisiones_auditorias_mes WHERE mes = :mes AND anio = :anio AND limite_aplicado = 1',
      [mes, anio]
    );
    const auditoresConLimite = auditoresConLimiteResult.rows?.[0]?.TOTAL || 0;

    res.json({
      mes,
      anio,
      totalComisiones: Math.round(totalComisiones),
      auditoresConComision,
      totalAuditorias,
      promedioPorAuditor: Math.round(promedioPorAuditor),
      comisionMaxima: Math.round(comisionMaxima),
      comisionMinima: Math.round(comisionMinima),
      auditoresConLimite
    });

  } catch (error) {
    console.error('Error en estadísticas del mes:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

// Obtener datos para vista previa
const obtenerVistaPrevia = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'Mes y año requeridos' });
    }

    // Obtener resumen por profesión
    const resumenProfesion = await ResumenComision.findAll({
      where: { mes, anio },
      order: [['total_comisiones', 'DESC']]
    });

    // Calcular auditores sin auditorías por profesión
    const auditoresPorProfesion = await executeQueryMany(`
      SELECT 
        p.id_profesion,
        p.nombre_profesion,
        COUNT(DISTINCT a.run_auditor) as total_auditores,
        COUNT(DISTINCT CASE WHEN d.run_auditor IS NOT NULL THEN a.run_auditor END) as con_auditorias
      FROM profesiones p
      LEFT JOIN auditores a ON p.id_profesion = a.id_profesion AND a.activo = 1
      LEFT JOIN detalle_comisiones_auditorias_mes d ON a.run_auditor = d.run_auditor 
        AND d.mes = :mes AND d.anio = :anio
      GROUP BY p.id_profesion, p.nombre_profesion
      ORDER BY p.nombre_profesion
    `, [mes, anio]);

    // Combinar datos
    const vistaPrevia = resumenProfesion.map(resumen => {
      const statProfesion = auditoresPorProfesion.find(
        stat => stat.ID_PROFESION === resumen.ID_PROFESION
      );
      
      return {
        mes,
        anio,
        profesion: resumen.NOMBRE_PROFESION,
        totalAuditores: statProfesion?.TOTAL_AUDITORES || 0,
        conAuditorias: resumen.TOTAL_AUDITORES,
        sinAuditorias: (statProfesion?.TOTAL_AUDITORES || 0) - resumen.TOTAL_AUDITORES,
        montoTotal: Math.round(parseFloat(resumen.MONTO_TOTAL_AUDITORIAS)),
        totalComisiones: Math.round(parseFloat(resumen.TOTAL_COMISIONES))
      };
    });

    res.json(vistaPrevia);

  } catch (error) {
    console.error('Error en vista previa:', error);
    res.status(500).json({ error: 'Error al obtener vista previa' });
  }
};

module.exports = {
  obtenerResumenProfesion,
  obtenerDetallePorAuditor,
  obtenerTopAuditores,
  compararPeriodos,
  obtenerEstadisticasMes,
  obtenerVistaPrevia
};