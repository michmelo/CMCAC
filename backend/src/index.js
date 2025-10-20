const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Configurar TNS_ADMIN antes de importar oracledb
if (process.env.ORA_WALLET_LOCATION) {
  process.env.TNS_ADMIN = process.env.ORA_WALLET_LOCATION;
  console.log('🔧 TNS_ADMIN configurado:', process.env.TNS_ADMIN);
}

const { initializePool, testConnection, executeQueryMany } = require('./config/database');

// Importar rutas
const comisionRoutes = require('./routes/comisionRoutes');
const auditorRoutes = require('./routes/auditorRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const errorRoutes = require('./routes/errorRoutes');
const reporteRoutes = require('./routes/reporteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ API CMCAC - Sistema de Gestión de Comisiones de Auditores',
    version: '1.0.0',
    endpoints: {
      comisiones: '/api/comisiones',
      auditores: '/api/auditores',
      auditorias: '/api/auditorias',
      catalogos: '/api/catalogos',
      errores: '/api/errores'
    }
  });
});

// Rutas de la API
app.use('/api/comisiones', comisionRoutes);
app.use('/api/auditores', auditorRoutes);
app.use('/api/auditorias', auditoriaRoutes);
app.use('/api/catalogos', catalogoRoutes);
app.use('/api/errores', errorRoutes);
app.use('/api/reportes', reporteRoutes);

// Rutas básicas para catálogos (implementación temporal con Oracle)
app.get('/api/catalogos/tipos-contrato', async (req, res) => {
  try {
    const query = `SELECT ID_TIPO_CONTRATO, NOMBRE_CONTRATO, PORC_INCENTIVO FROM TIPO_CONTRATO WHERE ACTIVO = 1`;
    const result = await executeQueryMany(query);
    res.json(result);
  } catch (error) {
    console.error('Error obteniendo tipos de contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/catalogos/profesiones', async (req, res) => {
  try {
    const query = `SELECT ID_PROFESION, NOMBRE_PROFESION, NIVEL, PORC_BONIFICACION FROM PROFESION WHERE ACTIVO = 1`;
    const result = await executeQueryMany(query);
    res.json(result);
  } catch (error) {
    console.error('Error obteniendo profesiones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/catalogos/isapres', async (req, res) => {
  try {
    const query = `SELECT ID_ISAPRE, NOMBRE_ISAPRE, PORC_BONO FROM ISAPRE WHERE ACTIVO = 1`;
    const result = await executeQueryMany(query);
    res.json(result);
  } catch (error) {
    console.error('Error obteniendo ISAPREs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener estadísticas generales
app.get('/api/estadisticas', async (req, res) => {
  try {
    // Consultas SQL directas para Oracle
    const auditoresActivosQuery = `
      SELECT COUNT(*) as count 
      FROM AUDITOR 
      WHERE ACTIVO = 1
    `;
    
    const auditoriasFinalizadasQuery = `
      SELECT COUNT(*) as count 
      FROM AUDITORIA 
      WHERE ESTADO = 'finalizada'
    `;
    
    // Obtener comisiones del mes actual
    const now = new Date();
    const mesActual = now.getMonth() + 1;
    const anioActual = now.getFullYear();
    
    const comisionesMesQuery = `
      SELECT NVL(SUM(COMISION_TOTAL), 0) as total
      FROM DETALLE_COMISION 
      WHERE MES = :mes AND ANIO = :anio
    `;
    
    const [auditoresResult, auditoriasResult, comisionesResult] = await Promise.all([
      executeQueryMany(auditoresActivosQuery),
      executeQueryMany(auditoriasFinalizadasQuery),
      executeQueryMany(comisionesMesQuery, [mesActual, anioActual])
    ]);
    
    const auditoresActivos = auditoresResult[0]?.count || 0;
    const auditoriasFinalizadas = auditoriasResult[0]?.count || 0;
    const comisionesMes = comisionesResult[0]?.total || 0;
    
    res.json({
      auditoresActivos,
      auditoriasFinalizadas,
      comisionesMes: Math.round(comisionesMes),
      mesActual,
      anioActual
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor CMCAC corriendo en http://localhost:${PORT}`);
  console.log(`📊 Documentación: http://localhost:${PORT}/\n`);
  console.log('🌐 El servidor está disponible en http://localhost:3000\n');
  
  // Inicializar Oracle en segundo plano (no bloquea el servidor)
  initializeOracleInBackground();
});

// Función para inicializar Oracle en segundo plano
const initializeOracleInBackground = async () => {
  try {
    console.log('🔄 Inicializando conexión Oracle en segundo plano...');
    await initializePool();
    await testConnection();
    console.log('✅ Conexión Oracle establecida exitosamente\n');
  } catch (error) {
    console.error('❌ Error inicializando Oracle:', error);
    console.log('⚠️  Servidor funcionando sin conexión a base de datos\n');
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  const { closePool } = require('./config/database');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  const { closePool } = require('./config/database');
  await closePool();
  process.exit(0);
});