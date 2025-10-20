# Archivo de configuración para CMCAC Backend
# Este archivo permite personalizar las rutas sin modificar el script principal

# Configuración del Wallet Oracle
# Descomenta y modifica la siguiente línea si quieres especificar una ruta personalizada:
# $CustomWalletPath = "C:\ruta\personalizada\a\tu\wallet"

# Configuración del servidor
$ServerPort = 3000
$ServerHost = "localhost"

# Configuración de la base de datos
# Estas variables se pueden sobrescribir con variables de entorno del sistema
$DatabaseConfig = @{
    Host = $env:DB_HOST ?? "localhost"
    Port = $env:DB_PORT ?? "1521"
    ServiceName = $env:DB_SERVICE_NAME ?? "XE"
    User = $env:DB_USER ?? ""
    Password = $env:DB_PASSWORD ?? ""
}

# Exportar configuración para uso en otros scripts
Export-ModuleMember -Variable CustomWalletPath, ServerPort, ServerHost, DatabaseConfig
