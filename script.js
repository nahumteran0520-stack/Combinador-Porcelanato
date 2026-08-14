// --- BASE DE DATOS DEL CATÁLOGO ---
const catalogoPorcelanatos = [
    { id: 'p1', nombre: 'Porcelanato Beige', tipo: 'piso', imagen: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80', m2PorCaja: 1.44 },
    { id: 'p2', nombre: 'Porcelanato Gris Mármol', tipo: 'piso', imagen: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=300&q=80', m2PorCaja: 1.44 },
    { id: 'p3', nombre: 'Mármol Carrara Blanco', tipo: 'piso', imagen: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80', m2PorCaja: 1.44 },
    { id: 'pared1', nombre: 'Cerámica Pared Blanca', tipo: 'pared', imagen: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80', m2PorCaja: 1.50 }
];

let ambienteActual = 'sala';
let zonaSeleccionada = 'piso';
let anguloGiro = 0;
let productoPisoSeleccionado = catalogoPorcelanatos[0];
let productoParedSeleccionado = null;

// --- NAVEGACIÓN ENTRE VISTAS ---
function cambiarAmbiente(ambiente) {
    ambienteActual = ambiente;
    
    const vistaMenu = document.getElementById('vista-menu');
    const vistaVis = document.getElementById('vista-visualizador');
    
    if (vistaMenu) vistaMenu.classList.remove('activa');
    if (vistaVis) vistaVis.classList.add('activa');
    
    const titulo = document.getElementById('titulo-ambiente');
    if (titulo) {
        titulo.textContent = 'Ambiente: ' + ambiente.charAt(0).toUpperCase() + ambiente.slice(1);
    }
    
    const escenario = document.getElementById('escenario');
    if (escenario) {
        escenario.className = 'escenario-container escenario-' + ambiente;
    }
    
    const btnPared = document.getElementById('btn-zona-pared');
    const grupoParedes = document.getElementById('grupo-paredes');
    
    if (ambiente === 'bano') {
        if (btnPared) btnPared.classList.remove('oculto');
        if (grupoParedes) grupoParedes.classList.remove('oculto');
    } else {
        if (btnPared) btnPared.classList.add('oculto');
        if (grupoParedes) grupoParedes.classList.add('oculto');
        seleccionarZona('piso');
    }
    
    cargarCatalogo();
}

function volverMenu() {
    const vistaMenu = document.getElementById('vista-menu');
    const vistaVis = document.getElementById('vista-visualizador');
    
    if (vistaVis) vistaVis.classList.remove('activa');
    if (vistaMenu) vistaMenu.classList.add('activa');
}

// --- ROTACIÓN DEL PISO ---
function girarPiso(direccion) {
    const capaPiso = document.getElementById('capa-piso');
    if (!capaPiso) return;
    
    if (direccion === 'izquierda') {
        anguloGiro -= 45;
    } else if (direccion === 'derecha') {
        anguloGiro += 45;
    } else if (direccion === 'reset') {
        anguloGiro = 0;
    }
    
    capaPiso.style.transform = `perspective(350px) rotateX(42deg) scaleX(1.45) rotate(${anguloGiro}deg)`;
}

// --- CAMBIO DE COLOR DE PARED ---
function cambiarColorPared(color) {
    const capaParedes = document.getElementById('capa-paredes');
    if (capaParedes) {
        capaParedes.style.backgroundColor = color;
        capaParedes.style.backgroundImage = 'none';
    }
}

// --- SELECCIÓN Y CÁTALOGO ---
function seleccionarZona(zona) {
    zonaSeleccionada = zona;
    const btns = document.querySelectorAll('.btn-zona');
    btns.forEach(btn => btn.classList.remove('activo'));
    
    if (zona === 'piso') {
        const btnPiso = document.querySelector('.btn-zona[onclick*="piso"]');
        if (btnPiso) btnPiso.classList.add('activo');
    } else if (zona === 'pared') {
        const btnPared = document.getElementById('btn-zona-pared');
        if (btnPared) btnPared.classList.add('activo');
    }
    
    cargarCatalogo();
}

function cargarCatalogo() {
    const grid = document.getElementById('grid-catalogo');
    if (!grid) return;
    grid.innerHTML = '';
    
    const productosFiltrados = catalogoPorcelanatos.filter(item => item.tipo === zonaSeleccionada);
    
    productosFiltrados.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'item-porcelanato';
        card.onclick = () => aplicarPorcelanato(prod);
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <span>${prod.nombre}</span>
        `;
        grid.appendChild(card);
    });
}

function aplicarPorcelanato(producto) {
    if (producto.tipo === 'piso') {
        productoPisoSeleccionado = producto;
        const capaPiso = document.getElementById('capa-piso');
        if (capaPiso) {
            capaPiso.style.backgroundImage = `url('${producto.imagen}')`;
        }
    } else if (producto.tipo === 'pared') {
        productoParedSeleccionado = producto;
        const capaParedes = document.getElementById('capa-paredes');
        if (capaParedes) {
            capaParedes.style.backgroundImage = `url('${producto.imagen}')`;
            capaParedes.style.backgroundColor = 'transparent';
        }
    }
}

// --- CALCULADORA ---
function abrirCalculadora() {
    const modal = document.getElementById('modal-calculadora');
    const spanAmbiente = document.getElementById('span-nombre-ambiente');
    if (spanAmbiente) spanAmbiente.textContent = ambienteActual;
    if (modal) modal.classList.remove('oculto');
}

function cerrarCalculadora() {
    const modal = document.getElementById('modal-calculadora');
    if (modal) modal.classList.add('oculto');
}

function calcularMateriales() {
    const largo = parseFloat(document.getElementById('input-largo')?.value) || 0;
    const ancho = parseFloat(document.getElementById('input-ancho')?.value) || 0;
    const alto = parseFloat(document.getElementById('input-alto')?.value) || 0;
    const pegoTipo = parseFloat(document.getElementById('select-pego')?.value) || 14;
    
    const coberturaPego = pegoTipo === 14 ? 1.5 : 1.0;
    
    const areaPiso = largo * ancho;
    const rendimientoPiso = productoPisoSeleccionado ? productoPisoSeleccionado.m2PorCaja : 1.44;
    const cajasPiso = areaPiso > 0 ? Math.ceil(areaPiso / rendimientoPiso) : 0;
    const sacosPegoPiso = areaPiso > 0 ? Math.ceil(areaPiso / coberturaPego) : 0;
    
    const txtPiso = document.getElementById('texto-resultado-piso');
    const txtPegoPiso = document.getElementById('texto-resultado-pego-piso');
    
    if (txtPiso) txtPiso.innerHTML = `<strong>Piso:</strong> ${areaPiso.toFixed(2)} m² = <strong>${cajasPiso} cajas</strong>`;
    if (txtPegoPiso) txtPegoPiso.innerHTML = `<strong>Pego para Piso:</strong> ${sacosPegoPiso} sacos`;
    
    if (ambienteActual === 'bano' && alto > 0) {
        const perimetro = (largo + ancho) * 2;
        const areaParedes = perimetro * alto;
        const rendimientoPared = productoParedSeleccionado ? productoParedSeleccionado.m2PorCaja : 1.5;
        const cajasPared = Math.ceil(areaParedes / rendimientoPared);
        const sacosPegoPared = Math.ceil(areaParedes / coberturaPego);
        
        const txtPared = document.getElementById('texto-resultado-pared');
        const txtPegoPared = document.getElementById('texto-resultado-pego-pared');
        
        if (txtPared) {
            txtPared.style.display = 'block';
            txtPared.innerHTML = `<strong>Paredes:</strong> ${areaParedes.toFixed(2)} m² = <strong>${cajasPared} cajas</strong>`;
        }
        if (txtPegoPared) {
            txtPegoPared.style.display = 'block';
            txtPegoPared.innerHTML = `<strong>Pego para Pared:</strong> ${sacosPegoPared} sacos`;
        }
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogo();
});

