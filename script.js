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
    // Si no es baño, bloquear intento de seleccionar pared por seguridad
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

// Aplicar textura con validación de seguridad para habitaciones y salas
function aplicarTextura(urlImagen) {
    // Protección estricta: Si estamos en sala o habitación, forzar que la capa destino sea siempre el piso
    let capaId = 'capa-piso';
    if (ambienteActual === 'bano' && zonaSeleccionada === 'pared') {
        capaId = 'capa-paredes';
    }

    const capa = document.getElementById(capaId);
    if (capa) {
        capa.style.backgroundImage = `url("${urlImagen}")`;
        capa.style.backgroundRepeat = 'repeat';
        capa.style.backgroundSize = '100px 100px'; 
        capa.style.backgroundPosition = 'center bottom';
    } else {
        console.warn("Capa no encontrada:", capaId);
    }
}

function cambiarColorPared(colorHex) {
    const escenario = document.getElementById('escenario');
    
    if (escenario) {
        // Aplica el color al escenario general
        escenario.style.backgroundColor = colorHex;
        
        // Si estamos en la habitación, aseguramos que el color se refleje visualmente
        if (ambienteActual === 'habitacion') {
            escenario.style.setProperty('background-color', colorHex, 'important');
        }
    }
} // <--- ¡Aquí estaba faltando esta llave que cerraba cambiarColorPared!

// Variable para almacenar el ángulo de rotación actual del piso
let anguloRotacionZ = 0;

let anguloActual = 0;

function girarPiso(accion) {
    const capaPiso = document.getElementById('capa-piso');
    if (!capaPiso) return;

    if (accion === 'izquierda') {
        anguloActual -= 90;
    } else if (accion === 'derecha') {
        anguloActual += 90;
    } else if (accion === 'reset') {
        anguloActual = 0;
    }

    // Aplicamos el cambio de forma inmediata combinando la perspectiva con el giro plano 2D exacto
    capaPiso.style.transition = 'none'; // Sin retrasos ni animaciones
    capaPiso.style.transform = `perspective(350px) rotateX(42deg) rotate(${anguloActual}deg)`;
}
