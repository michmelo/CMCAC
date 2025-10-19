// JavaScript principal para CMCAC - Sistema de Gestión de Comisiones

// Establecer última actualización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const updateElement = document.getElementById('ultimaActualizacion');
    if (updateElement) {
        updateElement.textContent = now.toLocaleDateString('es-CL', options);
    }
});

// Nombres de meses
const mesesNombre = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

async function cargarEstadisticas() {
    try {
        const response = await fetch('http://localhost:3000/api/estadisticas');
        const stats = await response.json();
        
        // Actualizar las estadísticas en el index.html
        document.querySelector('.stat-card:nth-child(1) h3').textContent = stats.auditoresActivos;
        document.querySelector('.stat-card:nth-child(2) h3').textContent = stats.auditoriasFinalizadas;
        document.querySelector('.stat-card:nth-child(3) h3').textContent = 
            '$' + (stats.comisionesMes / 1000000).toFixed(1) + 'M';
        
    } catch (error) {
        console.log('Backend no disponible, usando datos de ejemplo');
    }
}

if (document.querySelector('.stat-card')) {
    document.addEventListener('DOMContentLoaded', cargarEstadisticas);
}