// Script para poblar la base de datos Oracle con datos iniciales

require('dotenv').config();
const { executeQuery, initializePool, closePool } = require('../config/database');

async function seed() {
  try {
    console.log('🌱 Iniciando población de base de datos Oracle...\n');

    // Inicializar pool de conexiones
    await initializePool();

    // 1. Limpiar tablas existentes (en orden correcto por dependencias)
    console.log('🧹 Limpiando tablas existentes...');
    await executeQuery('DELETE FROM auditoria');
    await executeQuery('DELETE FROM auditor');
    await executeQuery('DELETE FROM empresa');
    await executeQuery('DELETE FROM profesion');
    await executeQuery('DELETE FROM tipo_contrato');
    await executeQuery('DELETE FROM isapre');
    await executeQuery('DELETE FROM porc_monto_auditorias');
    await executeQuery('DELETE FROM porc_total_auditorias');
    await executeQuery('DELETE FROM evaluacion');
    await executeQuery('DELETE FROM afp');
    await executeQuery('DELETE FROM sector');
    await executeQuery('DELETE FROM estado_civil');
    await executeQuery('DELETE FROM comuna');
    console.log('✅ Tablas limpiadas\n');

    // 2. Profesiones
    console.log('📚 Insertando profesiones...');
    const profesiones = [
      { cod_profesion: 1, nombre_profesion: 'Contador Auditor', nivel_criticidad: 4 },
      { cod_profesion: 2, nombre_profesion: 'Ingeniero Comercial', nivel_criticidad: 3 },
      { cod_profesion: 3, nombre_profesion: 'Ingeniero Civil Industrial', nivel_criticidad: 3 },
      { cod_profesion: 4, nombre_profesion: 'Contador Público', nivel_criticidad: 3 },
      { cod_profesion: 5, nombre_profesion: 'Ingeniero en Informática', nivel_criticidad: 2 },
      { cod_profesion: 6, nombre_profesion: 'Administrador de Empresas', nivel_criticidad: 2 },
      { cod_profesion: 7, nombre_profesion: 'Economista', nivel_criticidad: 2 },
      { cod_profesion: 8, nombre_profesion: 'Ingeniero en Control de Gestión', nivel_criticidad: 2 },
      { cod_profesion: 9, nombre_profesion: 'Técnico en Administración', nivel_criticidad: 1 },
      { cod_profesion: 10, nombre_profesion: 'Técnico en Contabilidad', nivel_criticidad: 1 },
      { cod_profesion: 11, nombre_profesion: 'Analista Financiero', nivel_criticidad: 2 },
      { cod_profesion: 12, nombre_profesion: 'Auditor Interno', nivel_criticidad: 3 }
    ];

    for (const prof of profesiones) {
      await executeQuery(
        'INSERT INTO profesion (cod_profesion, nombre_profesion, nivel_criticidad) VALUES (:cod_profesion, :nombre_profesion, :nivel_criticidad)',
        prof
      );
    }
    console.log(`✅ ${profesiones.length} profesiones insertadas\n`);

    // 3. Tipos de Contrato
    console.log('📋 Insertando tipos de contrato...');
    const tiposContrato = [
      { cod_tpcontrato: 1, nombre_tpcontrato: 'Indefinido Jornada Completa', porc_incentivo: 15 },
      { cod_tpcontrato: 2, nombre_tpcontrato: 'Indefinido Jornada Parcial', porc_incentivo: 10 },
      { cod_tpcontrato: 3, nombre_tpcontrato: 'Plazo fijo', porc_incentivo: 5 },
      { cod_tpcontrato: 4, nombre_tpcontrato: 'Honorarios', porc_incentivo: 5 }
    ];

    for (const tipo of tiposContrato) {
      await executeQuery(
        'INSERT INTO tipo_contrato (cod_tpcontrato, nombre_tpcontrato, porc_incentivo) VALUES (:cod_tpcontrato, :nombre_tpcontrato, :porc_incentivo)',
        tipo
      );
    }
    console.log(`✅ ${tiposContrato.length} tipos de contrato insertados\n`);

    // 4. ISAPREs
    console.log('🏥 Insertando ISAPREs...');
    const isapres = [
      { cod_isapre: 1, nombre_isapre: 'Masvida' },
      { cod_isapre: 2, nombre_isapre: 'Vida Tres' },
      { cod_isapre: 3, nombre_isapre: 'Banmédica' },
      { cod_isapre: 4, nombre_isapre: 'Ferrosalud' },
      { cod_isapre: 5, nombre_isapre: 'Colmena Golden Cross' }
    ];

    for (const isapre of isapres) {
      await executeQuery(
        'INSERT INTO isapre (cod_isapre, nombre_isapre) VALUES (:cod_isapre, :nombre_isapre)',
        isapre
      );
    }
    console.log(`✅ ${isapres.length} ISAPREs insertadas\n`);

    // 5. Porcentajes por Monto
    console.log('💰 Insertando rangos de porcentaje por monto...');
    const porcMontos = [
      { monto_audit_min: 100000, monto_audit_max: 400000, porc_monto_audit: 0.07 },
      { monto_audit_min: 500000, monto_audit_max: 600000, porc_monto_audit: 0.09 },
      { monto_audit_min: 600001, monto_audit_max: 800000, porc_monto_audit: 0.011 },
      { monto_audit_min: 800001, monto_audit_max: 1200000, porc_monto_audit: 0.013 },
      { monto_audit_min: 1200001, monto_audit_max: 1300000, porc_monto_audit: 0.015 },
      { monto_audit_min: 1200000, monto_audit_max: 1400000, porc_monto_audit: 0.019 },
      { monto_audit_min: 1400001, monto_audit_max: 1800000, porc_monto_audit: 0.021 },
      { monto_audit_min: 1800001, monto_audit_max: 3000000, porc_monto_audit: 0.025 }
    ];

    for (const porc of porcMontos) {
      await executeQuery(
        'INSERT INTO porc_monto_auditorias (monto_audit_min, monto_audit_max, porc_monto_audit) VALUES (:monto_audit_min, :monto_audit_max, :porc_monto_audit)',
        porc
      );
    }
    console.log(`✅ ${porcMontos.length} rangos de monto insertados\n`);

    // 6. Porcentajes por Total de Auditorías
    console.log('📊 Insertando rangos de porcentaje por total de auditorías...');
    const porcTotalAuditorias = [
      { total_audit_min: 0, total_audit_max: 4, porc_total_audit: 0 },
      { total_audit_min: 5, total_audit_max: 9, porc_total_audit: 5 },
      { total_audit_min: 10, total_audit_max: 14, porc_total_audit: 8 },
      { total_audit_min: 15, total_audit_max: 999999, porc_total_audit: 10 }
    ];

    for (const porc of porcTotalAuditorias) {
      await executeQuery(
        'INSERT INTO porc_total_auditorias (total_audit_min, total_audit_max, porc_total_audit) VALUES (:total_audit_min, :total_audit_max, :porc_total_audit)',
        porc
      );
    }
    console.log(`✅ ${porcTotalAuditorias.length} rangos de total de auditorías insertados\n`);

    // 7. AFP
    console.log('🏦 Insertando AFP...');
    const afps = [
      { cod_afp: 1, nombre_afp: 'CAPITAL', porc: 11.44 },
      { cod_afp: 2, nombre_afp: 'CUPRUM', porc: 11.48 },
      { cod_afp: 3, nombre_afp: 'HABITAT', porc: 11.27 },
      { cod_afp: 4, nombre_afp: 'MODELO', porc: 10.77 },
      { cod_afp: 5, nombre_afp: 'PLANVITAL', porc: 12.36 },
      { cod_afp: 6, nombre_afp: 'PROVIDA', porc: 11.54 }
    ];

    for (const afp of afps) {
      await executeQuery(
        'INSERT INTO afp (cod_afp, nombre_afp, porc) VALUES (:cod_afp, :nombre_afp, :porc)',
        afp
      );
    }
    console.log(`✅ ${afps.length} AFP insertadas\n`);

    // 8. Sectores
    console.log('🏢 Insertando sectores...');
    const sectores = [
      { cod_sector: 1, nombre_sector: 'Comunicaciones' },
      { cod_sector: 2, nombre_sector: 'Servicios' },
      { cod_sector: 3, nombre_sector: 'Banca' },
      { cod_sector: 4, nombre_sector: 'Retail' }
    ];

    for (const sector of sectores) {
      await executeQuery(
        'INSERT INTO sector (cod_sector, nombre_sector) VALUES (:cod_sector, :nombre_sector)',
        sector
      );
    }
    console.log(`✅ ${sectores.length} sectores insertados\n`);

    // 9. Estado Civil
    console.log('👤 Insertando estados civiles...');
    const estadosCiviles = [
      { cod_estcivil: 1, desc_estcivil: 'Soltero' },
      { cod_estcivil: 2, desc_estcivil: 'Casado' },
      { cod_estcivil: 3, desc_estcivil: 'Divorciado' },
      { cod_estcivil: 4, desc_estcivil: 'Viudo' }
    ];

    for (const estado of estadosCiviles) {
      await executeQuery(
        'INSERT INTO estado_civil (cod_estcivil, desc_estcivil) VALUES (:cod_estcivil, :desc_estcivil)',
        estado
      );
    }
    console.log(`✅ ${estadosCiviles.length} estados civiles insertados\n`);

    // 10. Comunas
    console.log('🏘️ Insertando comunas...');
    const comunas = [
      { cod_comuna: 80, nom_comuna: 'Las Condes', codemp_comuna: 50 },
      { cod_comuna: 81, nom_comuna: 'Providencia', codemp_comuna: 20 },
      { cod_comuna: 82, nom_comuna: 'Santiago', codemp_comuna: 10 },
      { cod_comuna: 83, nom_comuna: 'Ñuñoa', codemp_comuna: 10 },
      { cod_comuna: 84, nom_comuna: 'Vitacura', codemp_comuna: 30 },
      { cod_comuna: 85, nom_comuna: 'La Reina', codemp_comuna: 30 },
      { cod_comuna: 86, nom_comuna: 'La Florida', codemp_comuna: 20 },
      { cod_comuna: 87, nom_comuna: 'Maipú', codemp_comuna: 10 },
      { cod_comuna: 88, nom_comuna: 'Lo Barnechea', codemp_comuna: 40 },
      { cod_comuna: 89, nom_comuna: 'Macul', codemp_comuna: 20 },
      { cod_comuna: 90, nom_comuna: 'San Miguel', codemp_comuna: 20 },
      { cod_comuna: 91, nom_comuna: 'Peñalolén', codemp_comuna: 30 }
    ];

    for (const comuna of comunas) {
      await executeQuery(
        'INSERT INTO comuna (cod_comuna, nom_comuna, codemp_comuna) VALUES (:cod_comuna, :nom_comuna, :codemp_comuna)',
        comuna
      );
    }
    console.log(`✅ ${comunas.length} comunas insertadas\n`);

    // 11. Empresas
    console.log('🏢 Insertando empresas...');
    const empresas = [
      { cod_empresa: 1, cod_comuna: 81, cod_sector: 4, nombre_empresa: 'Falabella' },
      { cod_empresa: 2, cod_comuna: 81, cod_sector: 4, nombre_empresa: 'Almacenes Paris' },
      { cod_empresa: 3, cod_comuna: 82, cod_sector: 3, nombre_empresa: 'Banco Santander' },
      { cod_empresa: 4, cod_comuna: 81, cod_sector: 3, nombre_empresa: 'Banco Estado' },
      { cod_empresa: 5, cod_comuna: 82, cod_sector: 2, nombre_empresa: 'Chilectra' },
      { cod_empresa: 6, cod_comuna: 83, cod_sector: 1, nombre_empresa: 'Entel' },
      { cod_empresa: 7, cod_comuna: 84, cod_sector: 2, nombre_empresa: 'Aguas Andinas' },
      { cod_empresa: 8, cod_comuna: 85, cod_sector: 4, nombre_empresa: 'Ripley' }
    ];

    for (const empresa of empresas) {
      await executeQuery(
        'INSERT INTO empresa (cod_empresa, cod_comuna, cod_sector, nombre_empresa) VALUES (:cod_empresa, :cod_comuna, :cod_sector, :nombre_empresa)',
        empresa
      );
    }
    console.log(`✅ ${empresas.length} empresas insertadas\n`);

    // 12. Auditores (ejemplos) - USANDO LA ESTRUCTURA CORRECTA
    console.log('👥 Insertando auditores de ejemplo...');
    const auditores = [
      {
        id_auditor: 1,
        numrun: 15678234,
        dvrun: '5',
        cod_comuna: 80,
        cod_profesion: 1,
        appaterno: 'González',
        apmaterno: 'Pérez',
        nombre: 'María Elena',
        cod_estcivil: 2,
        puntaje: 85,
        sueldo: 2000000,
        cod_afp: 1,
        cod_isapre: 1,
        cod_tpcontrato: 1,
        numrun_sup: null
      },
      {
        id_auditor: 2,
        numrun: 12345678,
        dvrun: '9',
        cod_comuna: 81,
        cod_profesion: 2,
        appaterno: 'Rojas',
        apmaterno: 'Silva',
        nombre: 'Juan Carlos',
        cod_estcivil: 1,
        puntaje: 78,
        sueldo: 1800000,
        cod_afp: 2,
        cod_isapre: 2,
        cod_tpcontrato: 1,
        numrun_sup: null
      },
      {
        id_auditor: 3,
        numrun: 18234567,
        dvrun: 'K',
        cod_comuna: 82,
        cod_profesion: 3,
        appaterno: 'Muñoz',
        apmaterno: 'Torres',
        nombre: 'Andrea Francisca',
        cod_estcivil: 2,
        puntaje: 92,
        sueldo: 2200000,
        cod_afp: 3,
        cod_isapre: 3,
        cod_tpcontrato: 1,
        numrun_sup: null
      },
      {
        id_auditor: 4,
        numrun: 16789234,
        dvrun: '0',
        cod_comuna: 83,
        cod_profesion: 4,
        appaterno: 'Soto',
        apmaterno: 'Ramírez',
        nombre: 'Carlos Alberto',
        cod_estcivil: 1,
        puntaje: 88,
        sueldo: 1900000,
        cod_afp: 4,
        cod_isapre: 4,
        cod_tpcontrato: 2,
        numrun_sup: null
      },
      {
        id_auditor: 5,
        numrun: 19876543,
        dvrun: '2',
        cod_comuna: 84,
        cod_profesion: 5,
        appaterno: 'Lagos',
        apmaterno: 'Díaz',
        nombre: 'Patricia Fernanda',
        cod_estcivil: 3,
        puntaje: 76,
        sueldo: 1600000,
        cod_afp: 5,
        cod_isapre: 5,
        cod_tpcontrato: 3,
        numrun_sup: null
      }
    ];

    for (const auditor of auditores) {
      await executeQuery(
        `INSERT INTO auditor (id_auditor, numrun, dvrun, cod_comuna, cod_profesion, appaterno, apmaterno, nombre, cod_estcivil, puntaje, sueldo, cod_afp, cod_isapre, cod_tpcontrato, numrun_sup) 
         VALUES (:id_auditor, :numrun, :dvrun, :cod_comuna, :cod_profesion, :appaterno, :apmaterno, :nombre, :cod_estcivil, :puntaje, :sueldo, :cod_afp, :cod_isapre, :cod_tpcontrato, :numrun_sup)`,
        auditor
      );
    }
    console.log(`✅ ${auditores.length} auditores insertados\n`);

    // 13. Auditorías de ejemplo - USANDO LA ESTRUCTURA CORRECTA
    console.log('📝 Insertando auditorías de ejemplo...');
    const now = new Date();
    const mesActual = now.getMonth() + 1; // +1 porque getMonth() devuelve 0-11
    const anioActual = now.getFullYear();

    const auditorias = [];
    
    // María Elena - 12 auditorías
    for (let i = 1; i <= 12; i++) {
      auditorias.push({
        id_auditor: 1,
        cod_empresa: 1 + (i % 8), // Rotar entre empresas
        monto_auditoria: Math.floor(1500000 + Math.random() * 1000000),
        inicio_auditoria: new Date(anioActual, mesActual - 1, i),
        fin_auditoria: new Date(anioActual, mesActual - 1, i + 5)
      });
    }

    // Juan Carlos - 8 auditorías
    for (let i = 1; i <= 8; i++) {
      auditorias.push({
        id_auditor: 2,
        cod_empresa: 1 + (i % 8),
        monto_auditoria: Math.floor(1800000 + Math.random() * 800000),
        inicio_auditoria: new Date(anioActual, mesActual - 1, i + 2),
        fin_auditoria: new Date(anioActual, mesActual - 1, i + 7)
      });
    }

    // Andrea - 15 auditorías
    for (let i = 1; i <= 15; i++) {
      auditorias.push({
        id_auditor: 3,
        cod_empresa: 1 + (i % 8),
        monto_auditoria: Math.floor(2000000 + Math.random() * 1500000),
        inicio_auditoria: new Date(anioActual, mesActual - 1, i),
        fin_auditoria: new Date(anioActual, mesActual - 1, i + 4)
      });
    }

    // Carlos - 6 auditorías
    for (let i = 1; i <= 6; i++) {
      auditorias.push({
        id_auditor: 4,
        cod_empresa: 1 + (i % 8),
        monto_auditoria: Math.floor(1200000 + Math.random() * 600000),
        inicio_auditoria: new Date(anioActual, mesActual - 1, i + 3),
        fin_auditoria: new Date(anioActual, mesActual - 1, i + 8)
      });
    }

    // Patricia - 10 auditorías
    for (let i = 1; i <= 10; i++) {
      auditorias.push({
        id_auditor: 5,
        cod_empresa: 1 + (i % 8),
        monto_auditoria: Math.floor(1000000 + Math.random() * 800000),
        inicio_auditoria: new Date(anioActual, mesActual - 1, i + 1),
        fin_auditoria: new Date(anioActual, mesActual - 1, i + 6)
      });
    }

    for (const auditoria of auditorias) {
      await executeQuery(
        `INSERT INTO auditoria (id_auditor, cod_empresa, monto_auditoria, inicio_auditoria, fin_auditoria) 
         VALUES (:id_auditor, :cod_empresa, :monto_auditoria, :inicio_auditoria, :fin_auditoria)`,
        auditoria
      );
    }
    console.log(`✅ ${auditorias.length} auditorías insertadas\n`);

    console.log('🎉 ¡Población de base de datos Oracle completada exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   • Profesiones: ${profesiones.length}`);
    console.log(`   • Tipos de Contrato: ${tiposContrato.length}`);
    console.log(`   • ISAPREs: ${isapres.length}`);
    console.log(`   • Rangos de Monto: ${porcMontos.length}`);
    console.log(`   • Rangos de Total Auditorías: ${porcTotalAuditorias.length}`);
    console.log(`   • AFP: ${afps.length}`);
    console.log(`   • Sectores: ${sectores.length}`);
    console.log(`   • Estados Civiles: ${estadosCiviles.length}`);
    console.log(`   • Comunas: ${comunas.length}`);
    console.log(`   • Empresas: ${empresas.length}`);
    console.log(`   • Auditores: ${auditores.length}`);
    console.log(`   • Auditorías: ${auditorias.length}\n`);

    // Cerrar pool de conexiones
    await closePool();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos Oracle:', error);
    await closePool();
    process.exit(1);
  }
}

seed();