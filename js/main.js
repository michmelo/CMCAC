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
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

