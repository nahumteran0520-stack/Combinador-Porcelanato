// --- CONFIGURACIÓN Y VARIABLES ---
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7CEmtB5yelhe07mk3PjF1I1RWuW3_7nJIFA7cno1vwITWLSsEpC49LdwhnqxWSga0/exec";
let paredActual = "piso-marmoleadoblanco-344.jpg";
let pisoActual = "piso-marmoleadonegro-358.jpg";

// --- REGISTRO EN GOOGLE SHEETS ---
function registrarVisitaEnSheets(pared, piso) {
    if (!GOOGLE_WEB_APP_URL || GOOGLE_WEB_APP_URL.includes("TU_URL")) return;
    const datos = { pared: pared, piso: piso };

    fetch(GOOGLE_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    }).catch(error => console.error("Error al registrar:", error));
}

// --- CONFIGURACIÓN Y VARIABLES ---
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7CEmtB5yelhe07mk3PjF1I1RWuW3_7nJIFA7cno1vwITWLSsEpC49LdwhnqxWSga0/exec";
let paredActual = "piso-marmoleadoblanco-344.jpg";
let pisoActual = "piso-marmoleadonegro-358.jpg";

// --- REGISTRO EN GOOGLE SHEETS ---
function registrarVisitaEnSheets(pared, piso) {
    if (!GOOGLE_WEB_APP_URL || GOOGLE_WEB_APP_URL.includes("TU_URL")) return;
    const datos = { pared: pared, piso: piso };

    fetch(GOOGLE_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    }).catch(error => console.error("Error al registrar:", error));
}

// --- TEXTURAS ---
function cambiarPares(imagen) {
    paredActual = imagen;
    
    // Si en el futuro deseas que la pared también cambie de imagen de fondo de manera dinámica,
    // puedes descomentar la línea de abajo asegurándote de tener un elemento con id 'escena-base' o similar:
    // const escenaBase = document.querySelector('.escena-base');
    // if (escenaBase) { escenaBase.style.backgroundImage = `url('${imagen}')`; }

    registrarVisitaEnSheets(paredActual, pisoActual);
}

function cambiarPiso(imagen) {
    pisoActual = imagen;
    const pisoEl = document.getElementById('piso');
    if (pisoEl) {
        pisoEl.style.backgroundImage = `url('${imagen}')`;
    }
    registrarVisitaEnSheets(paredActual, pisoActual);
}

// --- ILUMINACIÓN ---
function cambiarLuz(tipo, boton) {
    document.querySelectorAll('.btn-luz').forEach(btn => btn.classList.remove('activo'));
    boton.classList.add('activo');
    const hab = document.getElementById('habitacion');
    if (!hab) return;
    hab.className = 'habitacion'; 
    hab.classList.add('modo-' + tipo);
}

// --- CALCULADORA DE MATERIALES ---
function calcularMaterialesTotales() {
    const getVal = (id, def) => {
        const el = document.getElementById(id);
        if (!el || !el.value) return def;
        return parseFloat(el.value.toString().replace(',', '.')) || def;
    };
    
    const areaPared = getVal('pared-alto', 0) * getVal('pared-ancho', 0);
    const areaPiso = getVal('piso-largo', 0) * getVal('piso-ancho', 0);
    const selectPego = document.getElementById('tipo-pego');
    const rendimientoPego = selectPego ? parseFloat(selectPego.value) : 1.5;

    if (areaPared === 0 && areaPiso === 0) {
        alert("Por favor, ingresa al menos las medidas de Pared o Piso.");
        return;
    }

    document.getElementById('res-area-pared').innerText = areaPared.toFixed(2);
    document.getElementById('res-cajas-pared').innerText = Math.ceil(areaPared / getVal('pared-caja', 1.44));
    document.getElementById('res-area-piso').innerText = areaPiso.toFixed(2);
    document.getElementById('res-cajas-piso').innerText = Math.ceil(areaPiso / getVal('piso-caja', 1.44));
    
    const sacos = Math.ceil((areaPared + areaPiso) / rendimientoPego);
    const labelSacos = rendimientoPego === 1.5 ? "14 kg" : "10 kg";
    document.getElementById('res-total-pego').innerText = `${sacos} sacos (${labelSacos})`;
    document.getElementById('resultado-calculo').style.display = 'block';
}

// Inicialización
window.onload = () => {
    cambiarPiso(pisoActual);
};

function cambiarPiso(imagen) {
    pisoActual = imagen;
    const pisoEl = document.getElementById('piso');
    if (pisoEl) {
        pisoEl.style.backgroundImage = `url('${imagen}')`;
    }
    registrarVisitaEnSheets(paredActual, pisoActual);
}

// --- ILUMINACIÓN ---
function cambiarLuz(tipo, boton) {
    document.querySelectorAll('.btn-luz').forEach(btn => btn.classList.remove('activo'));
    boton.classList.add('activo');
    const hab = document.getElementById('habitacion');
    if (!hab) return;
    hab.className = 'habitacion'; 
    hab.classList.add('modo-' + tipo);
}

// --- CALCULADORA DE MATERIALES ---
function calcularMaterialesTotales() {
    const getVal = (id, def) => {
        const el = document.getElementById(id);
        if (!el || !el.value) return def;
        return parseFloat(el.value.toString().replace(',', '.')) || def;
    };
    
    const areaPared = getVal('pared-alto', 0) * getVal('pared-ancho', 0);
    const areaPiso = getVal('piso-largo', 0) * getVal('piso-ancho', 0);
    const selectPego = document.getElementById('tipo-pego');
    const rendimientoPego = selectPego ? parseFloat(selectPego.value) : 1.5;

    if (areaPared === 0 && areaPiso === 0) {
        alert("Por favor, ingresa al menos las medidas de Pared o Piso.");
        return;
    }

    document.getElementById('res-area-pared').innerText = areaPared.toFixed(2);
    document.getElementById('res-cajas-pared').innerText = Math.ceil(areaPared / getVal('pared-caja', 1.44));
    document.getElementById('res-area-piso').innerText = areaPiso.toFixed(2);
    document.getElementById('res-cajas-piso').innerText = Math.ceil(areaPiso / getVal('piso-caja', 1.44));
    
    const sacos = Math.ceil((areaPared + areaPiso) / rendimientoPego);
    const labelSacos = rendimientoPego === 1.5 ? "14 kg" : "10 kg";
    document.getElementById('res-total-pego').innerText = `${sacos} sacos (${labelSacos})`;
    document.getElementById('resultado-calculo').style.display = 'block';
}

// Inicialización
window.onload = () => {
    cambiarPiso(pisoActual);
};
