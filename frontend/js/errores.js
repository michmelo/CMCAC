const API_URL = 'http://localhost:3000/api';

// Cargar errores al iniciar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarErrores();
    await cargarEstadisticasErrores();
});

// Consultar errores con filtros
async function consultarErrores(event) {
    event.preventDefault();
    
    const tipoError = document.getElementById('tipoError').value;
    const mes = document.getElementById('mesError').value;
    const anio = document.getElementById('anioError').value;
    
    let url = `${API_URL}/errores?`;
    const params = [];
    
    if (tipoError) {
        // Mapear tipo de error del select al tipo en BD
        const tipoMap = {
            'limite': 'LIMITE_EXCEDIDO',
            'sql': 'ERROR_SQL',
            'validacion': 'ERROR_VALIDACION',
            'proceso': 'ERROR_PROCESO'
        };
        params.push(`tipoError=${tipoMap[tipoError]}`);
    }
    if (mes) params.push(`mes=${mes}`);
    if (anio) params.push(`anio=${anio}`);
    
    url += params.join('&');
    
    try {
        const response = await fetch(url);
        const errores = await response.json();
        
        mostrarErrores(errores);
        await cargarEstadisticasErrores(mes, anio);
        
    } catch (error) {
        console.error('Error consultando errores:', error);
        alert('❌ Error al consultar errores. Verifica que el backend esté corriendo.');
    }
}

// Cargar todos los errores
async function cargarErrores() {
    try {
        const response = await fetch(`${API_URL}/errores`);
        const errores = await response.json();
        mostrarErrores(errores);
    } catch (error) {
        console.error('Error cargando errores:', error);
    }
}

// Mostrar errores en la tabla
function mostrarErrores(errores) {
    const tbody = document.getElementById('tbodyErrores');
    
    if (errores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron errores</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    errores.forEach((error, index) => {
        const fecha = new Date(error.fecha_error);
        const fechaFormateada = fecha.toLocaleString('es-CL');
        
        // Determinar badge según tipo de error
        let badge = '';
        let codigoError = 'N/A';
        
        switch(error.tipo_error) {
            case 'LIMITE_EXCEDIDO':
                badge = '<span class="badge bg-warning">Límite</span>';
                codigoError = 'WARN-001';
                break;
            case 'ERROR_SQL':
                badge = '<span class="badge bg-danger">SQL</span>';
                codigoError = 'SQL-ERROR';
                break;
            case 'ERROR_VALIDACION':
                badge = '<span class="badge bg-info">Validación</span>';
                codigoError = 'VAL-001';
                break;
            case 'ERROR_PROCESO':
                badge = '<span class="badge bg-secondary">Proceso</span>';
                codigoError = 'PROC-ERROR';
                break;
            default:
                badge = '<span class="badge bg-secondary">Otro</span>';
        }
        
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${fechaFormateada}</td>
                <td>${badge}</td>
                <td>${error.tipo_error}</td>
                <td>${error.descripcion}</td>
                <td>${codigoError}</td>
            </tr>
        `;
    });
}

// Cargar estadísticas de errores
async function cargarEstadisticasErrores(mes = null, anio = null) {
    try {
        let url = `${API_URL}/errores/estadisticas`;
        const params = [];
        
        if (mes) params.push(`mes=${mes}`);
        if (anio) params.push(`anio=${anio}`);
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        
        const response = await fetch(url);
        const stats = await response.json();
        
        // Actualizar cards de estadísticas
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('h3').textContent = stats.totalErrores;
            statCards[1].querySelector('h3').textContent = stats.excesosLimite;
            
            // Contar errores SQL (buscar en erroresPorTipo)
            const erroresSQL = stats.erroresPorTipo.find(e => e.tipo_error === 'ERROR_SQL');
            statCards[2].querySelector('h3').textContent = erroresSQL ? erroresSQL.cantidad : 0;
            
            statCards[3].querySelector('h3').textContent = stats.tasaExito + '%';
        }
        
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// Limpiar log de errores
async function limpiarErrores() {
    if (!confirm('¿Está seguro de que desea limpiar el log de errores?\n\nEsta acción eliminará TODOS los registros de la tabla ERROR_PROCESO.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/errores/limpiar`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`✅ Log de errores limpiado correctamente.\n\nRegistros eliminados: ${result.cantidad}`);
            
            // Recargar tabla y estadísticas
            await cargarErrores();
            await cargarEstadisticasErrores();
        } else {
            alert('❌ Error al limpiar el log de errores.');
        }
        
    } catch (error) {
        console.error('Error limpiando errores:', error);
        alert('❌ Error al conectar con el servidor. Verifica que el backend esté corriendo.');
    }
}