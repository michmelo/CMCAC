const API_URL = 'http://localhost:3000/api';

// Cargar vista previa al iniciar
document.addEventListener('DOMContentLoaded', async function() {
    // Obtener mes y año actual
    const now = new Date();
    const mesActual = now.getMonth() + 1;
    const anioActual = now.getFullYear();
    
    await cargarVistaPrevia(mesActual, anioActual);
    await cargarEstadisticas(mesActual, anioActual);
});

// Cargar vista previa de resumen
async function cargarVistaPrevia(mes, anio) {
    try {
        const response = await fetch(`${API_URL}/reportes/vista-previa?mes=${mes}&anio=${anio}`);
        const datos = await response.json();
        
        const tbody = document.querySelector('.table-responsive tbody');
        
        if (datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay datos para mostrar. Procese comisiones primero.</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        datos.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.mes}</td>
                    <td>${item.anio}</td>
                    <td>${item.profesion}</td>
                    <td>${item.totalAuditores}</td>
                    <td>${item.conAuditorias}</td>
                    <td>${item.sinAuditorias}</td>
                    <td>$${item.montoTotal.toLocaleString('es-CL')}</td>
                    <td><strong>$${item.totalComisiones.toLocaleString('es-CL')}</strong></td>
                </tr>
            `;
        });
        
    } catch (error) {
        console.error('Error cargando vista previa:', error);
    }
}

// Cargar estadísticas del mes
async function cargarEstadisticas(mes, anio) {
    try {
        const response = await fetch(`${API_URL}/reportes/estadisticas?mes=${mes}&anio=${anio}`);
        const stats = await response.json();
        
        // Actualizar cards de estadísticas
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 3) {
            statCards[0].querySelector('h3').textContent = 
                '$' + (stats.totalComisiones / 1000000).toFixed(1) + 'M';
            statCards[1].querySelector('h3').textContent = stats.auditoresConComision;
            statCards[2].querySelector('h3').textContent = 
                '$' + Math.round(stats.promedioPorAuditor / 1000) + 'K';
        }
        
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// Generar reporte de resumen por profesión o detalle por auditor
async function generarReporte(event, tipo) {
    event.preventDefault();
    
    const form = event.target;
    const mes = form.querySelector('select').value;
    const anio = form.querySelector('input[type="number"]').value;
    
    try {
        if (tipo === 'resumen') {
            // Generar resumen por profesión
            const response = await fetch(`${API_URL}/reportes/resumen-profesion?mes=${mes}&anio=${anio}`);
            const data = await response.json();
            
            if (data.resumen.length === 0) {
                alert('❌ No hay datos para el período seleccionado.\n\nAsegúrese de haber procesado las comisiones primero.');
                return;
            }
            
            // Crear contenido del reporte
            let reporte = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CMC AUDITORES Y CONSULTORES
   RESUMEN DE COMISIONES POR PROFESIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Período: ${mesesNombre[mes]} ${anio}
Fecha de generación: ${new Date().toLocaleString('es-CL')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

            data.resumen.forEach((item, index) => {
                reporte += `
${index + 1}. ${item.profesion.nombre_profesion} (Nivel ${item.profesion.nivel})
   ────────────────────────────────────────────
   • Total Auditores:        ${item.total_auditores}
   • Total Auditorías:       ${item.total_auditorias}
   • Monto Total Auditorías: $${Math.round(item.monto_total_auditorias).toLocaleString('es-CL')}
   • Total Comisiones:       $${Math.round(item.total_comisiones).toLocaleString('es-CL')}

`;
            });

            reporte += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTALES GENERALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Auditores:        ${data.totales.totalAuditores}
Total Auditorías:       ${data.totales.totalAuditorias}
Monto Total:            $${Math.round(data.totales.totalMontoAuditorias).toLocaleString('es-CL')}
Total Comisiones:       $${Math.round(data.totales.totalComisiones).toLocaleString('es-CL')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

            // Mostrar en modal o descargar
            mostrarReporte(reporte, `Resumen_Profesion_${mes}_${anio}.txt`);
            
        } else {
            // Generar detalle por auditor
            const response = await fetch(`${API_URL}/reportes/detalle-auditor?mes=${mes}&anio=${anio}`);
            const data = await response.json();
            
            if (data.detalle.length === 0) {
                alert('❌ No hay datos para el período seleccionado.\n\nAsegúrese de haber procesado las comisiones primero.');
                return;
            }
            
            let reporte = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CMC AUDITORES Y CONSULTORES
      DETALLE DE COMISIONES POR AUDITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Período: ${mesesNombre[mes]} ${anio}
Fecha de generación: ${new Date().toLocaleString('es-CL')}
Total de auditores: ${data.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

            data.detalle.forEach((item, index) => {
                reporte += `
${index + 1}. ${item.auditor.nombre_auditor}
   RUN: ${item.run_auditor}
   Profesión: ${item.auditor.profesion.nombre_profesion}
   ────────────────────────────────────────────
   • Auditorías realizadas:      ${item.cantidad_auditorias}
   • Monto total auditorías:     $${Math.round(item.monto_total_auditorias).toLocaleString('es-CL')}
   
   Comisiones:
   • Por monto:                  $${Math.round(item.comision_monto).toLocaleString('es-CL')}
   • Por volumen:                $${Math.round(item.comision_volumen).toLocaleString('es-CL')}
   • Incentivo contrato:         $${Math.round(item.incentivo_contrato).toLocaleString('es-CL')}
   • Bonificación profesión:     $${Math.round(item.bonificacion_profesion).toLocaleString('es-CL')}
   • Bono ISAPRE:                $${Math.round(item.bono_isapre).toLocaleString('es-CL')}
   
   TOTAL COMISIÓN:               $${Math.round(item.comision_total).toLocaleString('es-CL')}
   ${item.limite_aplicado ? '   ⚠️  LÍMITE APLICADO' : ''}

`;
            });

            reporte += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

            // Mostrar en modal o descargar
            mostrarReporte(reporte, `Detalle_Auditores_${mes}_${anio}.txt`);
        }
        
    } catch (error) {
        console.error('Error generando reporte:', error);
        alert('❌ Error al generar el reporte. Verifica que el backend esté corriendo.');
    }
}

// Mostrar reporte en modal y opción de descarga
function mostrarReporte(contenido, nombreArchivo) {
    // Crear modal para mostrar el reporte
    const existingModal = document.getElementById('modalReporte');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'modalReporte';
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Reporte Generado</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <pre style="background: #f8f9fa; padding: 20px; border-radius: 5px; max-height: 500px; overflow-y: auto;">${contenido}</pre>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="descargarReporte('${nombreArchivo}')">
                        <i class="bi bi-download"></i> Descargar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Guardar contenido para descarga
    window.reporteActual = contenido;
    
    // Mostrar modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Limpiar al cerrar
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

// Descargar reporte como archivo de texto
function descargarReporte(nombreArchivo) {
    const contenido = window.reporteActual;
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
}