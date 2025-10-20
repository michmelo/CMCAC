# Scripts SQL para Oracle Database - CMCAC

## 📁 Archivos Incluidos

- `02_create_and_populate_tables.sql` - Script completo de tablas y datos
- `README.md` - Este archivo con instrucciones
- `../ORACLE_WALLET_CONFIG.md` - Configuración para Oracle Cloud con wallet

## 🚀 Instrucciones de Instalación

### Opción A: Oracle Cloud con Wallet (Recomendado)
Si tienes Oracle Cloud Database con wallet, ve a `../ORACLE_WALLET_CONFIG.md` para instrucciones simplificadas.

### Opción B: Oracle Local/On-Premise

### 1. Preparar Oracle Database

#### Opción A: Oracle Database Express Edition (XE)
```bash
# Descargar Oracle XE desde oracle.com
# Instalar siguiendo las instrucciones del instalador
# Por defecto corre en puerto 1521
```

#### Opción B: Oracle en Docker
```bash
docker run -d --name oracle-xe \
  -p 1521:1521 \
  -e ORACLE_PWD=password \
  -e ORACLE_CHARACTERSET=AL32UTF8 \
  oracle/database:21.3.0-xe
```

### 2. Crear Usuario y Esquema

Conectarse como `SYS` o `SYSTEM` y ejecutar:

```sql
-- Crear usuario (usar el script 01_create_tables.sql)
CREATE USER Encargo_1 IDENTIFIED BY "Encargo1_EA1"
DEFAULT TABLESPACE "USERS"
TEMPORARY TABLESPACE "TEMP";
ALTER USER Encargo_1 QUOTA UNLIMITED ON USERS;
GRANT CREATE SESSION TO Encargo_1;
GRANT "RESOURCE" TO Encargo_1;
ALTER USER Encargo_1 DEFAULT ROLE "RESOURCE";

-- Conectar como Encargo_1
CONNECT Encargo_1/Encargo1_EA1;
```

### 3. Ejecutar Scripts

#### Paso 1: Crear Usuario
```bash
# Conectarse a Oracle como SYS o SYSTEM
sqlplus sys/password@localhost:1521/XE as sysdba

# Ejecutar script de creación de usuario
@01_create_tables.sql
```

#### Paso 2: Crear Tablas y Poblar Datos
```bash
# Conectarse como Encargo_1
sqlplus Encargo_1/Encargo1_EA1@localhost:1521/XE

# Ejecutar script completo de tablas y datos
@02_create_and_populate_tables.sql
```

### 4. Verificar Instalación

```sql
-- Verificar tablas creadas
SELECT table_name FROM user_tables ORDER BY table_name;

-- Verificar datos insertados
SELECT 'PROFESION' as TABLA, COUNT(*) as REGISTROS FROM PROFESION
UNION ALL
SELECT 'AUDITOR', COUNT(*) FROM AUDITOR
UNION ALL
SELECT 'AUDITORIA', COUNT(*) FROM AUDITORIA;
```

## 🔧 Configuración del Backend

### Variables de Entorno

Crear archivo `.env` en `backend/`:

```env
# Configuración de Oracle Database
ORA_USER=Encargo_1
ORA_PASSWORD=Encargo1_EA1
ORA_CONNECT_STRING=localhost:1521/XE

# Puerto del servidor Express
PORT=3000
```

### Instalar Oracle Instant Client (Windows)

1. Descargar Oracle Instant Client desde oracle.com
2. Extraer en `C:\oracle\instantclient_21_x`
3. Agregar al PATH del sistema: `C:\oracle\instantclient_21_x`
4. Reiniciar terminal

### Probar Conexión

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

## 📊 Estructura de Tablas

### Tablas de Catálogo
- `PROFESION` - Profesiones y niveles de bonificación
- `TIPO_CONTRATO` - Tipos de contrato e incentivos
- `ISAPRE` - ISAPREs y bonos
- `PORC_MONTO` - Porcentajes por monto de auditorías
- `PORC_VOLUMEN` - Porcentajes por cantidad de auditorías

### Tablas Principales
- `AUDITOR` - Información de auditores
- `AUDITORIA` - Registro de auditorías
- `DETALLE_COMISION` - Comisiones calculadas por auditor
- `RESUMEN_COMISION` - Resúmenes por profesión
- `ERROR_PROCESO` - Log de errores

## 🧪 Datos de Prueba

El script `02_insert_sample_data.sql` incluye:
- 6 profesiones diferentes
- 4 tipos de contrato
- 5 ISAPREs
- 6 auditores de ejemplo
- 9 auditorías finalizadas
- Configuración de porcentajes

## 🔍 Consultas de Verificación

```sql
-- Auditores activos
SELECT COUNT(*) FROM AUDITOR WHERE ACTIVO = 1;

-- Auditorías finalizadas
SELECT COUNT(*) FROM AUDITORIA WHERE ESTADO = 'finalizada';

-- Comisiones del mes actual
SELECT SUM(COMISION_TOTAL) FROM DETALLE_COMISION 
WHERE MES = EXTRACT(MONTH FROM SYSDATE) 
AND ANIO = EXTRACT(YEAR FROM SYSDATE);
```

## 🆘 Solución de Problemas

### Error: ORA-00942 (tabla no existe)
- Verificar que el usuario CMCAC tenga permisos
- Ejecutar `01_create_tables.sql` nuevamente

### Error: ORA-00955 (nombre ya existe)
- Las tablas ya existen, continuar con `02_insert_sample_data.sql`

### Error de conexión desde Node.js
- Verificar Oracle Instant Client instalado
- Verificar variables de entorno en `.env`
- Verificar que Oracle esté corriendo en puerto 1521

### Error: NJS-503 (conexión rechazada)
- Verificar que Oracle Database esté corriendo
- Verificar puerto 1521 disponible
- Verificar connect string en `.env`
