// PEGA AQUÍ LA URL QUE COPIASTE DE GOOGLE APPS SCRIPT:
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbweGwf3Hc4lU-ZkY4rgxK4mKRMnV54Px0bcvLphOAXqG-fdL2C_Urle-2b9htS4heo1/exec";

// Variables para recordar la selección actual del usuario
let paredActual = "piso-marmoleadoblanco-344.jpg";
let pisoActual = "piso-marmoleadonegro-358.jpg";

// Función que envía los datos a tu Google Sheet
function registrarEnSheet(opcionPared, opcionPiso) {
  if (GOOGLE_WEB_APP_URL.includes("TU_SCRIPT_ID_AQUI")) return;

  fetch(GOOGLE_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pared: opcionPared,
      piso: opcionPiso
    })
  }).catch(err => console.error("Error al registrar:", err));
}

// Funciones para cambiar superficies y guardar la selección
function cambiarParedes(imagen) {
  paredActual = imagen;
  const ruta = `url('${imagen}')`;
  document.getElementById('pared-fondo').style.backgroundImage = ruta;
  document.getElementById('pared-izq').style.backgroundImage = ruta;
  document.getElementById('pared-der').style.backgroundImage = ruta;
  
  // Registra la combinación elegida
  registrarEnSheet(paredActual, pisoActual);
}

function cambiarPiso(imagen) {
  pisoActual = imagen;
  document.getElementById('piso').style.backgroundImage = `url('${imagen}')`;
  
  // Registra la combinación elegida
  registrarEnSheet(paredActual, pisoActual);
}

// Registrar ingreso inicial
window.onload = function() {
  registrarEnSheet(paredActual, pisoActual);
};
