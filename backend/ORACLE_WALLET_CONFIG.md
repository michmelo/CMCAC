# Configuración con Oracle Wallet

## 🎯 **Ventajas del Oracle Wallet**

✅ **No necesitas archivos de script de usuario** - El wallet maneja la autenticación  
✅ **Conexión más segura** - Certificados SSL integrados  
✅ **Configuración simplificada** - Solo necesitas el wallet y connect string  
✅ **Ideal para Oracle Cloud** - Diseñado específicamente para Oracle Cloud Database  

## 📁 **Archivos que puedes ELIMINAR con Wallet:**

- `backend/sql/01_create_tables.sql` - No necesitas crear usuario manualmente
- Scripts de creación de usuario - El wallet maneja la autenticación

## ⚠️ **IMPORTANTE: Script de Tablas SÍ es Necesario**

**Aunque uses Oracle Wallet, DEBES ejecutar el script de tablas:**

- ✅ `backend/sql/02_create_and_populate_tables.sql` - **OBLIGATORIO** - Contiene todas las tablas y datos
- El wallet solo maneja la autenticación, NO crea las tablas automáticamente

## 🔧 **Configuración con Wallet**

### Paso 1: Descargar Wallet desde Oracle Cloud
1. Ve a Oracle Cloud Console
2. Navega a tu Autonomous Database
3. Descarga el wallet (archivo ZIP)
4. Extrae en una carpeta (ej: `C:\oracle\wallet`)

### Paso 2: Configurar Variables de Entorno

Crear archivo `backend/.env`:

```env
# Usuario de la base de datos
ORA_USER=Encargo_1

# NO necesitas password con wallet
# ORA_PASSWORD=Encargo1_EA1

# Connect String de Oracle Cloud (tu base de datos específica)
ORA_CONNECT_STRING=bdy1102_high?TNS_ADMIN=C:/Users/mmelo/Desktop/wallet

# Ubicación del Oracle Wallet
ORA_WALLET_LOCATION=C:/Users/mmelo/Desktop/wallet

# Configuración SSL para Oracle Cloud
ORA_SSL=true
ORA_SSL_SERVER_CERT_DN=CN=adb.sa-valparaiso-1.oraclecloud.com

# Puerto del servidor Express
PORT=3000
```

### Paso 3: Solo Ejecutar Script de Tablas

```bash
# Conectarse usando el wallet
sqlplus Encargo_1@your-db-name_high

# Ejecutar solo el script de tablas y datos
@02_create_and_populate_tables.sql
```

## 🚀 **Flujo Simplificado con Wallet**

### Sin Wallet (Método Tradicional):
1. ✅ Crear usuario como SYS/SYSTEM
2. ✅ Conectar como usuario creado
3. ✅ Ejecutar script de tablas
4. ✅ Configurar variables de entorno

### Con Wallet (Método Simplificado):
1. ❌ ~~Crear usuario~~ (No necesario)
2. ✅ Conectar usando wallet
3. ✅ **Ejecutar script de tablas** (OBLIGATORIO)
4. ✅ Configurar variables de entorno

## 📋 **Estructura de Archivos Simplificada**

```
backend/
├── sql/
│   ├── 02_create_and_populate_tables.sql  ← Solo este script
│   └── README.md
├── src/
│   └── config/
│       └── database.js  ← Configurado para wallet
└── .env  ← Configuración con wallet
```

## 🔍 **Verificar Configuración**

```bash
cd backend
npm start
```

Debería mostrar:
```
✅ Pool de conexiones Oracle creado exitosamente
✅ Conexión a Oracle exitosa
🚀 Servidor CMCAC corriendo en http://localhost:3000
```

## 🆘 **Solución de Problemas**

### Error: ORA-28759 (fallo en autenticación)
- Verificar que el wallet esté en la ubicación correcta
- Verificar que ORA_WALLET_LOCATION apunte al directorio del wallet

### Error: TNS-03505 (no se puede resolver)
- Verificar ORA_CONNECT_STRING
- Verificar que TNS_ADMIN apunte al directorio del wallet

### Error: NJS-503 (conexión rechazada)
- Verificar que Oracle Cloud Database esté activo
- Verificar conectividad de red
