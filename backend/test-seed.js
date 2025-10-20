// Script de prueba para el seed de Oracle
require('dotenv').config();
const { testConnection } = require('./src/config/database');

async function testSeed() {
  try {
    console.log('🧪 Probando conexión a Oracle...\n');
    
    const connected = await testConnection();
    
    if (connected) {
      console.log('✅ Conexión exitosa. El script de seed debería funcionar correctamente.');
      console.log('\n📋 Para ejecutar el seed, usa:');
      console.log('   node backend/src/scripts/seed.js');
    } else {
      console.log('❌ No se pudo conectar a Oracle. Verifica la configuración.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    process.exit(1);
  }
}

testSeed();
