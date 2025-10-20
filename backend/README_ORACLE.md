# Configuración Oracle para CMCAC

## Variables de Entorno Requeridas

Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:

```env
# Configuración de Oracle Database
ORA_USER=CMCAC
ORA_PASSWORD=tu_password
ORA_CONNECT_STRING=localhost:1521/XE

# Puerto del servidor Express
PORT=3000
```

## Estructura de Tablas Oracle

El sistema espera las siguientes tablas en Oracle:

### Tablas Principales:
- `AUDITOR` - Información de auditores
- `AUDITORIA` - Registro de auditorías
- `DETALLE_COMISION` - Detalle de comisiones calculadas
- `RESUMEN_COMISION` - Resúmenes por profesión
- `ERROR_PROCESO` - Log de errores

### Tablas de Catálogo:
- `PROFESION` - Tipos de profesiones
- `TIPO_CONTRATO` - Tipos de contratos
- `ISAPRE` - Información de ISAPREs
- `PORC_MONTO` - Porcentajes por monto
- `PORC_VOLUMEN` - Porcentajes por volumen

## Scripts de Creación

Ejecuta los siguientes scripts SQL en tu base de datos Oracle:

```sql
-- Crear usuario (opcional)
CREATE USER CMCAC IDENTIFIED BY password;
GRANT CONNECT, RESOURCE TO CMCAC;
GRANT CREATE TABLE TO CMCAC;
GRANT CREATE SEQUENCE TO CMCAC;

-- Conectar como CMCAC
CONNECT CMCAC/password;

-- Crear tablas principales
CREATE TABLE AUDITOR (
    RUN_AUDITOR VARCHAR2(12) PRIMARY KEY,
    NOMBRE_AUDITOR VARCHAR2(100) NOT NULL,
    ID_PROFESION NUMBER,
    ID_TIPO_CONTRATO NUMBER,
    ID_ISAPRE NUMBER,
    ACTIVO NUMBER(1) DEFAULT 1
);

CREATE TABLE AUDITORIA (
    ID_AUDITORIA NUMBER PRIMARY KEY,
    RUN_AUDITOR VARCHAR2(12),
    ESTADO VARCHAR2(20) DEFAULT 'en_proceso',
    FECHA_INICIO DATE,
    FECHA_FIN DATE,
    MONTO NUMBER(15,2)
);

CREATE TABLE DETALLE_COMISION (
    ID_DETALLE NUMBER PRIMARY KEY,
    RUN_AUDITOR VARCHAR2(12),
    MES NUMBER(2),
    ANIO NUMBER(4),
    COMISION_TOTAL NUMBER(15,2),
    COMISION_MONTO NUMBER(15,2),
    COMISION_VOLUMEN NUMBER(15,2),
    INCENTIVO_CONTRATO NUMBER(15,2),
    BONIFICACION_PROFESION NUMBER(15,2),
    BONO_ISAPRE NUMBER(15,2)
);

-- Crear secuencias
CREATE SEQUENCE SEQ_AUDITORIA START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_DETALLE_COMISION START WITH 1 INCREMENT BY 1;

-- Crear índices
CREATE INDEX IDX_AUDITOR_ACTIVO ON AUDITOR(ACTIVO);
CREATE INDEX IDX_AUDITORIA_ESTADO ON AUDITORIA(ESTADO);
CREATE INDEX IDX_DETALLE_MES_ANIO ON DETALLE_COMISION(MES, ANIO);
```

## Instalación de Oracle Instant Client

Para usar `oracledb` en Windows, necesitas Oracle Instant Client:

1. Descarga Oracle Instant Client desde Oracle.com
2. Extrae en `C:\oracle\instantclient_21_x`
3. Agrega `C:\oracle\instantclient_21_x` al PATH del sistema
4. Reinicia el terminal

## Pruebas

Una vez configurado, puedes probar la conexión:

```bash
cd backend
npm start
```

El servidor debería mostrar:
```
✅ Pool de conexiones Oracle creado exitosamente
✅ Conexión a Oracle exitosa
🚀 Servidor CMCAC corriendo en http://localhost:3000
```
