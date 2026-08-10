// URL de tu Google Apps Script
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/TU_NUEVA_URL_AQUI/exec";

let paredActual = "piso-marmoleadoblanco-344.jpg";
let pisoActual = "piso-marmoleadonegro-358.jpg";

// Enviar datos a Google Sheets
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
  const ruta = `url('${imagen}')`;
  document.getElementById('pared-fondo').style.backgroundImage = ruta;
  document.getElementById('pared-izq').style.backgroundImage = ruta;
  document.getElementById('pared-der').style.backgroundImage = ruta;
  
  registrarEnSheet(paredActual, pisoActual);
}

// Cambiar textura de piso
function cambiarPiso(imagen) {
  pisoActual = imagen;
  document.getElementById('piso').style.backgroundImage = `url('${imagen}')`;
  
  registrarEnSheet(paredActual, pisoActual);
}

// Función corregida de Cambio de Luz (Día / Noche)
function cambiarLuz(modo, elementoBtn) {
  const habitacion = document.querySelector('.habitacion');
  const botones = document.querySelectorAll('.btn-luz');

  // Remover estado activo de todos los botones
  botones.forEach(btn => btn.classList.remove('activo'));

  // Aplicar efecto en la habitación
  if (modo === 'noche') {
    habitacion.classList.remove('modo-dia');
    habitacion.classList.add('modo-noche');
  } else {
    habitacion.classList.remove('modo-noche');
    habitacion.classList.add('modo-dia');
  }

  // Activar botón presionado
  if (elementoBtn) {
    elementoBtn.classList.add('activo');
  }
}

// Registro inicial
window.onload = function() {
  registrarEnSheet(paredActual, pisoActual);
};
