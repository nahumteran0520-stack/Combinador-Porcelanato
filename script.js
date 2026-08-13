function calcularMateriales() {
    const largoInput = document.getElementById('input-largo');
    const anchoInput = document.getElementById('input-ancho');
    const altoInput = document.getElementById('input-alto');
    const selectPego = document.getElementById('select-pego');

    const largo = parseFloat(largoInput ? largoInput.value : 0) || 0;
    const ancho = parseFloat(anchoInput ? anchoInput.value : 0) || 0;
    const alto = parseFloat(altoInput ? altoInput.value : 0) || 0;
    const pesoSacoPego = parseInt(selectPego ? selectPego.value : 14) || 14;

    if (largo <= 0 || ancho <= 0) {
        alert("Por favor, ingresa un largo y un ancho válidos para la estancia.");
        return;
    }

    const areaPiso = largo * ancho;
    const areaPisoConDesperdicio = areaPiso * 1.10; 

    const m2PorCaja = 1.44; 
    const cajasPiso = Math.ceil(areaPisoConDesperdicio / m2PorCaja);

    const rendimientoPego = pesoSacoPego === 14 ? 1.5 : 1.0; 
    const sacosPegoPiso = Math.ceil(areaPiso / rendimientoPego);

    const textoPiso = document.getElementById('texto-resultado-piso');
    const textoPegoPiso = document.getElementById('texto-resultado-pego-piso');
    const textoPared = document.getElementById('texto-resultado-pared');
    const textoPegoPared = document.getElementById('texto-resultado-pego-pared');

    if (textoPiso) {
        textoPiso.innerHTML = `<strong>Piso:</strong> Área de ${areaPiso.toFixed(2)} m² (con 10% de desperdicio: ${areaPisoConDesperdicio.toFixed(2)} m²) = <strong>${cajasPiso} cajas</strong> de porcelanato.`;
    }
    
    if (textoPegoPiso) {
        textoPegoPiso.innerHTML = `<strong>Pego para Piso (${pegoSacoPego} kg):</strong> Necesitarás <strong>${sacosPegoPiso} sacos</strong>.`;
    }

    const grupoParedes = document.getElementById('grupo-paredes');
    
    if (grupoParedes && !grupoParedes.classList.contains('oculto') && alto > 0) {
        const perimetro = 2 * (largo + ancho);
        const areaParedes = perimetro * alto;
        const areaParedesConDesperdicio = areaParedes * 1.10;
        
        const cajasPared = Math.ceil(areaParedesConDesperdicio / m2PorCaja);
        const sacosPegoPared = Math.ceil(areaParedes / rendimientoPego);

        if (textoPared) {
            textoPared.innerHTML = `<strong>Paredes:</strong> Área de ${areaParedes.toFixed(2)} m² = <strong>${cajasPared} cajas</strong> de porcelanato para pared.`;
            textoPared.style.display = 'block';
        }
        if (textoPegoPared) {
            textoPegoPared.innerHTML = `<strong>Pego para Pared (${pegoSacoPego} kg):</strong> Necesitarás <strong>${sacosPegoPared} sacos</strong>.`;
            textoPegoPared.style.display = 'block';
        }
    } else {
        if (textoPared) textoPared.style.display = 'none';
        if (textoPegoPared) textoPegoPared.style.display = 'none';
    }

    const resultadoDiv = document.getElementById('resultado-calculo');
    if (resultadoDiv) {
        resultadoDiv.classList.remove('oculto');
        resultadoDiv.style.removeProperty('display'); // Limpia el display: none en línea para que aparezca
        resultadoDiv.style.display = 'block'; 
    }
}
