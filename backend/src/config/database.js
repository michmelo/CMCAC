const oracledb = require('oracledb');
require('dotenv').config();

// Configuración de Oracle
const oracleConfig = {
  // Configuración básica
  user: process.env.ORA_USER || 'Encargo_1',
  password: process.env.ORA_PASSWORD || '',
  connectString: process.env.ORA_CONNECT_STRING || 'bdy1102_high',
  
  // Configuración de pool
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60,
  stmtCacheSize: 30,
  
  // Configuración para Oracle Wallet (Oracle Cloud)
  ...(process.env.ORA_WALLET_LOCATION && {
    walletLocation: process.env.ORA_WALLET_LOCATION,
    // Para Oracle Cloud con wallet, usar password vacío
    password: process.env.ORA_WALLET_LOCATION ? '' : oracleConfig.password
  }),
  
  // Configuración SSL para Oracle Cloud
  ...(process.env.ORA_SSL && {
    ssl: process.env.ORA_SSL === 'true',
    sslServerCertDN: process.env.ORA_SSL_SERVER_CERT_DN
  })
};

let pool = null;

// Inicializar pool de conexiones Oracle
const initializePool = async () => {
  try {
    if (!pool) {
      // Configurar wallet si está disponible
      if (process.env.ORA_WALLET_LOCATION) {
        // Configurar TNS_ADMIN para que Oracle encuentre tnsnames.ora
        process.env.TNS_ADMIN = process.env.ORA_WALLET_LOCATION;
        oracledb.walletLocation = process.env.ORA_WALLET_LOCATION;
        console.log('🔐 Wallet configurado:', process.env.ORA_WALLET_LOCATION);
        console.log('🔧 TNS_ADMIN configurado:', process.env.TNS_ADMIN);
      }
      
      pool = await oracledb.createPool(oracleConfig);
      console.log('✅ Pool de conexiones Oracle creado exitosamente');
    }
    return pool;
  } catch (error) {
    console.error('❌ Error creando pool de Oracle:', error);
    throw error;
  }
};

// Obtener conexión del pool
const getConnection = async () => {
  try {
    if (!pool) {
      await initializePool();
    }
    return await pool.getConnection();
  } catch (error) {
    console.error('❌ Error obteniendo conexión Oracle:', error);
    throw error;
  }
};

// Cerrar pool de conexiones
const closePool = async () => {
  try {
    if (pool) {
      await pool.close(10);
      pool = null;
      console.log('✅ Pool de conexiones Oracle cerrado');
    }
  } catch (error) {
    console.error('❌ Error cerrando pool Oracle:', error);
  }
};

// Probar conexión
const testConnection = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT 1 FROM DUAL');
    console.log('✅ Conexión a Oracle exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a Oracle:', error);
    return false;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error cerrando conexión de prueba:', err);
      }
    }
  }
};

// Función helper para ejecutar consultas
const executeQuery = async (sql, binds = [], options = {}) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, binds, {
      autoCommit: true,
      ...options
    });
    return result;
  } catch (error) {
    console.error('❌ Error ejecutando consulta Oracle:', error);
    throw error;
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

// Función helper para obtener múltiples filas
const executeQueryMany = async (sql, binds = []) => {
  const result = await executeQuery(sql, binds, { 
    outFormat: oracledb.OUT_FORMAT_OBJECT 
  });
  return result.rows || [];
};

// Función helper para obtener una sola fila
const executeQueryOne = async (sql, binds = []) => {
  const result = await executeQuery(sql, binds, { 
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    maxRows: 1
  });
  return result.rows && result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = { 
  initializePool,
  getConnection,
  closePool,
  testConnection,
  executeQuery,
  executeQueryMany,
  executeQueryOne,
  pool
};