# Configuración del Servidor CMCAC

## Problema Resuelto
El script `start-server.ps1` tenía rutas hardcodeadas que solo funcionaban en el sistema específico del desarrollador.

## Solución Implementada

### 1. Detección Automática de Wallet
El script ahora busca automáticamente el wallet de Oracle en las siguientes ubicaciones:
- `./wallet` (directorio del proyecto)
- `../wallet` (directorio padre)
- `%USERPROFILE%\Desktop\wallet`
- `%USERPROFILE%\wallet`

### 2. Archivo de Configuración
Se creó `config.ps1` para personalizar la configuración sin modificar el script principal.

### 3. Configuración Personalizada
Para usar una ruta personalizada del wallet:

1. Edita el archivo `config.ps1`
2. Descomenta y modifica la línea:
   ```powershell
   $CustomWalletPath = "C:\ruta\personalizada\a\tu\wallet"
   ```

### 4. Variables de Entorno
También puedes configurar las variables de entorno del sistema:
- `TNS_ADMIN`
- `ORA_WALLET_LOCATION`

## Uso

### Inicio Básico
```powershell
.\start-server.ps1
```

### Con Configuración Personalizada
1. Edita `config.ps1` con tu configuración
2. Ejecuta `.\start-server.ps1`

### Con Variables de Entorno
```powershell
$env:TNS_ADMIN = "C:\mi\wallet"
$env:ORA_WALLET_LOCATION = "C:\mi\wallet"
.\start-server.ps1
```

## Beneficios
- ✅ Sin rutas hardcodeadas
- ✅ Funciona en cualquier sistema
- ✅ Configuración flexible
- ✅ Detección automática
- ✅ Mensajes informativos
- ✅ Fallback a configuración manual
