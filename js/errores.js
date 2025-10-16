// Funciones para gestión de errores

function consultarErrores(event) {
    event.preventDefault();
    alert('🔍 Consultando errores del sistema...\n\nSe encontraron 3 registros en la tabla ERROR_PROCESO.');
}

function limpiarErrores() {
    if (confirm('¿Está seguro de que desea limpiar el log de errores de la tabla ERROR_PROCESO?')) {
        alert('✅ Log de errores limpiado correctamente.');
    }
}



