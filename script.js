// Variables de estado global
let ambienteActual = '';
let zonaSeleccionada = 'piso'; // 'piso' o 'pared'

// Base de datos simulada del catálogo de porcelanatos
const catalogoPorcelanatos = [
    { id: 1, nombre: 'Gris Cemento', tipo: 'patron', url: 'piso-griscemento-350.jpg' },
    { id: 2, nombre: 'Marmoleado Azul', tipo: 'patron', url: 'piso-marmoleadoazul-357.jpg' },
    { id: 3, nombre: 'Marmoleado Blanco', tipo: 'patron', url: 'piso-marmoleadoblanco-344.jpg' },
    { id: 4, nombre: 'Marmoleado Gris', tipo: 'patron', url: 'piso-marmoleadogris-347.jpg' },
    { id: 5, nombre: 'Marmoleado Negro', tipo: 'patron', url: 'piso-marmoleadonegro-358.jpg' },
    { id: 6, nombre: 'Super Blanco', tipo: 'patron', url: 'piso-superblanco-345.jpg' },
    { id: 7, nombre: 'Super Negro', tipo: 'patron', url: 'piso-supernegro-346.jpg' },
    { id: 8, nombre: 'Sal Soluble Beige', tipo: 'patron', url: 'pisobeige-343.jpg' }
];

// Cambiar entre vistas principales de manera segura
function cambiarVista(idVista) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => {
        v.classList.remove('activa');
    });
    
    const vistaDestino = document.getElementById(idVista);
    if (vistaDestino) {
        vistaDestino.classList.add('activa');
    } else {
        console.error("No se encontró la vista:", idVista);
    }
}

// Iniciar ambiente seleccionado sin bloqueos
function cambiarAmbiente(ambiente) {
    ambienteActual = ambiente;
    const escenario = document.getElementById('escenario');
    const btnZonaPared = document.getElementById('btn-zona-pared');
    
    if (escenario) {
        escenario.className = 'escenario-container';
        escenario.classList.add(`escenario-${ambiente}`);
    }

    if (btnZonaPared) {
        if (ambiente === 'bano') {
            btnZonaPared.classList.remove('oculto');
        } else {
            btnZonaPared.classList.add('oculto');
        }
    }

    // Forzar siempre que al entrar a un ambiente se seleccione el piso por defecto
    zonaSeleccionada = 'piso';

    const tituloAmbiente = document.getElementById('titulo-ambiente');
    if (tituloAmbiente) tituloAmbiente.innerText = `Simulador de ${ambiente.toUpperCase()}`;
    
    const spanNombre = document.getElementById('span-nombre-ambiente');
    if (spanNombre) spanNombre.innerText = ambiente;

    cargarCatalogo();
    cambiarVista('vista-visualizador');
}

function volverMenu() {
    cambiarVista('vista-menu');
}

function irACalculadora() {
    const grupoParedes = document.getElementById('grupo-paredes');
    if (grupoParedes) {
        if (ambienteActual === 'bano') {
            grupoParedes.classList.remove('oculto');
        } else {
            grupoParedes.classList.add('oculto');
        }
    }
    
    const resultadoCalculo = document.getElementById('resultado-calculo');
    if (resultadoCalculo) resultadoCalculo.classList.add('oculto');
    
    cambiarVista('vista-calculadora');
}

function volverVisualizador() {
    cambiarVista('vista-visualizador');
}

// Control de selección de zona (Piso o Pared)
function seleccionarZona(zona) {
    if (ambienteActual !== 'bano' && zona === 'pared') {
        zona = 'piso';
    }
    
    zonaSeleccionada = zona;
    document.querySelectorAll('.btn-zona').forEach(b => b.classList.remove('activo'));
    
    if(zona === 'piso') {
        const primerBtn = document.querySelector('.selector-zona button:first-child');
        if(primerBtn) primerBtn.classList.add('activo');
    } else {
        const btnPared = document.getElementById('btn-zona-pared');
        if(btnPared) btnPared.classList.add('activo');
    }
}

// Cargar elementos en el catálogo lateral de manera dinámica
function cargarCatalogo() {
    const grid = document.getElementById('grid-catalogo');
    if (!grid) return;
    
    grid.innerHTML = '';

    catalogoPorcelanatos.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-porcelanato';
        div.innerHTML = `
            <img src="${item.url}" alt="${item.nombre}">
            <span>${item.nombre}</span>
        `;
        
        div.addEventListener('click', function() {
            aplicarTextura(item.url);
        });
        
        grid.appendChild(div);
    });
}

function aplicarTextura(urlImagen) {
    let capaId = 'capa-piso';
    if (ambienteActual === 'bano' && zonaSeleccionada === 'pared') {
        capaId = 'capa-paredes';
    }

    const capa = document.getElementById(capaId);
    if (capa) {
        capa.style.backgroundImage = `url("${urlImagen}")`;
        capa.style.backgroundRepeat = 'repeat';
        // AUMENTA ESTE VALOR para que las piezas se vean más grandes y el giro sea notable
        capa.style.backgroundSize = '200px 200px'; 
        capa.style.backgroundPosition = '0px 0px';
    }
}

function cambiarColorPared(colorHex) {
    const escenario = document.getElementById('escenario');
    
    if (escenario) {
        escenario.style.backgroundColor = colorHex;
        
        if (ambienteActual === 'habitacion') {
            escenario.style.setProperty('background-color', colorHex, 'important');
        }
    }
}

// Rotación instantánea del patrón sin espacios en blanco
let estadoRotacion = 0;

function girarPiso(accion) {
    const capaPiso = document.getElementById('capa-piso');
    if (!capaPiso) return;

    if (accion === 'izquierda') {
        estadoRotacion = (estadoRotacion - 1 + 4) % 4;
    } else if (accion === 'derecha') {
        estadoRotacion = (estadoRotacion + 1) % 4;
    } else if (accion === 'reset') {
        estadoRotacion = 0;
    }

    const posicionesX = ['0px', '90px', '180px', '270px'];
    const posicionesY = ['0px', '90px', '180px', '270px'];
    
    capaPiso.style.backgroundPosition = `${posicionesX[estadoRotacion]} ${posicionesY[estadoRotacion]}`;
    capaPiso.style.transform = 'perspective(350px) rotateX(42deg)';
    capaPiso.style.transition = 'none';
}

// Calculadora de materiales exacta
function calcularMateriales() {
    const largo = parseFloat(document.getElementById('input-largo').value) || 0;
    const ancho = parseFloat(document.getElementById('input-ancho').value) || 0;
    const alto = parseFloat(document.getElementById('input-alto').value) || 0;
    const pesoSacoPego = parseInt(document.getElementById('select-pego').value) || 14;

    if (largo <= 0 || ancho <= 0) {
        alert("Por favor, ingresa un largo y un ancho válidos para la estancia.");
        return;
    }

    const areaPiso = largo * ancho;
    const areaPisoConDesperdicio = areaPiso * 1.10;

    const m2PorCaja = 1.44; 
    const cajasPiso = Math.ceil(areaPisoConDesperdicio / m2PorCaja);

    const rendimientoPego = pesoGrisSaco(pegoSacoValor = pesoSacoPego); 
    const sacosPegoPiso = Math.ceil(areaPiso / rendimientoPego);

    document.getElementById('texto-resultado-piso').innerHTML = 
        `<strong>Piso:</strong> Área de ${areaPiso.toFixed(2)} m² (con 10% de desperdicio: ${areaPisoConDesperdicio.toFixed(2)} m²) = <strong>${cajasPiso} cajas</strong> de porcelanato.`;
    
    document.getElementById('texto-resultado-pego-piso').innerHTML = 
        `<strong>Pego para Piso (${pegoSacoPego} kg):</strong> Necesitarás <strong>${sacosPegoPiso} sacos</strong>.`;

    const resultadoDiv = document.getElementById('resultado-calculo');
    const textoPared = document.getElementById('texto-resultado-pared');
    const textoPegoPared = document.getElementById('texto-resultado-pego-pared');

    const grupoParedes = document.getElementById('grupo-paredes');
    
    if (grupoParedes && !grupoParedes.classList.contains('oculto') && alto > 0) {
        const perimetro = 2 * (largo + ancho);
        const areaParedes = perimetro * alto;
        const areaParedesConDesperdicio = areaParedes * 1.10;
        
        const cajasPared = Math.ceil(areaParedesConDesperdicio / m2PorCaja);
        const sacosPegoPared = Math.ceil(areaParedes / rendimientoPego);

        textoPared.innerHTML = `<strong>Paredes:</strong> Área de ${areaParedes.toFixed(2)} m² = <strong>${cajasPared} cajas</strong> de porcelanato para pared.`;
        textoPegoPared.innerHTML = `<strong>Pego para Pared (${pegoSacoPego} kg):</strong> Necesitarás <strong>${sacosPegoPared} sacos</strong>.`;
        
        textoPared.style.display = 'block';
        textoPegoPared.style.display = 'block';
    } else {
        textoPared.style.display = 'none';
        textoPegoPared.style.display = 'none';
    }

    resultadoDiv.classList.remove('oculto');
}

// Función auxiliar para determinar el rendimiento del pego seleccionado
function pesoGrisSaco(peso) {
    if (peso === 14) {
        return 1.5; 
    } else {
        return 1.0; 
    }
}
