// Procesar comisiones
async function procesarComisiones(event) {
    event.preventDefault();
    const mes = document.getElementById('mesProceso').value;
    const anio = document.getElementById('anioProceso').value;
    const limite = document.getElementById('limiteComision').value;
    const truncar = document.getElementById('truncarTablas').checked;
    
    // Mostrar progreso
    const progresoContainer = document.getElementById('progresoContainer');
    progresoContainer.style.display = 'block';
    
    const resultadoDiv = document.getElementById('resultadoProceso');
    const resultadoTexto = document.getElementById('resultadoTexto');
    const estadoProceso = document.getElementById('estadoProceso');
    const progressFill = document.getElementById('progressFill');
    
    // Simular progreso visual
    let progreso = 0;
    const interval = setInterval(() => {
        progreso += 10;
        if (progreso > 90) progreso = 90;
        
        progressFill.style.width = progreso + '%';
        progressFill.textContent = Math.round(progreso) + '%';
        
        if (progreso < 30) estadoProceso.textContent = 'Validando parámetros...';
        else if (progreso < 60) estadoProceso.textContent = 'Procesando auditorías...';
        else estadoProceso.textContent = 'Calculando comisiones...';
    }, 300);

    try {
        // Llamar al backend
        const response = await fetch('http://localhost:3000/api/comisiones/procesar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mes: parseInt(mes),
                anio: parseInt(anio),
                limiteComision: parseInt(limite),
                truncarTablas: truncar
            })
        });
        
        const data = await response.json();
        
        clearInterval(interval);
        progressFill.style.width = '100%';
        progressFill.textContent = '100%';
        
        if (data.success) {
            const r = data.resultado;
            
            resultadoTexto.textContent = `
=== PROCESAMIENTO DE COMISIONES - ${mesesNombre[mes]} ${anio} ===

📋 PARÁMETROS DE ENTRADA:
   • Mes: ${mesesNombre[mes]} (${mes})
   • Año: ${anio}
   • Límite de Comisión: $${parseInt(limite).toLocaleString('es-CL')}
   • Truncar tablas: ${truncar ? 'SÍ' : 'NO'}

${truncar ? '🗑️  TABLAS TRUNCADAS\n' : ''}
📊 CURSORES EJECUTADOS:
   ✓ Profesiones procesadas: ${r.profesiones_procesadas}
   ✓ Auditores evaluados: ${r.auditores_evaluados}
   ✓ Auditorías finalizadas: ${r.auditorias_finalizadas}

💰 RESULTADOS DEL PROCESO:
   • Auditores con comisión: ${r.auditores_con_comision}
   • Auditores sin auditorías: ${r.auditores_sin_auditorias}
   • Total comisiones generadas: $${Math.round(r.total_comisiones).toLocaleString('es-CL')}
   • Promedio comisión por auditor: $${Math.round(r.promedio_comision).toLocaleString('es-CL')}
   • Límites excedidos: ${r.limites_excedidos}

=== PROCESAMIENTO COMPLETADO EXITOSAMENTE ===
✅ Estado: ${data.mensaje}
            `;
            
            resultadoDiv.style.display = 'block';
            estadoProceso.textContent = '✅ Proceso completado exitosamente';
            
            alert(`✅ Procesamiento completado.\n\n📊 Resumen:\n• Auditores procesados: ${r.auditores_con_comision}\n• Total comisiones: $${Math.round(r.total_comisiones).toLocaleString('es-CL')}`);
        } else {
            alert('❌ Error en el procesamiento: ' + (data.error || 'Error desconocido'));
        }
        
    } catch (error) {
        clearInterval(interval);
        console.error('Error:', error);
        alert('❌ Error al conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000');
        estadoProceso.textContent = '❌ Error en el procesamiento';
    }
}