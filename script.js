// URL de tu Google Apps Script activa
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw7CEmtB5yelhe07mk3PjF1I1RWuW3_7nJIFA7cno1vwITWLSsEpC49LdwhnqxWSga0/exec";

let paredActual = "piso-marmoleadoblanco-344.jpg";
let pisoActual = "piso-marmoleadonegro-358.jpg";

// Enviar datos a Google Sheets usando FormData (evita bloqueos CORS)
function registrarEnSheet(opcionPared, opcionPiso) {
    if (!GOOGLE_WEB_APP_URL || GOOGLE_WEB_APP_URL.includes("TU_NUEVA_URL_AQUI")) return;

    const formData = new FormData();
    formData.append("pared", opcionPared);
    formData.append("piso", opcionPiso);

    fetch(GOOGLE_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    }).catch(err => console.error("Error al registrar en Google Sheets:", err));
}

// Cambiar texturas de pared
function cambiarParedes(imagen) {
    paredActual = imagen;
    const ruta = "url('" + imagen + "')";
    if (document.getElementById('pared-fondo')) document.getElementById('pared-fondo').style.backgroundImage = ruta;
    if (document.getElementById('pared-izq')) document.getElementById('pared-izq').style.backgroundImage = ruta;
    if (document.getElementById('pared-der')) document.getElementById('pared-der').style.backgroundImage = ruta;
    
    registrarEnSheet(paredActual, pisoActual);
}

// Cambiar textura de piso
function cambiarPiso(imagen) {
    pisoActual = imagen;
    if (document.getElementById('piso')) document.getElementById('piso').style.backgroundImage = "url('" + imagen + "')";
    
    registrarEnSheet(paredActual, pisoActual);
}

// Control de luces avanzado (Día, Noche, Cálida, Fría)
function cambiarLuz(tipo, boton) {
    const botones = document.querySelectorAll('.btn-luz');
    botones.forEach(btn => btn.classList.remove('activo'));
    
    boton.classList.add('activo');

    const habitacion = document.querySelector('.habitacion');
    if (!habitacion) return;
    
    habitacion.className = 'habitacion'; // Resetea clases previas
    
    if (tipo === 'dia') {
        habitacion.classList.add('modo-dia');
    } else if (tipo === 'noche') {
        habitacion.classList.add('modo-noche');
    } else if (tipo === 'calida') {
        habitacion.classList.add('modo-calida');
    } else if (tipo === 'fria') {
        habitacion.classList.add('modo-fria');
    }
}

// CALCULADORA DE MATERIALES EXACTOS (Con soporte para Pego de 10kg y 14kg)
function calcularMaterialesTotales() {
    function obtenerNumero(id, valorDefecto) {
        const el = document.getElementById(id);
        if (!el || !el.value) return valorDefecto;
        const val = el.value.toString().replace(',', '.');
        return parseFloat(val) || valorDefecto;
    }

    const altoPared = obtenerNumero('pared-alto', 0);
    const anchoPared = obtenerNumero('pared-ancho', 0);
    const cajaPared = obtenerNumero('pared-caja', 1.44);

    const largoPiso = obtenerNumero('piso-largo', 0);
    const anchoPiso = obtenerNumero('piso-ancho', 0);
    const cajaPiso = obtenerNumero('piso-caja', 1.44);

    // Obtener el rendimiento seleccionado del selector de pego (1.5 m² para 14kg o 1.0 m² para 10kg)
    const selectPego = document.getElementById('tipo-pego');
    const rendimientoPego = selectPego ? parseFloat(selectPego.value) : 1.5;

    if (altoPared <= 0 && anchoPared <= 0 && largoPiso <= 0 && anchoPiso <= 0) {
        alert("Por favor, ingresa al menos las medidas de Pared o Piso.");
        return;
    }

    // Cálculos
    const areaPared = altoPared * anchoPared;
    const cajasPared = areaPared > 0 ? Math.ceil(areaPared / cajaPared) : 0;

    const areaPiso = largoPiso * anchoPiso;
    const cajasPiso = areaPiso > 0 ? Math.ceil(areaPiso / cajaPiso) : 0;

    const areaTotalGlobal = areaPared + areaPiso;
    const sacosPego = areaTotalGlobal > 0 ? Math.ceil(areaTotalGlobal / rendimientoPego) : 0;

    // Actualizar pantalla
    if (document.getElementById('res-area-pared')) document.getElementById('res-area-pared').innerText = areaPared.toFixed(2);
    if (document.getElementById('res-cajas-pared')) document.getElementById('res-cajas-pared').innerText = cajasPared;

    if (document.getElementById('res-area-piso')) document.getElementById('res-area-piso').innerText = areaPiso.toFixed(2);
    if (document.getElementById('res-cajas-piso')) document.getElementById('res-cajas-piso').innerText = cajasPiso;

    const labelSacos = rendimientoPego === 1.5 ? "14 kg" : "10 kg";
    if (document.getElementById('res-total-pego')) {
        document.getElementById('res-total-pego').innerText = `${sacosPego} sacos (${labelSacos})`;
    }

    // Mostrar recuadro
    const divRes = document.getElementById('resultado-calculo');
    if (divRes) {
        divRes.style.display = 'block';
    }
}

// Inicialización al cargar la página
window.onload = function() {
    cambiarParedes(paredActual);
    cambiarPiso(pisoActual);
};
let rotY = 0;
let objetivoRotY = 0;

function animar() {
  rotY += (objetivoRotY - rotY) * 0.05; // 0.05 crea la inercia (suavidad)
  document.getElementById('habitacion').style.transform = `rotateY(${rotY}deg)`;
  requestAnimationFrame(animar);
}
animar();

// En el evento de mover el mouse:
function girar(e) {
  if (isDragging) {
    objetivoRotY += (e.clientX - lastX) * 0.2; // Sensibilidad baja para realismo
    lastX = e.clientX;
  }
}
