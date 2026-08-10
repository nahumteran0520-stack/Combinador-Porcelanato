// Cambia la textura de las 3 paredes al mismo tiempo
function cambiarParedes(imagen) {
  const ruta = `url('${imagen}')`;
  document.getElementById('pared-fondo').style.backgroundImage = ruta;
  document.getElementById('pared-izq').style.backgroundImage = ruta;
  document.getElementById('pared-der').style.backgroundImage = ruta;
}

// Cambia la textura del piso
function cambiarPiso(imagen) {
  document.getElementById('piso').style.backgroundImage = `url('${imagen}')`;
}