// Variables de estado global
let ambienteActual = '';
let zonaSeleccionada = 'piso';
let estadoRotacion = 0; // Control de rotación en grados
let tipoMaterialSeleccionado = 'porcelanato'; // Pestaña activa del catálogo
let materialActivoActual = null; // Referencia del material seleccionado
let colorJuntaActual = 'rgba(90, 90, 90, 0.85)'; // Color por defecto de las juntas

// Catálogo unificado de materiales
const catalogoMateriales = [
    // Porcelanatos (1.44 m² por caja)
    { id: 1, nombre: 'Gris Cemento', tipo: 'porcelanato', url: 'piso-griscemento-350.jpg' },
    { id: 2, nombre: 'Marmoleado Azul', tipo: 'porcelanato', url: 'piso-marmoleadoazul-357.jpg' },
    { id: 3, nombre: 'Marmoleado Blanco', tipo: 'porcelanato', url: 'piso-marmoleadoblanco-344.jpg' },
    { id: 4, nombre: 'Marmoleado Gris', tipo: 'porcelanato', url: 'piso-marmoleadogris-347.jpg' },
    { id: 5, nombre: 'Marmoleado Negro', tipo: 'porcelanato', url: 'piso-marmoleadonegro-358.jpg' },
    { id: 6, nombre: 'Super Blanco', tipo: 'porcelanato', url: 'piso-superblanco-345.jpg' },
    { id: 7, nombre: 'Super Negro', tipo: 'porcelanato', url: 'piso-supernegro-346.jpg' },
    { id: 8, nombre: 'Sal Soluble Beige', tipo: 'porcelanato', url: 'pisobeige-343.jpg' },
    
    // Cerámicas (1.77 m² por caja)
    { id: 9, nombre: 'Mallorca Gris', tipo: 'ceramica', url: 'mallorcagris.jpg' },
    { id: 10, nombre: 'Mykonos', tipo: 'ceramica', url: 'mykonos-2208238.jpg' },
    { id: 11, nombre: 'Agata Nacar', tipo: 'ceramica', url: 'agatanacar-2208209.jpg' },
    { id: 12, nombre: 'Arce Gris', tipo: 'ceramica', url: 'arcegris-230.jpg' },
    { id: 13, nombre: 'Forest Caramel', tipo: 'ceramica', url: 'forestcaramel.jpg' },
];

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

function volverMenu() {
    cambiarVista('vista-menu');
}

function abrirCalculadora() {
    const modal = document.getElementById('modal-calculadora');
    const grupoParedes = document.getElementById('grupo-paredes');
    const spanNombre = document.getElementById('span-nombre-ambiente');
    
    if (spanNombre) spanNombre.innerText = ambienteActual;

    if (grupoParedes) {
        if (ambienteActual === 'bano') {
            grupoParedes.classList.remove('oculto');
        } else {
            grupoParedes.classList.add('oculto');
        }
    }
    
    const resultadoCalculo = document.getElementById('resultado-calculo');
    if (resultadoCalculo) {
        resultadoCalculo.classList.remove('oculto');
        resultadoCalculo.style.display = 'block';
    }

    if (modal) {
        modal.classList.remove('oculto');
    }
}

function cerrarCalculadora() {
    const modal = document.getElementById('modal-calculadora');
    if (modal) {
        modal.classList.add('oculto');
    }
}

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

function cargarCatalogo() {
    const grid = document.getElementById('grid-catalogo');
    if (!grid) return;

    let contenedorPadre = grid.parentNode;
    let selectorTabs = document.getElementById('selector-tipo-material');
    
    if (!selectorTabs) {
        selectorTabs = document.createElement('div');
        selectorTabs.id = 'selector-tipo-material';
        selectorTabs.className = 'selector-zona';
        selectorTabs.style.marginBottom = '12px';
        selectorTabs.style.display = 'flex';
        selectorTabs.style.gap = '8px';
        selectorTabs.innerHTML = `
            <button type="button" id="tab-porcelanato" class="btn-zona activo" onclick="filtrarTipoMaterial('porcelanato')">Porcelanatos</button>
            <button type="button" id="tab-ceramica" class="btn-zona" onclick="filtrarTipoMaterial('ceramica')">Cerámicas</button>
        `;
        contenedorPadre.insertBefore(selectorTabs, grid);
    }

    renderizarGridCatalogo();
}

function filtrarTipoMaterial(tipo) {
    tipoMaterialSeleccionado = tipo;
    const tabPorc = document.getElementById('tab-porcelanato');
    const tabCera = document.getElementById('tab-ceramica');
    
    if(tabPorc) tabPorc.classList.toggle('activo', tipo === 'porcelanato');
    if(tabCera) tabCera.classList.toggle('activo', tipo === 'ceramica');
    
    renderizarGridCatalogo();
}

function renderizarGridCatalogo() {
    const grid = document.getElementById('grid-catalogo');
    if (!grid) return;
    grid.innerHTML = '';

    const filtrados = catalogoMateriales.filter(item => item.tipo === tipoMaterialSeleccionado);

    filtrados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-porcelanato';
        div.innerHTML = `
            <img src="${item.url}" alt="${item.nombre}">
            <span>${item.nombre}</span>
        `;
        div.addEventListener('click', () => {
            materialActivoActual = item;
            aplicarTextura(item.url);
        });
        grid.appendChild(div);
    });
}

// Juntas intactas: Grosor 0.5 con relieve 3D sutil
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
      img.onload = function() {
        // ... (todo el código del canvas que ya tienes) ...

        capa.style.backgroundImage = `url(${canvas.toDataURL()})`;
        capa.style.backgroundRepeat = 'repeat';
        capa.style.backgroundSize = `${tileSize}px ${tileSize}px`;
        capa.style.backgroundPosition = '0px 0px';

        // --- NUEVO: Actualiza la variable correspondiente y envía a Google Sheets ---
        const nombreArchivo = urlImagen.split('/').pop(); // Extrae solo el nombre del archivo (ej. piso-griscemento-350.jpg)
        
        if (ambienteActual === 'bano' && zonaSeleccionada === 'pared') {
            opcionParedActual = nombreArchivo;
        } else {
            opcionPisoActual = nombreArchivo;
        }

        // Envía el registro con la combinación actual a la hoja Visitas
        enviarRegistroSheets();
    };

        // Manejo de rotación en el canvas
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

        // 1. Relleno de la junta ultrafina
        ctx.fillStyle = colorJuntaActual;
        ctx.fillRect(0, 0, tileSize, grosorJunta); 
        ctx.fillRect(0, 0, grosorJunta, tileSize); 

        // 2. Relieve 3D sutil
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(0, grosorJunta, tileSize, 0.5);       
        ctx.fillRect(grosorJunta, 0, 0.5, tileSize);       

        capa.style.backgroundImage = `url(${canvas.toDataURL()})`;
        capa.style.backgroundRepeat = 'repeat';
        capa.style.backgroundSize = `${tileSize}px ${tileSize}px`;
        capa.style.backgroundPosition = '0px 0px';
    };
}

// Color de pared con sombras y profundidad integradas (sin alterar las juntas)
function cambiarColorPared(colorHex) {
    const escenario = document.getElementById('escenario');
    if (escenario) {
        const estiloFondo = `
            radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.45) 100%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%),
            ${colorHex}
        `;
        escenario.style.background = estiloFondo;
        if (ambienteActual === 'habitacion') {
            escenario.style.setProperty('background', estiloFondo, 'important');
        }
    }
}

function cambiarColorJunta(rgbaColor) {
    colorJuntaActual = rgbaColor;
    if (materialActivoActual) {
        aplicarTextura(materialActivoActual.url);
    } else {
        const capaPiso = document.getElementById('capa-piso');
        if (capaPiso && capaPiso.dataset.urlActual) {
            aplicarTextura(capaPiso.dataset.urlActual);
        }
    }
}

function inicializarPaletaJuntas() {
    if (document.getElementById('seccion-color-juntas')) return;

    const divJuntas = document.createElement('div');
    divJuntas.id = 'seccion-color-juntas';
    divJuntas.style.marginTop = '15px';
    divJuntas.style.marginBottom = '15px';
    divJuntas.style.padding = '10px';
    divJuntas.style.background = '#fff';
    divJuntas.style.borderRadius = '8px';
    divJuntas.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    
    divJuntas.innerHTML = `
        <label style="font-weight: bold; display: block; margin-bottom: 8px; font-size: 14px; color: #333;">Color de Juntas</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button onclick="cambiarColorJunta('rgba(240, 240, 240, 0.85)')" title="Blanco" style="width: 25px; height: 25px; border-radius: 50%; background: #f0f0f0; border: 1px solid #ccc; cursor: pointer;"></button>
            <button onclick="cambiarColorJunta('rgba(210, 180, 140, 0.85)')" title="Beige / Marfil" style="width: 25px; height: 25px; border-radius: 50%; background: #d2b48c; border: 1px solid #ccc; cursor: pointer;"></button>
            <button onclick="cambiarColorJunta('rgba(139, 69, 19, 0.85)')" title="Caramelo / Madera" style="width: 25px; height: 25px; border-radius: 50%; background: #8b4513; border: 1px solid #ccc; cursor: pointer;"></button>
            <button onclick="cambiarColorJunta('rgba(128, 128, 128, 0.85)')" title="Gris Cemento" style="width: 25px; height: 25px; border-radius: 50%; background: #808080; border: 1px solid #ccc; cursor: pointer;"></button>
            <button onclick="cambiarColorJunta('rgba(80, 50, 30, 0.85)')" title="Chocolate" style="width: 25px; height: 25px; border-radius: 50%; background: #50321e; border: 1px solid #ccc; cursor: pointer;"></button>
            <button onclick="cambiarColorJunta('rgba(40, 40, 40, 0.85)')" title="Antracita / Negro" style="width: 25px; height: 25px; border-radius: 50%; background: #282828; border: 1px solid #ccc; cursor: pointer;"></button>
        </div>
    `;
    
    let puntoInsert = null;
    const candidatos = document.querySelectorAll('.color-pared, #color-pared, [class*="pared"], .panel-controles > div, .sidebar > div');
    for (let el of candidatos) {
        if (el.textContent && el.textContent.includes('Color de Pared')) {
            puntoInsert = el;
            break;
        }
    }

    if (!puntoInsert) {
        puntoInsert = document.querySelector('.color-pared') || document.querySelector('#color-pared');
    }

    if (puntoInsert) {
        puntoInsert.parentNode.insertBefore(divJuntas, puntoInsert.nextSibling);
    } else {
        const panel = document.querySelector('.panel-controles') || document.querySelector('.sidebar') || document.querySelector('aside');
        if (panel && panel.children.length > 1) {
            panel.insertBefore(divJuntas, panel.children[1]);
        } else if (panel) {
            panel.appendChild(divJuntas);
        } else {
            document.body.appendChild(divJuntas);
        }
    }
}

function girarPiso(direccion) {
    const capaPiso = document.getElementById('capa-piso');
    if (!capaPiso) return;
    
    if (direccion === 'izquierda') {
        estadoRotacion = (estadoRotacion - 90 + 360) % 360;
    } else if (direccion === 'derecha') {
        estadoRotacion = (estadoRotacion + 90) % 360;
    } else {
        estadoRotacion = 0; 
    }

    capaPiso.style.transform = "perspective(320px) rotateX(50deg) scaleX(1.45)";
    capaPiso.style.transformOrigin = "bottom center";

    if (materialActivoActual) {
        aplicarTextura(materialActivoActual.url);
    } else if (capaPiso.dataset.urlActual) {
        aplicarTextura(capaPiso.dataset.urlActual);
    }
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

    if (textoPiso) {
        textoPiso.innerHTML = `<strong>${nombreMaterial}:</strong> Área de ${areaPiso.toFixed(2)} m² = <strong>${cajasPiso} cajas</strong> (${m2PorCaja} m²/caja).`;
    }
    
    if (textoPegoPiso) {
        textoPegoPiso.innerHTML = `<strong>Pego para Piso (${pesoSacoPego} kg):</strong> Necesitarás <strong>${sacosPegoPiso} sacos</strong>.`;
    }

    const resultadoCalculo = document.getElementById('resultado-calculo');
    if (resultadoCalculo) {
        resultadoCalculo.classList.remove('oculto');
        resultadoCalculo.style.display = 'block';
    }
    // URL de tu Google Apps Script
const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbzgc2sa-Um5sEDLYmZLcocD9Bo4sNApkJD9tKXdU1hVjNfID1gbhenPskzYDFzc_u0b/exec
";

// Variables para rastrear lo último seleccionado en pared y piso
let opcionParedActual = "Sin pared";
let opcionPisoActual = "piso-marmoleadoblanco-344.jpg"; // Valor por defecto inicial

function enviarRegistroSheets() {
    if (!URL_GOOGLE_SCRIPT || URL_GOOGLE_SCRIPT.includes("https://script.google.com/macros/s/AKfycbzgc2sa-Um5sEDLYmZLcocD9Bo4sNApkJD9tKXdU1hVjNfID1gbhenPskzYDFzc_u0b/exec")) return;

    const ahora = new Date();
    // Formato de fecha y hora idéntico al de tu hoja: 9/8/2026, 23:47:52
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
    }).catch(error => {
        console.error('Error al registrar en Sheets:', error);
    });
}
}
