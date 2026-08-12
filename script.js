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

// Cambiar entre vistas principales (Corregido para evitar bloqueos)
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

function cambiarAmbiente(ambiente) {
    ambienteActual = ambiente;
    const escenario = document.getElementById('escenario');
    const btnZonaPared = document.getElementById('btn-zona-pared');
    
    if (escenario) {
        escenario.className = 'escenario-container';
        escenario.classList.add(`escenario-${ambiente}`);
    }

    // Solo el baño permite cambiar pared y piso. Sala y habitación solo usan piso.
    if (ambiente === 'bano') {
        btnZonaPared.classList.remove('oculto');
    } else {
        btnZonaPared.classList.add('oculto');
    }
    
    // Forzar siempre que al cambiar de ambiente se seleccione el piso por defecto
    seleccionarZona('piso');

    document.getElementById('titulo-ambiente').innerText = `Simulador de ${ambiente.toUpperCase()}`;
    document.getElementById('span-nombre-ambiente').innerText = ambiente;

}

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

// Cargar elementos en el catálogo lateral
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
    const idCapa = zonaSeleccionada === 'piso' ? 'capa-piso' : 'capa-paredes';
    const capa = document.getElementById(idCapa);
    
    if (capa) {
        capa.style.backgroundImage = `url("${urlImagen}")`;
        capa.style.backgroundRepeat = 'repeat';
        capa.style.backgroundSize = '110px 110px'; 
        capa.style.backgroundPosition = 'center bottom';
    }
}

function cambiarColorPared(colorHex) {
    const escenario = document.getElementById('escenario');
    if (escenario) {
        escenario.style.backgroundColor = colorHex;
    }
}
