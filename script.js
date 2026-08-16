// --- CONFIGURACIÓN GOOGLE SHEETS ---
const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbzgc2sa-Um5sEDLYmZLcocD9Bo4sNApkJD9tKXdU1hVjNfID1gbhenPskzYDFzc_u0b/exec";
let opcionParedActual = "Sin pared";
let opcionPisoActual = "piso-marmoleadoblanco-344.jpg"; 

// --- VARIABLES DE ESTADO ---
let ambienteActual = '';
let zonaSeleccionada = 'piso';
let estadoRotacion = 0;
let tipoMaterialSeleccionado = 'porcelanato';
let materialActivoActual = null;
let colorJuntaActual = 'rgba(90, 90, 90, 0.85)';

// Catálogo unificado
const catalogoMateriales = [
    { id: 1, nombre: 'Gris Cemento', tipo: 'porcelanato', url: 'piso-griscemento-350.jpg' },
    { id: 2, nombre: 'Marmoleado Azul', tipo: 'porcelanato', url: 'piso-marmoleadoazul-357.jpg' },
    { id: 3, nombre: 'Marmoleado Blanco', tipo: 'porcelanato', url: 'piso-marmoleadoblanco-344.jpg' },
    { id: 4, nombre: 'Marmoleado Gris', tipo: 'porcelanato', url: 'piso-marmoleadogris-347.jpg' },
    { id: 5, nombre: 'Marmoleado Negro', tipo: 'porcelanato', url: 'piso-marmoleadonegro-358.jpg' },
    { id: 6, nombre: 'Super Blanco', tipo: 'porcelanato', url: 'piso-superblanco-345.jpg' },
    { id: 7, nombre: 'Super Negro', tipo: 'porcelanato', url: 'piso-supernegro-346.jpg' },
    { id: 8, nombre: 'Sal Soluble Beige', tipo: 'porcelanato', url: 'pisobeige-343.jpg' },
    { id: 9, nombre: 'Mallorca Gris', tipo: 'ceramica', url: 'mallorcagris.jpg' },
    { id: 10, nombre: 'Mykonos', tipo: 'ceramica', url: 'mykonos-2208238.jpg' },
    { id: 11, nombre: 'Agata Nacar', tipo: 'ceramica', url: 'agatanacar-2208209.jpg' },
    { id: 12, nombre: 'Arce Gris', tipo: 'ceramica', url: 'arcegris-230.jpg' },
    { id: 13, nombre: 'Forest Caramel', tipo: 'ceramica', url: 'forestcaramel.jpg' },
];

// --- FUNCIONES DE GOOGLE SHEETS ---
function enviarRegistroSheets() {
    if (!URL_GOOGLE_SCRIPT) return;

    const ahora = new Date();
    const fechaHora = ahora.toLocaleDateString() + ", " + ahora.toLocaleTimeString();

    const payload = {
        fechaHora: fechaHora,
        opcionPared: opcionParedActual,
        opcionPiso: opcionPisoActual,
        habitacion: ambienteActual || "sala"
    };

    fetch(URL_GOOGLE_SCRIPT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(error => console.error('Error al registrar en Sheets:', error));
}

// --- RESTO DEL CÓDIGO ---
document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.querySelector('.btn-calcular');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', (e) => {
            e.preventDefault();
            calcularMateriales();
        });
    }
    inicializarPaletaJuntas();
});

function cambiarVista(idVista) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => v.classList.remove('activa'));
    const vistaDestino = document.getElementById(idVista);
    if (vistaDestino) vistaDestino.classList.add('activa');
}

function cambiarAmbiente(ambiente) {
    ambienteActual = ambiente;
    const escenario = document.getElementById('escenario');
    const btnZonaPared = document.getElementById('btn-zona-pared');
    
    if (escenario) {
        escenario.className = 'escenario-container';
        escenario.classList.add(`escenario-${ambiente}`);
    }

    if (ambiente === 'bano') {
        document.body.classList.add('modo-bano');
        if (btnZonaPared) btnZonaPared.classList.remove('oculto');
    } else {
        document.body.classList.remove('modo-bano');
        if (btnZonaPared) btnZonaPared.classList.add('oculto');
        
        const capaParedes = document.getElementById('capa-paredes');
        if (capaParedes) capaParedes.style.backgroundImage = 'none';
    }

    zonaSeleccionada = 'piso';
    const tituloAmbiente = document.getElementById('titulo-ambiente');
    if (tituloAmbiente) tituloAmbiente.innerText = `Simulador de ${ambiente.toUpperCase()}`;
    
    const spanNombre = document.getElementById('span-nombre-ambiente');
    if (spanNombre) spanNombre.innerText = ambiente;

    estadoRotacion = 0;
    const capaPiso = document.getElementById('capa-piso');
    if (capaPiso) {
        capaPiso.style.transform = `perspective(320px) rotateX(50deg) scaleX(1.45) rotate(0deg)`;
        capaPiso.style.transformOrigin = 'bottom center';
    }

    tipoMaterialSeleccionado = 'porcelanato';
    materialActivoActual = catalogoMateriales.find(m => m.tipo === 'porcelanato');

    cargarCatalogo();
    cambiarVista('vista-visualizador');
}

function aplicarTextura(urlImagen) {
    let capaId = 'capa-piso';
    if (ambienteActual === 'bano' && zonaSeleccionada === 'pared') {
        capaId = 'capa-paredes';
    }

    const capa = document.getElementById(capaId);
    if (!capa) return;

    capa.dataset.urlActual = urlImagen;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = urlImagen;

    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const tileSize = 150;
        const grosorJunta = 0.5;

        canvas.width = tileSize;
        canvas.height = tileSize;
        ctx.clearRect(0, 0, tileSize, tileSize);

        if (estadoRotacion !== 0) {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (estadoRotacion === 90 || estadoRotacion === 270) {
                tempCanvas.width = img.height;
                tempCanvas.height = img.width;
            } else {
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
            }
            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            tempCtx.rotate((estadoRotacion * Math.PI) / 180);
            tempCtx.drawImage(img, -img.width / 2, -img.height / 2);
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, tileSize, tileSize);
        } else {
            ctx.drawImage(img, 0, 0, tileSize, tileSize);
        }

        ctx.fillStyle = colorJuntaActual;
        ctx.fillRect(0, 0, tileSize, grosorJunta); 
        ctx.fillRect(0, 0, grosorJunta, tileSize); 

        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(0, grosorJunta, tileSize, 0.5);       
        ctx.fillRect(grosorJunta, 0, 0.5, tileSize);       

        capa.style.backgroundImage = `url(${canvas.toDataURL()})`;
        capa.style.backgroundRepeat = 'repeat';
        capa.style.backgroundSize = `${tileSize}px ${tileSize}px`;
        capa.style.backgroundPosition = '0px 0px';

        // --- ACTUALIZAR REGISTRO GOOGLE SHEETS ---
        const nombreArchivo = urlImagen.split('/').pop();
        if (ambienteActual === 'bano' && zonaSeleccionada === 'pared') {
            opcionParedActual = nombreArchivo;
        } else {
            opcionPisoActual = nombreArchivo;
        }
        enviarRegistroSheets();
    };
}

function calcularMateriales() {
    const largoInput = document.getElementById('input-largo');
    const anchoInput = document.getElementById('input-ancho');
    const selectPego = document.getElementById('select-pego');

    const largo = parseFloat(largoInput ? largoInput.value : 0) || 0;
    const ancho = parseFloat(anchoInput ? anchoInput.value : 0) || 0;
    const pesoSacoPego = parseInt(selectPego ? selectPego.value : 14) || 14;

    if (largo <= 0 || ancho <= 0) {
        alert("Por favor, ingresa un largo y un ancho válidos para la estancia.");
        return;
    }

    const areaPiso = largo * ancho;
    const esCeramica = materialActivoActual && materialActivoActual.tipo === 'ceramica';
    const m2PorCaja = esCeramica ? 1.77 : 1.44; 
    const nombreMaterial = esCeramica ? 'Cerámica' : 'Porcelanato';
    const cajasPiso = Math.ceil(areaPiso / m2PorCaja);
    const rendimientoPego = pesoSacoPego === 14 ? 1.5 : 1.0; 
    const sacosPegoPiso = Math.ceil(areaPiso / rendimientoPego);

    const textoPiso = document.getElementById('texto-resultado-piso');
    const textoPegoPiso = document.getElementById('texto-resultado-pego-piso');

    if (textoPiso) textoPiso.innerHTML = `<strong>${nombreMaterial}:</strong> Área de ${areaPiso.toFixed(2)} m² = <strong>${cajasPiso} cajas</strong> (${m2PorCaja} m²/caja).`;
    if (textoPegoPiso) textoPegoPiso.innerHTML = `<strong>Pego para Piso (${pesoSacoPego} kg):</strong> Necesitarás <strong>${sacosPegoPiso} sacos</strong>.`;

    const resultadoCalculo = document.getElementById('resultado-calculo');
    if (resultadoCalculo) {
        resultadoCalculo.classList.remove('oculto');
        resultadoCalculo.style.display = 'block';
    }
}

// ... (El resto de tus funciones como renderizarGridCatalogo, inicializarPaletaJuntas, etc. permanecen igual)
