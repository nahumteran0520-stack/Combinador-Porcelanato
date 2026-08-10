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
function calcularMaterialesTotales() {
  // Obtener valores de Pared
  const altoPared = parseFloat(document.getElementById('pared-alto').value) || 0;
  const anchoPared = parseFloat(document.getElementById('pared-ancho').value) || 0;
  const cajaPared = parseFloat(document.getElementById('pared-caja').value) || 1.44;

  // Obtener valores de Piso
  const largoPiso = parseFloat(document.getElementById('piso-largo').value) || 0;
  const anchoPiso = parseFloat(document.getElementById('piso-ancho').value) || 0;
  const cajaPiso = parseFloat(document.getElementById('piso-caja').value) || 1.44;

  if ((altoPared <= 0 || anchoPared <= 0) && (largoPiso <= 0 || anchoPiso <= 0)) {
    alert("Por favor, ingresa las medidas de al menos una sección (Pared o Piso).");
    return;
  }

  // CÁLCULO EXACTO PARED (Alto x Ancho)
  const areaParedTotal = altoPared * anchoPared;
  const cajasPared = Math.ceil(areaParedTotal / cajaPared);

  // CÁLCULO EXACTO PISO (Largo x Ancho)
  const areaPisoTotal = largoPiso * anchoPiso;
  const cajasPiso = Math.ceil(areaPisoTotal / cajaPiso);

  // CÁLCULO TOTAL PEGO EXACTO (Sumatoria de áreas / 1.5)
  const areaGlobal = areaParedTotal + areaPisoTotal;
  const sacosPegoTotal = Math.ceil(areaGlobal / 1.5);

  // Mostrar Resultados
  document.getElementById('res-area-pared').innerText = areaParedTotal.toFixed(2);
  document.getElementById('res-cajas-pared').innerText = cajasPared;

  document.getElementById('res-area-piso').innerText = areaPisoTotal.toFixed(2);
  document.getElementById('res-cajas-piso').innerText = cajasPiso;

  document.getElementById('res-total-pego').innerText = sacosPegoTotal;

  document.getElementById('resultado-calculo').style.display = 'block';
}

  // Obtener valores de Piso
  const largoPiso = parseFloat(document.getElementById('piso-largo').value) || 0;
  const anchoPiso = parseFloat(document.getElementById('piso-ancho').value) || 0;
  const cajaPiso = parseFloat(document.getElementById('piso-caja').value) || 1.44;

  if ((altoPared <= 0 || anchoPared <= 0) && (largoPiso <= 0 || anchoPiso <= 0)) {
    alert("Por favor, ingresa las medidas de al menos una sección (Pared o Piso).");
    return;
  }

  // CÁLCULO EXACTO PARED (Alto x Ancho)
  const areaParedTotal = altoPared * anchoPared;
  const cajasPared = Math.ceil(areaParedTotal / cajaPared);

  // CÁLCULO EXACTO PISO (Largo x Ancho)
  const areaPisoTotal = largoPiso * anchoPiso;
  const cajasPiso = Math.ceil(areaPisoTotal / cajaPiso);

  // CÁLCULO TOTAL PEGO EXACTO (Sumatoria de áreas / 1.5)
  const areaGlobal = areaParedTotal + areaPisoTotal;
  const sacosPegoTotal = Math.ceil(areaGlobal / 1.5);

  // Mostrar Resultados
  document.getElementById('res-area-pared').innerText = areaParedTotal.toFixed(2);
  document.getElementById('res-cajas-pared').innerText = cajasPared;

  document.getElementById('res-area-piso').innerText = areaPisoTotal.toFixed(2);
  document.getElementById('res-cajas-piso').innerText = cajasPiso;

  document.getElementById('res-total-pego').innerText = sacosPegoTotal;

  document.getElementById('resultado-calculo').style.display = 'block';
}

  // Obtener valores de Piso
  const largoPiso = parseFloat(document.getElementById('piso-largo').value) || 0;
  const anchoPiso = parseFloat(document.getElementById('piso-ancho').value) || 0;
  const cajaPiso = parseFloat(document.getElementById('piso-caja').value) || 1.44;

  if ((altoPared <= 0 || anchoPared <= 0) && (largoPiso <= 0 || anchoPiso <= 0)) {
    alert("Por favor, ingresa las medidas de al menos una sección (Pared o Piso).");
    return;
  }

  // CÁLCULO PARED (Alto x Ancho x 1.10)
  const areaParedTotal = (altoPared * anchoPared) * 1.10;
  const cajasPared = Math.ceil(areaParedTotal / cajaPared);

  // CÁLCULO PISO (Largo x Ancho x 1.10)
  const areaPisoTotal = (largoPiso * anchoPiso) * 1.10;
  const cajasPiso = Math.ceil(areaPisoTotal / cajaPiso);

  // CÁLCULO TOTAL PEGO (Sumatoria de áreas / 1.5)
  const areaGlobal = areaParedTotal + areaPisoTotal;
  const sacosPegoTotal = Math.ceil(areaGlobal / 1.5);

  // Mostrar Resultados
  document.getElementById('res-area-pared').innerText = areaParedTotal.toFixed(2);
  document.getElementById('res-cajas-pared').innerText = cajasPared;

  document.getElementById('res-area-piso').innerText = areaPisoTotal.toFixed(2);
  document.getElementById('res-cajas-piso').innerText = cajasPiso;

  document.getElementById('res-total-pego').innerText = sacosPegoTotal;

  document.getElementById('resultado-calculo').style.display = 'block';
}
