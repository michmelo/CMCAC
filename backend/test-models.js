// Script de prueba para verificar que los modelos funcionen correctamente
require('dotenv').config();
const { initializePool, closePool } = require('./src/config/database');
const { Profesion, Auditor, TipoContrato, Isapre, Auditoria, PorcMonto, PorcVolumen } = require('./src/models');

async function testModels() {
  try {
    console.log('🧪 Probando modelos con Oracle...\n');
    
    // Inicializar pool de conexiones
    await initializePool();
    console.log('✅ Conexión a Oracle establecida\n');

    // Probar Profesion
    console.log('📚 Probando modelo Profesion...');
    try {
      const profesiones = await Profesion.findAll();
      console.log(`✅ Profesion.findAll() - ${profesiones.length} registros encontrados`);
    } catch (error) {
      console.log(`❌ Error en Profesion.findAll(): ${error.message}`);
    }

    // Probar TipoContrato
    console.log('📋 Probando modelo TipoContrato...');
    try {
      const tipos = await TipoContrato.findAll();
      console.log(`✅ TipoContrato.findAll() - ${tipos.length} registros encontrados`);
    } catch (error) {
      console.log(`❌ Error en TipoContrato.findAll(): ${error.message}`);
    }

    // Probar Isapre
    console.log('🏥 Probando modelo Isapre...');
    try {
      const isapres = await Isapre.findAll();
      console.log(`✅ Isapre.findAll() - ${isapres.length} registros encontrados`);
    } catch (error) {
      console.log(`❌ Error en Isapre.findAll(): ${error.message}`);
    }

    // Probar Auditor
    console.log('👥 Probando modelo Auditor...');
    try {
      const auditores = await Auditor.findAll();
      console.log(`✅ Auditor.findAll() - ${auditores.length} registros encontrados`);
    } catch (error) {
      console.log(`❌ Error en Auditor.findAll(): ${error.message}`);
    }

    // Probar Auditoria
    console.log('📝 Probando modelo Auditoria...');
    try {
      const auditorias = await Auditoria.findAll();
      console.log(`✅ Auditoria.findAll() - ${auditorias.length} registros encontrados`);
    } catch (error) {
      console.log(`❌ Error en Auditoria.findAll(): ${error.message}`);
    }

    // Probar PorcMonto
    console.log('💰 Probando modelo PorcMonto...');
    try {
      const porcMontos = await PorcMonto.findAll();
      console.log(`✅ PorcMonto.findAll() - ${porcMontos.length} registros encontrados`);
    } catch (error) {
      console.log(`❌ Error en PorcMonto.findAll(): ${error.message}`);
    }

    // Probar PorcVolumen
    console.log('📊 Probando modelo PorcVolumen...');
    try {
      const porcVolumenes = await PorcVolumen.findAll();
      console.log(`✅ PorcVolumen.findAll() - ${porcVolumenes.length} registros encontrados`);
    } catch (error) {
      console.log(`❌ Error en PorcVolumen.findAll(): ${error.message}`);
    }

    console.log('\n🎉 Pruebas de modelos completadas');
    
    // Cerrar pool de conexiones
    await closePool();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    await closePool();
    process.exit(1);
  }
}

testModels();
