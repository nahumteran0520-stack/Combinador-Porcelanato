// --- CONFIGURACIÓN Y VARIABLES ---
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7CEmtB5yelhe07mk3PjF1I1RWuW3_7nJIFA7cno1vwITWLSsEpC49LdwhnqxWSga0/exec";
let paredActual = "piso-marmoleadoblanco-344.jpg";
let pisoActual = "piso-marmoleadonegro-358.jpg";

// Variables para la rotación suave (Inercia 3D)
let rotY = 0;
let objetivoRotY = 0;
let isDragging = false;
let lastX = 0;

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
function cambiarParedes(imagen) {
    paredActual = imagen;
    const ruta = `url('${imagen}')`;
    const paredFondo = document.getElementById('pared-fondo');
    if (paredFondo) {
        paredFondo.style.backgroundImage = ruta;
    }
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

// --- LÓGICA DE GIRO 3D (Opcional si usas capas planas) ---
function animarRotacion() {
    rotY += (objetivoRotY - rotY) * 0.08; 
    const habitacionEl = document.getElementById('habitacion');
    if (habitacionEl && Math.abs(objetivoRotY - rotY) > 0.01) {
        // Solo aplica rotación si el usuario está interactuando para evitar distorsionar la cama PNG plana
        habitacionEl.style.transform = `rotateY(${rotY * 0.2}deg)`;
    }
    requestAnimationFrame(animarRotacion);
}

// Eventos de Mouse para interactuar con la habitación
document.addEventListener('mousedown', (e) => { 
    if(e.target.closest('#habitacion')) {
        isDragging = true; 
        lastX = e.clientX; 
    }
});

document.addEventListener('mouseup', () => isDragging = false);

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        objetivoRotY += (e.clientX - lastX) * 0.4;
        lastX = e.clientX;
    }
});

// Soporte táctil para celulares y tablets
document.addEventListener('touchstart', (e) => {
    if(e.target.closest('#habitacion')) {
        isDragging = true;
        lastX = e.touches[0].clientX;
    }
});

document.addEventListener('touchend', () => isDragging = false);

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        objetivoRotY += (e.touches[0].clientX - lastX) * 0.4;
        lastX = e.touches[0].clientX;
    }
});

// Inicialización
window.onload = () => {
    cambiarParedes(paredActual);
    cambiarPiso(pisoActual);
    animarRotacion();
};
