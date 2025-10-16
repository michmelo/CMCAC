// Funciones para reportes

function generarReporte(event, tipo) {
    event.preventDefault();
    const mes = event.target.querySelector('select').value;
    const anio = event.target.querySelector('input[type="number"]').value;
    
    const mesesNombre = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    if (tipo === 'resumen') {
        alert(`📄 Generando Resumen por Profesión\n\nPeríodo: ${mesesNombre[mes]} ${anio}\nTabla: RESUMEN_COMISIONES_AUDITORIAS_MES\n\nEl reporte se descargará en formato Excel.`);
    } else {
        alert(`📋 Generando Detalle por Auditor\n\nPeríodo: ${mesesNombre[mes]} ${anio}\nTabla: DETALLE_COMISIONES_AUDITORIAS_MES\n\nEl reporte se descargará en formato Excel.`);
    }
}



