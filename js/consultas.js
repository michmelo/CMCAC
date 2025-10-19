// Cargar catálogos al iniciar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarCatalogos();
});

// Función para cargar catálogos desde el backend
async function cargarCatalogos() {
    try {
        // Cargar tipos de contrato
        const tiposContrato = await fetch('http://localhost:3000/api/catalogos/tipos-contrato')
            .then(res => res.json());
        
        const selectContrato = document.getElementById('tipoContrato');
        selectContrato.innerHTML = '<option value="">Seleccione...</option>';
        tiposContrato.forEach(tipo => {
            selectContrato.innerHTML += `
                <option value="${tipo.id_tipo_contrato}">
                    ${tipo.nombre_contrato} (${tipo.porc_incentivo}%)
                </option>
            `;
        });

        // Cargar profesiones
        const profesiones = await fetch('http://localhost:3000/api/catalogos/profesiones')
            .then(res => res.json());
        
        const selectProfesion = document.getElementById('nivelProfesion');
        selectProfesion.innerHTML = '<option value="">Seleccione...</option>';
        profesiones.forEach(prof => {
            selectProfesion.innerHTML += `
                <option value="${prof.id_profesion}">
                    ${prof.nombre_profesion} - Nivel ${prof.nivel} (${prof.porc_bonificacion}%)
                </option>
            `;
        });

        // Cargar ISAPREs
        const isapres = await fetch('http://localhost:3000/api/catalogos/isapres')
            .then(res => res.json());
        
        const selectIsapre = document.getElementById('isapre');
        selectIsapre.innerHTML = '<option value="">Sin ISAPRE (0%)</option>';
        isapres.forEach(isapre => {
            selectIsapre.innerHTML += `
                <option value="${isapre.id_isapre}">
                    ${isapre.nombre_isapre} (${isapre.porc_bono}%)
                </option>
            `;
        });

    } catch (error) {
        console.error('Error cargando catálogos:', error);
        alert('Error al cargar los catálogos. Verifica que el backend esté corriendo.');
    }
}

// Funciones para consultas
async function consultarPorAuditor(event) {
    event.preventDefault();
    
    const run = document.getElementById('runAuditor').value;
    const mes = document.getElementById('mesConsulta').value;
    const anio = document.getElementById('anioConsulta').value;

    if (!run) {
        alert('Debe ingresar un RUN');
        return;
    }

    try {
        let url = `http://localhost:3000/api/comisiones/consultar?runAuditor=${run}`;
        if (mes) url += `&mes=${mes}`;
        if (anio) url += `&anio=${anio}`;

        const response = await fetch(url);
        const comisiones = await response.json();

        const tabla = document.getElementById('tablaResultados');
        const tbody = document.getElementById('tbodyResultados');

        if (comisiones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center">No se encontraron comisiones para este auditor</td></tr>';
            tabla.style.display = 'table';
            return;
        }

        tbody.innerHTML = '';
        comisiones.forEach(com => {
            tbody.innerHTML += `
                <tr>
                    <td>${com.run_auditor}</td>
                    <td>${com.auditor.nombre_auditor}</td>
                    <td>${com.auditor.profesion.nombre_profesion}</td>
                    <td>${com.cantidad_auditorias}</td>
                    <td>$${Math.round(com.comision_monto).toLocaleString('es-CL')}</td>
                    <td>$${Math.round(com.comision_volumen).toLocaleString('es-CL')}</td>
                    <td>$${Math.round(com.incentivo_contrato).toLocaleString('es-CL')}</td>
                    <td>$${Math.round(com.bonificacion_profesion).toLocaleString('es-CL')}</td>
                    <td>$${Math.round(com.bono_isapre).toLocaleString('es-CL')}</td>
                    <td><strong>$${Math.round(com.comision_total).toLocaleString('es-CL')}</strong></td>
                </tr>
            `;
        });

        tabla.style.display = 'table';

    } catch (error) {
        console.error('Error:', error);
        alert('Error al consultar comisiones. Verifica que el backend esté corriendo.');
    }
}

async function calcularComision(event) {
    event.preventDefault();
    
    const monto = parseFloat(document.getElementById('montoAuditorias').value);
    const cantidad = parseInt(document.getElementById('cantidadAuditorias').value);
    const idTipoContrato = parseInt(document.getElementById('tipoContrato').value);
    const idProfesion = parseInt(document.getElementById('nivelProfesion').value);
    const idIsapre = document.getElementById('isapre').value ? 
                     parseInt(document.getElementById('isapre').value) : null;

    if (!idTipoContrato || !idProfesion) {
        alert('Debe seleccionar tipo de contrato y profesión');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/comisiones/calcular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                montoAuditorias: monto,
                cantidadAuditorias: cantidad,
                idTipoContrato,
                idProfesion,
                idIsapre
            })
        });

        const data = await response.json();

        const resultadoDiv = document.getElementById('resultadoCalculadora');
        const detalleP = document.getElementById('detalleCalculadora');

        detalleP.innerHTML = `
            <strong>📊 Detalle del Cálculo de Comisión:</strong><br><br>
            <strong>Base:</strong><br>
            • Monto Total Auditorías: $${monto.toLocaleString('es-CL')}<br>
            • Cantidad de Auditorías: ${cantidad}<br><br>
            <strong>Comisiones Base:</strong><br>
            • Por Monto (${data.porcMonto}%): $${Math.round(data.comisionMonto).toLocaleString('es-CL')}<br>
            • Por Volumen (${data.porcVolumen}%): $${Math.round(data.comisionVolumen).toLocaleString('es-CL')}<br>
            • <strong>Subtotal: $${Math.round(data.subtotal).toLocaleString('es-CL')}</strong><br><br>
            <strong>Bonificaciones Adicionales:</strong><br>
            • Incentivo Contrato (${data.porcContrato}%): $${Math.round(data.incentivoContrato).toLocaleString('es-CL')}<br>
            • Bonif. Profesión (${data.porcProfesion}%): $${Math.round(data.bonifProfesion).toLocaleString('es-CL')}<br>
            ${data.bonoIsapre > 0 ? `• Bono ISAPRE (${data.porcIsapre}%): $${Math.round(data.bonoIsapre).toLocaleString('es-CL')}<br>` : ''}
            <br><strong style="font-size: 1.2em;">💰 COMISIÓN TOTAL: $${Math.round(data.comisionTotal).toLocaleString('es-CL')}</strong>
        `;

        resultadoDiv.style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('Error al calcular comisión. Verifica que el backend esté corriendo.');
    }
}



