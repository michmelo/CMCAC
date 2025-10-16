// Funciones para procesamiento de comisiones

function procesarComisiones(event) {
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
    
    // Simular proceso con progreso
    let progreso = 0;
    const interval = setInterval(() => {
        progreso += Math.random() * 15;
        if (progreso > 100) progreso = 100;
        
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = progreso + '%';
        progressFill.textContent = Math.round(progreso) + '%';
        
        const estadoProceso = document.getElementById('estadoProceso');
        if (progreso < 20) estadoProceso.textContent = 'Validando parámetros...';
        else if (progreso < 40) estadoProceso.textContent = truncar ? 'Truncando tablas...' : 'Preparando proceso...';
        else if (progreso < 60) estadoProceso.textContent = 'Procesando auditorías finalizadas...';
        else if (progreso < 80) estadoProceso.textContent = 'Aplicando reglas de negocio y calculando comisiones...';
        else if (progreso < 95) estadoProceso.textContent = 'Generando reportes de resumen y detalle...';
        else estadoProceso.textContent = 'Finalizando proceso...';
        
        if (progreso >= 100) {
            clearInterval(interval);
            
            resultadoTexto.textContent = `
=== PROCESAMIENTO DE COMISIONES - ${mesesNombre[mes]} ${anio} ===

📋 PARÁMETROS DE ENTRADA:
   • Mes: ${mesesNombre[mes]} (${mes})
   • Año: ${anio}
   • Límite de Comisión: $${parseInt(limite).toLocaleString('es-CL')}
   • Truncar tablas: ${truncar ? 'SÍ' : 'NO'}

${truncar ? '🗑️  TRUNCANDO TABLAS:\n   ✓ RESUMEN_COMISIONES_AUDITORIAS_MES\n   ✓ DETALLE_COMISIONES_AUDITORIAS_MES\n   ✓ ERROR_PROCESO\n' : ''}
🔧 EJECUTANDO PACKAGE: PKG_COMISIONES.PROC_CALCULAR_COMISIONES_MES

📊 CURSORES EJECUTADOS:
   ✓ c_profesiones: 12 profesiones procesadas
   ✓ c_auditores: 87 auditores evaluados
   ✓ c_auditorias: 342 auditorías finalizadas encontradas

💰 APLICANDO REGLAS DE NEGOCIO:
   ✓ Regla 1: Comisión por monto de auditorías (tabla PORC_MONTO_AUDITORIAS)
   ✓ Regla 2: Comisión por volumen de auditorías (tabla PORC_TOTAL_AUDITORIAS)
   ✓ Regla 3: Incentivo por tipo de contrato (tabla TIPO_CONTRATO)
   ✓ Regla 4: Bonificación por nivel de profesión (4 niveles)
   ✓ Regla 5: Validación de límite de comisión mensual
   ✓ Regla 8: Bono por afiliación ISAPRE (VARRAY con 5 isapres)

⚠️  VALIDACIÓN DE LÍMITES:
   • 2 auditores excedieron el límite de $${parseInt(limite).toLocaleString('es-CL')}
   • Comisiones ajustadas automáticamente
   • Eventos registrados en tabla ERROR_PROCESO

💾 TABLAS GENERADAS:
   ✓ RESUMEN_COMISIONES_AUDITORIAS_MES: 12 registros insertados
   ✓ DETALLE_COMISIONES_AUDITORIAS_MES: 76 registros insertados
   ✓ ERROR_PROCESO: 2 advertencias de límite registradas

📈 RESULTADOS DEL PROCESO:
   • Total auditores con comisión: 76
   • Total auditores sin auditorías: 11
   • Monto total auditorías procesadas: $311.300.000
   • Total comisiones generadas: $46.695.000
   • Promedio comisión por auditor: $614.408
   • Máxima comisión: $5.000.000 (límite aplicado)
   • Mínima comisión: $125.000

🎯 TRIGGERS EJECUTADOS:
   ✓ TRG_VALIDAR_COMISION: Validaciones antes de inserción

=== PROCESAMIENTO COMPLETADO EXITOSAMENTE ===
⏱️  Tiempo de ejecución: 2.87 segundos
✅ Estado: COMPLETADO SIN ERRORES CRÍTICOS
            `;
            
            resultadoDiv.style.display = 'block';
            estadoProceso.textContent = '✅ Proceso completado exitosamente';
            
            alert(`✅ Procesamiento de comisiones completado.\n\n📊 Resumen:\n• Auditores procesados: 76\n• Total comisiones: $46.695.000\n• Tiempo: 2.87 seg`);
        }
    }, 100);
}

function simularProceso() {
    alert('🧪 Modo Simulación\n\nEsta función ejecutará el proceso en modo simulación sin afectar las tablas de producción.\n\nFuncionalidad disponible en la próxima versión.');
}

function limpiarResultados() {
    document.getElementById('resultadoProceso').style.display = 'none';
    document.getElementById('progresoContainer').style.display = 'none';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('formProcesar').reset();
}



