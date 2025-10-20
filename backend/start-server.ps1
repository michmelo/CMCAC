# Script de inicio para CMCAC Backend con Oracle Wallet
Write-Host "🚀 Iniciando servidor CMCAC..." -ForegroundColor Green

# Obtener la ruta del directorio del script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Cargar configuración si existe
$ConfigPath = Join-Path $ScriptDir "config.ps1"
if (Test-Path $ConfigPath) {
    try {
        . $ConfigPath
        Write-Host "📋 Configuración cargada desde config.ps1" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️  Error cargando configuración: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Configurar variables de entorno para Oracle Wallet
# Buscar wallet en ubicaciones comunes
$WalletPaths = @(
    "$ProjectRoot\wallet",
    "$ProjectRoot\..\wallet", 
    "$env:USERPROFILE\Desktop\wallet",
    "$env:USERPROFILE\wallet"
)

# Agregar ruta personalizada si está configurada
if ($CustomWalletPath -and (Test-Path $CustomWalletPath)) {
    $WalletPaths = @($CustomWalletPath) + $WalletPaths
}

$WalletPath = $null
foreach ($path in $WalletPaths) {
    if (Test-Path $path) {
        $WalletPath = $path
        break
    }
}

if ($WalletPath) {
    $env:TNS_ADMIN = $WalletPath
    $env:ORA_WALLET_LOCATION = $WalletPath
    Write-Host "✅ Wallet encontrado en: $WalletPath" -ForegroundColor Green
} else {
    Write-Host "⚠️  Wallet no encontrado en ubicaciones comunes:" -ForegroundColor Yellow
    foreach ($path in $WalletPaths) {
        Write-Host "   - $path" -ForegroundColor Gray
    }
    Write-Host "💡 Puedes configurar manualmente las variables de entorno:" -ForegroundColor Cyan
    Write-Host "   \$env:TNS_ADMIN = 'ruta\a\tu\wallet'" -ForegroundColor Gray
    Write-Host "   \$env:ORA_WALLET_LOCATION = 'ruta\a\tu\wallet'" -ForegroundColor Gray
}

Write-Host "🔧 Variables de entorno configuradas:" -ForegroundColor Yellow
Write-Host "   TNS_ADMIN: $env:TNS_ADMIN" -ForegroundColor Cyan
Write-Host "   ORA_WALLET_LOCATION: $env:ORA_WALLET_LOCATION" -ForegroundColor Cyan

# Iniciar el servidor
Write-Host "🌐 Iniciando servidor en http://localhost:3000..." -ForegroundColor Green
node src/index.js
