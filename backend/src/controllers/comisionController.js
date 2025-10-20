const { executeQuery } = require('../config/database');
const {
  Auditor,
  Auditoria,
  Profesion,
  TipoContrato,
  Isapre,
  PorcMonto,
  PorcVolumen,
  ResumenComision,
  DetalleComision,
  ErrorProceso
} = require('../models');

// Procesar comisiones del mes
const procesarComisionesMes = async (req, res) => {
  let connection;
  
  try {
    const { mes, anio, limiteComision, truncarTablas } = req.body;

    // Validar parámetros
    if (!mes || !anio || !limiteComision) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const resultado = {
      mes,
      anio,
      limiteComision,
      truncarTablas,
      etapas: []
    };

    // Obtener conexión para transacción
    const { getConnection } = require('../config/database');
    connection = await getConnection();
    
    // Iniciar transacción explícitamente
    await connection.beginTransaction();

    // Truncar tablas si se solicita
    if (truncarTablas) {
      await ResumenComision.destroy({ where: {} });
      await DetalleComision.destroy({ where: {} });
      await ErrorProceso.destroy({ where: {} });
      resultado.etapas.push('Tablas truncadas');
    }

    // Obtener todas las profesiones
    const profesiones = await Profesion.findAll();
    resultado.profesiones_procesadas = profesiones.length;

    // Obtener auditores activos
    const auditores = await Auditor.findAll({
      where: { activo: true }
    });
    resultado.auditores_evaluados = auditores.length;

    // Obtener auditorías finalizadas del mes
    const primerDia = new Date(anio, mes - 1, 1);
    const ultimoDia = new Date(anio, mes, 0);

    const auditorias = await Auditoria.findAll({
      where: {
        fecha_finalizacion: {
          between: [primerDia, ultimoDia]
        },
        estado: 'finalizada'
      }
    });
    resultado.auditorias_finalizadas = auditorias.length;

    // Obtener tablas de porcentajes
    const rangosMontos = await PorcMonto.findAll({ 
      order: [['monto_minimo', 'ASC']]
    });
    const rangosVolumen = await PorcVolumen.findAll({ 
      order: [['cantidad_minima', 'ASC']]
    });

    let totalComisiones = 0;
    let auditoresConComision = 0;
    let auditoresSinAuditorias = 0;
    let limitesExcedidos = 0;

    // Procesar cada auditor
    for (const auditor of auditores) {
      // Filtrar auditorías del auditor
      const auditoriasAuditor = auditorias.filter(
        a => a.ID_AUDITOR === auditor.ID_AUDITOR
      );

      if (auditoriasAuditor.length === 0) {
        auditoresSinAuditorias++;
        continue;
      }

      // Calcular totales del auditor
      const cantidadAuditorias = auditoriasAuditor.length;
      const montoTotal = auditoriasAuditor.reduce(
        (sum, a) => sum + parseFloat(a.MONTO_AUDITORIA), 
        0
      );

      // Calcular comisión por monto
      const porcMonto = calcularPorcentajeMonto(montoTotal, rangosMontos);
      const comisionMonto = montoTotal * (porcMonto / 100);

      // Calcular comisión por volumen
      const porcVolumen = calcularPorcentajeVolumen(cantidadAuditorias, rangosVolumen);
      const comisionVolumen = montoTotal * (porcVolumen / 100);

      // Subtotal
      const subtotal = comisionMonto + comisionVolumen;

      // Incentivo por tipo de contrato
      const incentivoContrato = subtotal * (auditor.PORC_INCENTIVO / 100);

      // Bonificación por profesión
      const bonifProfesion = subtotal * (auditor.PORC_BONIFICACION / 100);

      // Bono ISAPRE
      const bonoIsapre = auditor.PORC_BONO 
        ? subtotal * (auditor.PORC_BONO / 100) 
        : 0;

      // Comisión total
      let comisionTotal = subtotal + incentivoContrato + bonifProfesion + bonoIsapre;
      let limiteAplicado = false;

      // Validar límite
      if (comisionTotal > limiteComision) {
        comisionTotal = limiteComision;
        limiteAplicado = true;
        limitesExcedidos++;

        // Registrar en error_proceso
        await ErrorProceso.create({
          sentencia_error: 'LIMITE_EXCEDIDO',
          mensaje_error: `Comisión original excedió el límite. Ajustada a $${limiteComision}`
        });
      }

      // Insertar en detalle_comisiones
      await DetalleComision.create({
        mes,
        anio,
        run_auditor: auditor.NUMRUN + auditor.DVRUN,
        nombre_auditor: auditor.NOMBRE,
        nombre_profesion: auditor.NOMBRE_PROFESION,
        comision_total_audit: comisionTotal,
        comision_monto_audit: comisionMonto,
        comision_prof_critica: bonifProfesion,
        comision_extra: incentivoContrato + bonoIsapre,
        total_comision_audit: comisionTotal,
        total_comision_empresa: comisionTotal
      });

      totalComisiones += comisionTotal;
      auditoresConComision++;
    }

    // Generar resumen por profesión
    for (const profesion of profesiones) {
      const detallesProfesion = await DetalleComision.findAll({
        where: { mes, anio }
      });

      // Filtrar por profesión
      const detallesFiltrados = detallesProfesion.filter(d => {
        const auditorProfesion = auditores.find(a => a.RUN_AUDITOR === d.RUN_AUDITOR);
        return auditorProfesion && auditorProfesion.ID_PROFESION === profesion.ID_PROFESION;
      });

      if (detallesFiltrados.length > 0) {
        const totalAuditores = detallesFiltrados.length;
        const totalAuditorias = detallesFiltrados.length; // Cada registro representa un auditor
        const montoTotalAuditorias = detallesFiltrados.reduce(
          (sum, d) => sum + parseFloat(d.TOTAL_COMISION_AUDIT), 
          0
        );
        const totalComisionesProfesion = detallesFiltrados.reduce(
          (sum, d) => sum + parseFloat(d.TOTAL_COMISION_AUDIT), 
          0
        );

        await ResumenComision.create({
          mes,
          anio,
          nombre_profesion: profesion.NOMBRE_PROFESION,
          total_auditores: totalAuditores,
          total_con_auditorias: totalAuditorias,
          total_sin_auditorias: 0, // Se puede calcular si es necesario
          monto_total_auditorias: montoTotalAuditorias,
          monto_total_comisiones: totalComisionesProfesion
        });
      }
    }

    // Commit de la transacción
    await connection.commit();

    resultado.auditores_con_comision = auditoresConComision;
    resultado.auditores_sin_auditorias = auditoresSinAuditorias;
    resultado.total_comisiones = totalComisiones;
    resultado.limites_excedidos = limitesExcedidos;
    resultado.promedio_comision = auditoresConComision > 0 
      ? totalComisiones / auditoresConComision 
      : 0;

    res.json({
      success: true,
      mensaje: 'Procesamiento completado exitosamente',
      resultado
    });

  } catch (error) {
    if (connection) {
      try {
        // Verificar si hay transacción activa antes del rollback
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Error durante rollback:', rollbackError);
      }
    }
    console.error('Error en procesamiento:', error);
    res.status(500).json({ 
      error: 'Error en el procesamiento de comisiones',
      detalle: error.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error cerrando conexión:', err);
      }
    }
  }
};

// Funciones auxiliares
function calcularPorcentajeMonto(monto, rangos) {
  for (const rango of rangos) {
    if (monto >= rango.MONTO_AUDIT_MIN && 
        (rango.MONTO_AUDIT_MAX === null || monto <= rango.MONTO_AUDIT_MAX)) {
      return parseFloat(rango.PORC_MONTO_AUDIT);
    }
  }
  return 0;
}

function calcularPorcentajeVolumen(cantidad, rangos) {
  for (const rango of rangos) {
    if (cantidad >= rango.TOTAL_AUDIT_MIN && 
        (rango.TOTAL_AUDIT_MAX === null || cantidad <= rango.TOTAL_AUDIT_MAX)) {
      return parseFloat(rango.PORC_TOTAL_AUDIT);
    }
  }
  return 0;
}

// Consultar comisiones por auditor
const consultarPorAuditor = async (req, res) => {
  try {
    const { runAuditor, mes, anio } = req.query;

    if (!runAuditor) {
      return res.status(400).json({ error: 'RUN de auditor requerido' });
    }

    const where = { run_auditor: runAuditor };
    if (mes) where.mes = mes;
    if (anio) where.anio = anio;

    const comisiones = await DetalleComision.findAll({
      where,
      order: [['anio', 'DESC'], ['mes', 'DESC']]
    });

    res.json(comisiones);
  } catch (error) {
    console.error('Error en consulta:', error);
    res.status(500).json({ error: 'Error al consultar comisiones' });
  }
};

// Calcular comisión (simulación)
const calcularComision = async (req, res) => {
  try {
    const {
      montoAuditorias,
      cantidadAuditorias,
      idTipoContrato,
      idProfesion,
      idIsapre
    } = req.body;

    // Obtener datos
    const rangosMontos = await PorcMonto.findAll({ order: [['monto_minimo', 'ASC']] });
    const rangosVolumen = await PorcVolumen.findAll({ order: [['cantidad_minima', 'ASC']] });
    const tipoContrato = await TipoContrato.findByPk(idTipoContrato);
    const profesion = await Profesion.findByPk(idProfesion);
    const isapre = idIsapre ? await Isapre.findByPk(idIsapre) : null;

    // Calcular
    const porcMonto = calcularPorcentajeMonto(montoAuditorias, rangosMontos);
    const comisionMonto = montoAuditorias * (porcMonto / 100);

    const porcVolumen = calcularPorcentajeVolumen(cantidadAuditorias, rangosVolumen);
    const comisionVolumen = montoAuditorias * (porcVolumen / 100);

    const subtotal = comisionMonto + comisionVolumen;

    const incentivoContrato = subtotal * (tipoContrato.PORC_INCENTIVO / 100);
    const bonifProfesion = subtotal * (profesion.PORC_BONIFICACION / 100);
    const bonoIsapre = isapre ? subtotal * (isapre.PORC_BONO / 100) : 0;

    const total = subtotal + incentivoContrato + bonifProfesion + bonoIsapre;

    res.json({
      montoAuditorias,
      cantidadAuditorias,
      comisionMonto,
      porcMonto,
      comisionVolumen,
      porcVolumen,
      subtotal,
      incentivoContrato,
      porcContrato: tipoContrato.PORC_INCENTIVO,
      bonifProfesion,
      porcProfesion: profesion.PORC_BONIFICACION,
      bonoIsapre,
      porcIsapre: isapre ? isapre.PORC_BONO : 0,
      comisionTotal: total
    });

  } catch (error) {
    console.error('Error en cálculo:', error);
    res.status(500).json({ error: 'Error al calcular comisión' });
  }
};

// Obtener resumen del mes
const obtenerResumenMes = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'Mes y año requeridos' });
    }

    const resumen = await ResumenComision.findAll({
      where: { mes, anio },
      order: [['total_comisiones', 'DESC']]
    });

    res.json(resumen);
  } catch (error) {
    console.error('Error en resumen:', error);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
};

// Obtener detalle del mes
const obtenerDetalleMes = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'Mes y año requeridos' });
    }

    const detalle = await DetalleComision.findAll({
      where: { mes, anio },
      order: [['comision_total', 'DESC']]
    });

    res.json(detalle);
  } catch (error) {
    console.error('Error en detalle:', error);
    res.status(500).json({ error: 'Error al obtener detalle' });
  }
};

module.exports = {
  procesarComisionesMes,
  consultarPorAuditor,
  calcularComision,
  obtenerResumenMes,
  obtenerDetalleMes
};