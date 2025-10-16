// Funciones para consultas

function consultarPorAuditor(event) {
    event.preventDefault();
    const tabla = document.getElementById('tablaResultados');
    const tbody = document.getElementById('tbodyResultados');
    
    tbody.innerHTML = `
        <tr>
            <td>15.678.234-5</td>
            <td>María Elena González Pérez</td>
            <td>Contador Auditor</td>
            <td>12</td>
            <td>$2.250.000</td>
            <td>$675.000</td>
            <td>$87.750</td>
            <td>$175.500</td>
            <td>$164.475</td>
            <td>$3.352.725</td>
        </tr>
        <tr>
            <td>12.345.678-9</td>
            <td>Juan Carlos Rojas Silva</td>
            <td>Ingeniero Comercial</td>
            <td>8</td>
            <td>$1.800.000</td>
            <td>$540.000</td>
            <td>$70.200</td>
            <td>$140.400</td>
            <td>$125.730</td>
            <td>$2.676.330</td>
        </tr>
        <tr>
            <td>18.234.567-K</td>
            <td>Andrea Francisca Muñoz Torres</td>
            <td>Ingeniero Civil Industrial</td>
            <td>15</td>
            <td>$3.500.000</td>
            <td>$1.050.000</td>
            <td>$136.500</td>
            <td>$273.000</td>
            <td>$244.755</td>
            <td>$5.000.000</td>
        </tr>
    `;
    
    tabla.style.display = 'table';
}

function calcularComision(event) {
    event.preventDefault();
    
    const monto = parseFloat(document.getElementById('montoAuditorias').value);
    const cantidad = parseInt(document.getElementById('cantidadAuditorias').value);
    const contrato = document.getElementById('tipoContrato').value;
    const nivel = parseInt(document.getElementById('nivelProfesion').value);
    const isapre = document.getElementById('isapre').value;
    
    // Porcentaje por monto (simulado)
    let porcMonto = 0.15; // 15% por defecto
    if (monto >= 20000000) porcMonto = 0.20;
    else if (monto >= 10000000) porcMonto = 0.18;
    else if (monto >= 5000000) porcMonto = 0.15;
    else if (monto >= 1000000) porcMonto = 0.10;
    
    // Porcentaje por volumen
    let porcVolumen = 0;
    if (cantidad >= 15) porcVolumen = 0.10;
    else if (cantidad >= 10) porcVolumen = 0.08;
    else if (cantidad >= 5) porcVolumen = 0.05;
    
    // Porcentaje por contrato
    let porcContrato = 0;
    if (contrato === 'indefinido') porcContrato = 0.03;
    else if (contrato === 'plazo_fijo') porcContrato = 0.02;
    else if (contrato === 'honorarios') porcContrato = 0.01;
    
    // Porcentaje por nivel de profesión
    let porcNivel = 0;
    if (nivel === 1) porcNivel = 0.01;
    else if (nivel === 2) porcNivel = 0.03;
    else if (nivel === 3) porcNivel = 0.04;
    else if (nivel === 4) porcNivel = 0.06;
    
    // Porcentaje por ISAPRE
    let porcIsapre = 0;
    if (isapre === 'colmena') porcIsapre = 0.05;
    else if (isapre === 'cruz_blanca') porcIsapre = 0.04;
    else if (isapre === 'consalud') porcIsapre = 0.03;
    else if (isapre === 'banmedica') porcIsapre = 0.04;
    else if (isapre === 'vida_tres') porcIsapre = 0.02;
    
    // Cálculos
    const comisionMonto = monto * porcMonto;
    const comisionVolumen = monto * porcVolumen;
    const subtotal = comisionMonto + comisionVolumen;
    const incentivoContrato = subtotal * porcContrato;
    const bonifProfesion = subtotal * porcNivel;
    const bonoIsapre = subtotal * porcIsapre;
    const total = subtotal + incentivoContrato + bonifProfesion + bonoIsapre;
    
    const resultadoDiv = document.getElementById('resultadoCalculadora');
    const detalleP = document.getElementById('detalleCalculadora');
    
    detalleP.innerHTML = `
        <strong>📊 Detalle del Cálculo de Comisión:</strong><br><br>
        <strong>Base:</strong><br>
        • Monto Total Auditorías: $${monto.toLocaleString('es-CL')}<br>
        • Cantidad de Auditorías: ${cantidad}<br><br>
        <strong>Comisiones Base:</strong><br>
        • Por Monto (${(porcMonto*100)}%): $${comisionMonto.toLocaleString('es-CL')}<br>
        • Por Volumen (${(porcVolumen*100)}%): $${comisionVolumen.toLocaleString('es-CL')}<br>
        • <strong>Subtotal: $${subtotal.toLocaleString('es-CL')}</strong><br><br>
        <strong>Bonificaciones Adicionales:</strong><br>
        • Incentivo Contrato (${(porcContrato*100)}%): $${incentivoContrato.toLocaleString('es-CL')}<br>
        • Bonif. Profesión Nivel ${nivel} (${(porcNivel*100)}%): $${bonifProfesion.toLocaleString('es-CL')}<br>
        ${porcIsapre > 0 ? `• Bono ISAPRE (${(porcIsapre*100)}%): $${bonoIsapre.toLocaleString('es-CL')}<br>` : ''}
        <br><strong style="font-size: 1.2em;">💰 COMISIÓN TOTAL: $${Math.round(total).toLocaleString('es-CL')}</strong>
    `;
    
    resultadoDiv.style.display = 'block';
}



