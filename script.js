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
// Función para calcular rendimiento, cajas y pego (Ajustado pego a 1.5 m²)
function calcularMateriales() {
  const alto = parseFloat(document.getElementById('alto').value) || 0;
  const ancho = parseFloat(document.getElementById('ancho').value) || 0;
  const rendimientoCaja = parseFloat(document.getElementById('rendimiento-caja').value) || 1.44;

  if (alto <= 0 || ancho <= 0) {
    alert("Por favor, ingresa dimensiones válidas (alto y ancho).");
    return;
  }

  // Área base
  const areaBase = alto * ancho;
  
  // Se agrega un 10% estándar para cortes y desperdicio
  const areaTotal = areaBase * 1.10;

  // Cálculo de cajas necesarias (redondeado hacia arriba)
  const cajasNecesarias = Math.ceil(areaTotal / rendimientoCaja);

  // Rendimiento ajustado: 1 saco rinde 1.5 m²
  const sacosPego = Math.ceil(areaTotal / 1.5);

  // Mostrar resultados en pantalla
  document.getElementById('res-area').innerText = areaTotal.toFixed(2);
  document.getElementById('res-cajas').innerText = cajasNecesarias;
  document.getElementById('res-pego').innerText = sacosPego;

  // Hacer visible la caja de resultados
  document.getElementById('resultado-calculo').style.display = 'block';
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
function calcularMateriales() {
  const inputAlto = document.getElementById('alto');
  const inputAncho = document.getElementById('ancho');
  const inputRendimiento = document.getElementById('rendimiento-caja');
  const divResultado = document.getElementById('resultado-calculo');

  if (!inputAlto || !inputAncho || !inputRendimiento || !divResultado) {
    alert("Error: Revisa los IDs en el HTML de la calculadora.");
    return;
  }

  const alto = parseFloat(inputAlto.value);
  const ancho = parseFloat(inputAncho.value);
  const rendimientoCaja = parseFloat(inputRendimiento.value) || 1.44;

  if (isNaN(alto) || isNaN(ancho) || alto <= 0 || ancho <= 0) {
    alert("Por favor, ingresa el alto y el ancho en metros.");
    return;
  }

  // Área con 10% de desperdicio
  const areaTotal = (alto * ancho) * 1.10;
  const cajasNecesarias = Math.ceil(areaTotal / rendimientoCaja);
  
  // Pego rinde 1.5 m² por saco
  const sacosPego = Math.ceil(areaTotal / 1.5);

  document.getElementById('res-area').innerText = areaTotal.toFixed(2);
  document.getElementById('res-cajas').innerText = cajasNecesarias;
  document.getElementById('res-pego').innerText = sacosPego;

  divResultado.style.display = 'block';
}
