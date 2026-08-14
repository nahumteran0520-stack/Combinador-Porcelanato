// Variables de estado global
let ambienteActual = '';
let zonaSeleccionada = 'piso';
let estadoRotacion = 0; // Control de la rotación en grados (0, 90, 180, 270)

// Catálogo de porcelanatos
const catalogoPorcelanatos = [
    { id: 1, nombre: 'Gris Cemento', tipo: 'patron', url: 'piso-griscemento-350.jpg' },
    { id: 2, nombre: 'Marmoleado Azul', tipo: 'patron', url: 'piso-marmoleadoazul-357.jpg' },
    { id: 3, nombre: 'Marmoleado Blanco', tipo: 'patron', url: 'piso-marmoleadoblanco-344.jpg' },
    { id: 4, nombre: 'Marmoleado Gris', tipo: 'patron', url: 'piso-marmoleadogris-347.jpg' },
    { id: 5, nombre: 'Marmoleado Negro', tipo: 'patron', url: 'piso-marmoleadonegro-358.jpg' },
    { id: 6, nombre: 'Super Blanco', tipo: 'patron', url: 'piso-superblanco-345.jpg' },
    { id: 7, nombre: 'Super Negro', tipo: 'patron', url: 'piso-supernegro-346.jpg' },
    { id: 8, nombre: 'Sal Soluble Beige', tipo: 'patron', url: 'pisobeige-343.jpg' },
    { id: 9, nombre: 'Arce Gris', tipo: 'patron', url: 'arcegris-230.jpg' }
];

document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.querySelector('.btn-calcular');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', (e) => {
            e.preventDefault();
            calcularMateriales();
        });
    }
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

    if (btnZonaPared) {
        if (ambiente === 'bano') {
            btnZonaPared.classList.remove('oculto');
        } else {
            btnZonaPared.classList.add('oculto');
        }
    }

    zonaSeleccionada = 'piso';
    const tituloAmbiente = document.getElementById('titulo-ambiente');
    if (tituloAmbiente) tituloAmbiente.innerText = `Simulador de ${ambiente.toUpperCase()}`;
    
    const spanNombre = document.getElementById('span-nombre-ambiente');
    if (spanNombre) spanNombre.innerText = ambiente;

    // Restablecer rotación al cambiar de ambiente
    estadoRotacion = 0;
    const capaPiso = document.getElementById('capa-piso');
    if (capaPiso) {
        capaPiso.style.transform = `perspective(320px) rotateX(50deg) scaleX(1.45) rotate(0deg)`;
        capaPiso.style.transformOrigin = 'bottom center';
    }

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
    grid.innerHTML = '';

    catalogoPorcelanatos.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-porcelanato';
        div.innerHTML = `
            <img src="${item.url}" alt="${item.nombre}">
            <span>${item.nombre}</span>
        `;
        div.addEventListener('click', () => aplicarTextura(item.url));
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
function girarPiso(direccion) {
    const capaPiso = document.getElementById('capa-piso');
    if (!capaPiso) return;
    
    if (direccion === 'izquierda') {
        estadoRotacion = (estadoRotacion - 90 + 360) % 360;
    } else if (direccion === 'derecha') {
        estadoRotacion = (estadoRotacion + 90) % 360;
    } else {
        estadoRotacion = 0; // Frente / Reset
    }

    // Mantenemos la perspectiva 3D fija y limpia del piso
    capaPiso.style.transform = "perspective(320px) rotateX(50deg) scaleX(1.45)";
    capaPiso.style.transformOrigin = "bottom center";

    // Obtenemos la URL actual de la textura
    const bgImageStyle = capaPiso.style.backgroundImage;
    if (!bgImageStyle) return;
    
    const urlMatch = bgImageStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (!urlMatch) return;
    
    const imgUrl = urlMatch[1];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (estadoRotacion === 90 || estadoRotacion === 270) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((estadoRotacion * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        
        // Asignamos la imagen físicamente rotada al fondo del piso
        capaPiso.style.backgroundImage = `url(${canvas.toDataURL()})`;
        capaPiso.style.backgroundRepeat = 'repeat';
        capaPiso.style.backgroundSize = '200px 200px';
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
    const m2PorCaja = 1.44; 
    const cajasPiso = Math.ceil(areaPiso / m2PorCaja);

    const rendimientoPego = pesoSacoPego === 14 ? 1.5 : 1.0; 
    const sacosPegoPiso = Math.ceil(areaPiso / rendimientoPego);

    const textoPiso = document.getElementById('texto-resultado-piso');
    const textoPegoPiso = document.getElementById('texto-resultado-pego-piso');

    if (textoPiso) {
        textoPiso.innerHTML = `<strong>Piso:</strong> Área de ${areaPiso.toFixed(2)} m² = <strong>${cajasPiso} cajas</strong> de porcelanato.`;
    }
    
    if (textoPegoPiso) {
        textoPegoPiso.innerHTML = `<strong>Pego para Piso (${pesoSacoPego} kg):</strong> Necesitarás <strong>${sacosPegoPiso} sacos</strong>.`;
    }

    const resultadoCalculo = document.getElementById('resultado-calculo');
    if (resultadoCalculo) {
        resultadoCalculo.classList.remove('oculto');
        resultadoCalculo.style.display = 'block';
    }
}
