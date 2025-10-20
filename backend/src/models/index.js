const { executeQuery, executeQueryMany, executeQueryOne } = require('../config/database');

// Modelo Profesion
const Profesion = {
  async findAll() {
    const sql = 'SELECT * FROM PROFESION ORDER BY COD_PROFESION';
    return await executeQueryMany(sql);
  },

  async findByPk(id) {
    const sql = 'SELECT * FROM PROFESION WHERE COD_PROFESION = :id';
    return await executeQueryOne(sql, [id]);
  },

  async create(data) {
    const sql = `
      INSERT INTO PROFESION (COD_PROFESION, NOMBRE_PROFESION, NIVEL_CRITICIDAD) 
      VALUES (SEQ_ID_PROF.NEXTVAL, :nombre, :nivel)
    `;
    await executeQuery(sql, [data.nombre_profesion, data.nivel_criticidad]);
  }
};

// Modelo Auditor
const Auditor = {
  async findAll(options = {}) {
    let sql = `
      SELECT a.*, p.NOMBRE_PROFESION, 
             tc.NOMBRE_TPCONTRATO, tc.PORC_INCENTIVO,
             i.NOMBRE_ISAPRE
      FROM AUDITOR a
      LEFT JOIN PROFESION p ON a.COD_PROFESION = p.COD_PROFESION
      LEFT JOIN TIPO_CONTRATO tc ON a.COD_TPCONTRATO = tc.COD_TPCONTRATO
      LEFT JOIN ISAPRE i ON a.COD_ISAPRE = i.COD_ISAPRE
    `;
    
    const conditions = [];
    const binds = [];
    
    if (options.where) {
      if (options.where.activo !== undefined) {
        conditions.push('a.ACTIVO = :activo');
        binds.push(options.where.activo);
      }
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY a.ID_AUDITOR';
    
    return await executeQueryMany(sql, binds);
  },

  async findByPk(run) {
    const sql = `
      SELECT a.*, p.NOMBRE_PROFESION, 
             tc.NOMBRE_TPCONTRATO, tc.PORC_INCENTIVO,
             i.NOMBRE_ISAPRE
      FROM AUDITOR a
      LEFT JOIN PROFESION p ON a.COD_PROFESION = p.COD_PROFESION
      LEFT JOIN TIPO_CONTRATO tc ON a.COD_TPCONTRATO = tc.COD_TPCONTRATO
      LEFT JOIN ISAPRE i ON a.COD_ISAPRE = i.COD_ISAPRE
      WHERE a.ID_AUDITOR = :id
    `;
    return await executeQueryOne(sql, [run]);
  },

  async create(data) {
    const sql = `
      INSERT INTO AUDITOR (ID_AUDITOR, NUMRUN, DVRUN, COD_COMUNA, COD_PROFESION, APPATERNO, APMATERNO, NOMBRE, COD_ESTCIVIL, PUNTAJE) 
      VALUES (:id_auditor, :numrun, :dvrun, :cod_comuna, :cod_profesion, :appaterno, :apmaterno, :nombre, :cod_estcivil, :puntaje)
    `;
    await executeQuery(sql, [
      data.id_auditor, 
      data.numrun, 
      data.dvrun, 
      data.cod_comuna || null, 
      data.cod_profesion, 
      data.appaterno, 
      data.apmaterno, 
      data.nombre, 
      data.cod_estcivil, 
      data.puntaje || null
    ]);
  }
};

// Modelo TipoContrato
const TipoContrato = {
  async findAll() {
    const sql = 'SELECT * FROM TIPO_CONTRATO ORDER BY COD_TPCONTRATO';
    return await executeQueryMany(sql);
  },

  async findByPk(id) {
    const sql = 'SELECT * FROM TIPO_CONTRATO WHERE COD_TPCONTRATO = :id';
    return await executeQueryOne(sql, [id]);
  }
};

// Modelo Isapre
const Isapre = {
  async findAll() {
    const sql = 'SELECT * FROM ISAPRE ORDER BY COD_ISAPRE';
    return await executeQueryMany(sql);
  },

  async findByPk(id) {
    const sql = 'SELECT * FROM ISAPRE WHERE COD_ISAPRE = :id';
    return await executeQueryOne(sql, [id]);
  }
};

// Modelo Auditoria
const Auditoria = {
  async findAll(options = {}) {
    let sql = `
      SELECT a.*, au.NOMBRE
      FROM AUDITORIA a
      LEFT JOIN AUDITOR au ON a.ID_AUDITOR = au.ID_AUDITOR
    `;
    
    const conditions = [];
    const binds = [];
    
    if (options.where) {
      if (options.where.estado) {
        conditions.push('a.ESTADO = :estado');
        binds.push(options.where.estado);
      }
      if (options.where.fecha_finalizacion) {
        if (options.where.fecha_finalizacion.between) {
          conditions.push('a.FECHA_FINALIZACION BETWEEN :fecha_inicio AND :fecha_fin');
          binds.push(options.where.fecha_finalizacion.between[0]);
          binds.push(options.where.fecha_finalizacion.between[1]);
        }
      }
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    return await executeQueryMany(sql, binds);
  }
};

// Modelo PorcMonto
const PorcMonto = {
  async findAll(options = {}) {
    let sql = 'SELECT * FROM PORC_MONTO_AUDITORIAS';
    
    if (options.order) {
      const orderBy = options.order.map(([field, direction]) => `${field} ${direction}`).join(', ');
      sql += ` ORDER BY ${orderBy}`;
    } else {
      sql += ' ORDER BY MONTO_AUDIT_MIN ASC';
    }
    
    return await executeQueryMany(sql);
  }
};

// Modelo PorcVolumen
const PorcVolumen = {
  async findAll(options = {}) {
    let sql = 'SELECT * FROM PORC_TOTAL_AUDITORIAS';
    
    if (options.order) {
      const orderBy = options.order.map(([field, direction]) => `${field} ${direction}`).join(', ');
      sql += ` ORDER BY ${orderBy}`;
    } else {
      sql += ' ORDER BY TOTAL_AUDIT_MIN ASC';
    }
    
    return await executeQueryMany(sql);
  }
};

// Modelo ResumenComision
const ResumenComision = {
  async findAll(options = {}) {
    let sql = `
      SELECT rc.*, p.NOMBRE_PROFESION
      FROM RESUMEN_COMISIONES_AUDITORIAS_MES rc
      LEFT JOIN PROFESION p ON rc.NOMBRE_PROFESION = p.NOMBRE_PROFESION
    `;
    
    const conditions = [];
    const binds = [];
    
    if (options.where) {
      if (options.where.mes) {
        conditions.push('rc.MES_PROCESO = :mes');
        binds.push(options.where.mes);
      }
      if (options.where.anio) {
        conditions.push('rc.ANNO_PROCESO = :anio');
        binds.push(options.where.anio);
      }
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    if (options.order) {
      const orderBy = options.order.map(([field, direction]) => `rc.${field} ${direction}`).join(', ');
      sql += ` ORDER BY ${orderBy}`;
    }
    
    return await executeQueryMany(sql, binds);
  },

  async create(data) {
    const sql = `
      INSERT INTO RESUMEN_COMISIONES_AUDITORIAS_MES 
      (MES_PROCESO, ANNO_PROCESO, NOMBRE_PROFESION, TOTAL_AUDITORES, TOTAL_CON_AUDITORIAS, TOTAL_SIN_AUDITORIAS, MONTO_TOTAL_AUDITORIAS, MONTO_TOTAL_COMISIONES) 
      VALUES (:mes, :anio, :nombre_profesion, :total_auditores, :total_con_auditorias, :total_sin_auditorias, :monto_total_auditorias, :monto_total_comisiones)
    `;
    await executeQuery(sql, [
      data.mes, data.anio, data.nombre_profesion, 
      data.total_auditores, data.total_con_auditorias, data.total_sin_auditorias,
      data.monto_total_auditorias, data.monto_total_comisiones
    ]);
  }
};

// Modelo DetalleComision
const DetalleComision = {
  async findAll(options = {}) {
    let sql = `
      SELECT dc.*, a.NOMBRE, p.NOMBRE_PROFESION
      FROM DETALLE_COMISIONES_AUDITORIAS_MES dc
      LEFT JOIN AUDITOR a ON dc.RUN_AUDITOR = a.NUMRUN || a.DVRUN
      LEFT JOIN PROFESION p ON a.COD_PROFESION = p.COD_PROFESION
    `;
    
    const conditions = [];
    const binds = [];
    
    if (options.where) {
      if (options.where.run_auditor) {
        conditions.push('dc.RUN_AUDITOR = :run_auditor');
        binds.push(options.where.run_auditor);
      }
      if (options.where.mes) {
        conditions.push('dc.MES_PROCESO = :mes');
        binds.push(options.where.mes);
      }
      if (options.where.anio) {
        conditions.push('dc.ANNO_PROCESO = :anio');
        binds.push(options.where.anio);
      }
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    if (options.order) {
      const orderBy = options.order.map(([field, direction]) => `dc.${field} ${direction}`).join(', ');
      sql += ` ORDER BY ${orderBy}`;
    }
    
    return await executeQueryMany(sql, binds);
  },

  async create(data) {
    const sql = `
      INSERT INTO DETALLE_COMISIONES_AUDITORIAS_MES 
      (MES_PROCESO, ANNO_PROCESO, RUN_AUDITOR, NOMBRE_AUDITOR, NOMBRE_PROFESION, 
       COMISION_TOTAL_AUDIT, COMISION_MONTO_AUDIT, COMISION_PROF_CRITICA, COMISION_EXTRA, 
       TOTAL_COMISION_AUDIT, TOTAL_COMISION_EMPRESA) 
      VALUES (:mes, :anio, :run_auditor, :nombre_auditor, :nombre_profesion, 
              :comision_total_audit, :comision_monto_audit, :comision_prof_critica, :comision_extra, 
              :total_comision_audit, :total_comision_empresa)
    `;
    await executeQuery(sql, [
      data.mes, data.anio, data.run_auditor, data.nombre_auditor, data.nombre_profesion, 
      data.comision_total_audit, data.comision_monto_audit, data.comision_prof_critica, data.comision_extra, 
      data.total_comision_audit, data.total_comision_empresa
    ]);
  },

  async destroy(options = {}) {
    if (options.where && Object.keys(options.where).length === 0) {
      // Truncar tabla
      const sql = 'DELETE FROM DETALLE_COMISIONES_AUDITORIAS_MES';
      await executeQuery(sql);
    }
  }
};

// Modelo ErrorProceso
const ErrorProceso = {
  async create(data) {
    const sql = `
      INSERT INTO ERROR_PROCESO (CORRELATIVO, SENTENCIA_ERROR, MENSAJE_ERROR) 
      VALUES (SEQ_ERROR_PROCESO.NEXTVAL, :sentencia, :mensaje)
    `;
    await executeQuery(sql, [
      data.sentencia_error, data.mensaje_error
    ]);
  },

  async destroy(options = {}) {
    if (options.where && Object.keys(options.where).length === 0) {
      // Truncar tabla
      const sql = 'DELETE FROM ERROR_PROCESO';
      await executeQuery(sql);
    }
  }
};

module.exports = {
  Profesion,
  Auditor,
  TipoContrato,
  Isapre,
  Auditoria,
  PorcMonto,
  PorcVolumen,
  ResumenComision,
  DetalleComision,
  ErrorProceso
};