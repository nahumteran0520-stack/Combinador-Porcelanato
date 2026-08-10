// --- CONFIGURACIÓN Y VARIABLES ---
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7CEmtB5yelhe07mk3PjF1I1RWuW3_7nJIFA7cno1vwITWLSsEpC49LdwhnqxWSga0/exec";
let paredActual = "piso-marmoleadoblanco-344.jpg";
let pisoActual = "piso-marmoleadonegro-358.jpg";

// Variables para la rotación suave (Inercia)
let rotY = 0;
let objetivoRotY = 0;
let isDragging = false;
let lastX = 0;

// --- REGISTRO EN GOOGLE SHEETS ---
function registrarEnSheet(opcionPared, opcionPiso) {
    if (!GOOGLE_WEB_APP_URL || GOOGLE_WEB_APP_URL.includes("TU_NUEVA_URL_AQUI")) return;
    const formData = new FormData();
    formData.append("pared", opcionPared);
    formData.append("piso", opcionPiso);
    fetch(GOOGLE_WEB_APP_URL, { method: "POST", mode: "no-cors", body: formData }).catch(err => console.error(err));
}

// --- TEXTURAS ---
function cambiarParedes(imagen) {
    paredActual = imagen;
    const ruta = `url('${imagen}')`;
    document.querySelectorAll('#pared-fondo, #pared-izq, #pared-der').forEach(el => el.style.backgroundImage = ruta);
    registrarEnSheet(paredActual, pisoActual);
}

function cambiarPiso(imagen) {
    pisoActual = imagen;
    document.getElementById('piso').style.backgroundImage = `url('${imagen}')`;
    registrarEnSheet(paredActual, pisoActual);
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

// --- LÓGICA DE GIRO SUAVE (INERCIA) ---
// --- LÓGICA DE GIRO 3D REAL ---
function animarRotacion() {
    rotY += (objetivoRotY - rotY) * 0.08; // Un poco más rápido
    const habitacionEl = document.getElementById('habitacion');
    if (habitacionEl) {
        // Rotamos en Y para el giro, y mantenemos una inclinación leve en X para que se vea "desde arriba"
        habitacionEl.style.transform = `rotateX(-10deg) rotateY(${rotY}deg)`;
    }
    requestAnimationFrame(animarRotacion);
}

// Eventos de Mouse / Tactil para girar la habitación
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

// Inicialización al cargar la página
window.onload = () => {
    cambiarParedes(paredActual);
    cambiarPiso(pisoActual);
    animarRotacion();
};
