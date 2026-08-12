// Variables de estado global
let ambienteActual = '';
let zonaSeleccionada = 'piso'; // 'piso' o 'pared'

// Base de datos simulada del catálogo de porcelanatos (con texturas en patrón repetible)
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

// Cambiar entre vistas principales
function cambiarVista(idVista) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
    document.getElementById(idVista).classList.add('activa');
}

// Iniciar ambiente seleccionado
function cambiarAmbiente(ambiente) {
    ambienteActual = ambiente;
    const escenario = document.getElementById('escenario');
    const btnZonaPared = document.getElementById('btn-zona-pared');
    
    // Limpiar clases anteriores y asignar la nueva
    escenario.className = 'escenario-container';
    escenario.classList.add(`escenario-${ambiente}`);

    // Configurar visibilidad de paredes según el ambiente (Solo baño permite pared)
    if (ambiente === 'bano') {
        btnZonaPared.classList.remove('oculto');
    } else {
        btnZonaPared.classList.add('oculto');
        seleccionarZona('piso'); // Forzar selección a piso si viene de baño
    }

    // Actualizar títulos
    document.getElementById('titulo-ambiente').innerText = `Simulador de ${ambiente.toUpperCase()}`;
    document.getElementById('span-nombre-ambiente').innerText = ambiente;

    cargarCatalogo();
    cambiarVista('vista-visualizador');
}

function volverMenu() {
    cambiarVista('vista-menu');
}

function irACalculadora() {
    const grupoParedes = document.getElementById('grupo-paredes');
    if (ambienteActual === 'bano') {
        grupoParedes.classList.remove('oculto');
    } else {
        grupoParedes.classList.add('oculto');
    }
    document.getElementById('resultado-calculo').classList.add('oculto');
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
        document.querySelector('.selector-zona button:first-child').classList.add('activo');
    } else {
        document.getElementById('btn-zona-pared').classList.add('activo');
    }
}

// Cargar elementos en el catálogo lateral
function cargarCatalogo() {
    const grid = document.getElementById('grid-catalogo');
    grid.innerHTML = '';

    catalogoPorcelanatos.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-porcelanato';
        div.innerHTML = `
            <img src="${item.url}" alt="${item.nombre}">
            <span>${item.nombre}</span>
        `;
        div.onclick = () => aplicarTextura(item.url);
        grid.appendChild(div);
    });
}

// Aplicar textura seleccionada a la capa transparente correspondiente
function aplicarTextura(urlImagen) {
    const capa = document.getElementById(zonaSeleccionada === 'piso' ? 'capa-piso' : 'capa-paredes');
    capa.style.backgroundImage = `url(${urlImagen})`;
    capa.style.backgroundRepeat = 'repeat';
    capa.style.backgroundSize = '100px 100px'; // Simula la escala de las piezas
}

// Lógica de cálculo de materiales (Considerando formato estándar de caja de 1.44 m²)
function calcularMateriales() {
    const largo = parseFloat(document.getElementById('input-largo').value) || 0;
    const ancho = parseFloat(document.getElementById('input-ancho').value) || 0;
    const alto = parseFloat(document.getElementById('input-alto').value) || 0;
    const desperdicio = parseFloat(document.getElementById('select-desperdicio').value);
    
    if (largo <= 0 || ancho <= 0) {
        alert('Por favor, ingresa medidas válidas para el área.');
        return;
    }

    // Metros cuadrados de piso
    const m2Piso = largo * ancho;
    const totalM2PisoConDesperdicio = m2Piso * desperdicio;
    const cajasPiso = Math.ceil(totalM2PisoConDesperdicio / 1.44); // 1.44m² por caja estándar

    let textoPiso = `<strong>Área de Piso:</strong> ${m2Piso.toFixed(2)} m².<br>Necesitarás aprox. <strong>${cajasPiso} cajas</strong> (${totalM2PisoConDesperdicio.toFixed(2)} m² con desperdicio).`;
    document.getElementById('texto-resultado-piso').innerHTML = textoPiso;

    const divResultado = document.getElementById('resultado-calculo');
    const textoParedes = document.getElementById('texto-resultado-pared');

    // Si es baño, calcular también paredes
    if (ambienteActual === 'bano' && alto > 0) {
        const perimetro = (largo + ancho) * 2;
        const m2Paredes = perimetro * alto;
        const totalM2ParedConDesperdicio = m2Paredes * desperdicio;
        const cajasPared = Math.ceil(totalM2ParedConDesperdicio / 1.44);

        textoParedes.innerHTML = `<strong>Área de Paredes:</strong> ${m2Paredes.toFixed(2)} m².<br>Necesitarás aprox. <strong>${cajasPared} cajas</strong> (${totalM2ParedConDesperdicio.toFixed(2)} m² con desperdicio).`;
        textoParedes.classList.remove('oculto');
    } else {
        textoParedes.classList.add('oculto');
    }

    divResultado.classList.remove('oculto');
}
