const datosAmbientes = {
  sala: {
    titulo: "Visualizador - Sala",
    fondo: "habitacion.png",
    muebles: "muebles-encima.png",
    permitePared: false
  },
  bano: {
    titulo: "Visualizador - Baño",
    fondo: "bano-fondo.png",
    muebles: "bano-encima.png",
    permitePared: true
  },
  habitacion: {
    titulo: "Visualizador - Habitación",
    fondo: "habitacion.png",
    muebles: "muebles-encima.png",
    permitePared: false
  }
};

function iniciarSimulador(tipo) {
  const config = datosAmbientes[tipo];
  
  document.getElementById('titulo-visor').textContent = config.titulo;
  document.getElementById('escena-fondo').style.backgroundImage = `url('${config.fondo}')`;
  document.getElementById('muebles-capa').src = config.muebles;

  const elementosPared = document.querySelectorAll('.seccion-pared-calc');
  const paredInteractiva = document.getElementById('pared-interactiva');

  if (config.permitePared) {
    elementosPared.forEach(el => el.style.display = 'block');
    paredInteractiva.style.display = 'block';
  } else {
    elementosPared.forEach(el => el.style.display = 'none');
    paredInteractiva.style.display = 'none';
  }

  document.getElementById('selector-ambiente').style.display = 'none';
  document.getElementById('app-principal').style.display = 'block';
}

function volverAlMenu() {
  document.getElementById('app-principal').style.display = 'none';
  document.getElementById('selector-ambiente').style.display = 'block';
  document.getElementById('resultado-calculo').style.display = 'none';
}

function cambiarPiso(imagenUrl) {
  document.getElementById('piso-interactivo').style.backgroundImage = `url('${imagenUrl}')`;
}

function cambiarPared(imagenUrl) {
  document.getElementById('pared-interactiva').style.backgroundImage = `url('${imagenUrl}')`;
}

function calcularMaterialesTotales() {
  const usaPared = document.getElementById('pared-interactiva').style.display === 'block';
  
  let areaPared = 0, cajasPared = 0;
  if (usaPared) {
    const pAlto = parseFloat(document.getElementById('pared-alto').value) || 0;
    const pAncho = parseFloat(document.getElementById('pared-ancho').value) || 0;
    const pCaja = parseFloat(document.getElementById('pared-caja').value) || 1.44;
    areaPared = pAlto * pAncho;
    cajasPared = Math.ceil(areaPared / pCaja);
    
    document.getElementById('res-area-pared').textContent = areaPared.toFixed(2);
    document.getElementById('res-cajas-pared').textContent = cajasPared;
  }
  
  const piLargo = parseFloat(document.getElementById('piso-largo').value) || 0;
  const piAncho = parseFloat(document.getElementById('piso-ancho').value) || 0;
  const piCaja = parseFloat(document.getElementById('piso-caja').value) || 1.44;
  const pegoRendimiento = parseFloat(document.getElementById('tipo-pego').value) || 1.5;

  const areaPiso = piLargo * piAncho;
  const cajasPiso = Math.ceil(areaPiso / piCaja);

  const totalArea = areaPared + areaPiso;
  const sacosPego = Math.ceil(totalArea / pegoRendimiento);

  document.getElementById('res-area-piso').textContent = areaPiso.toFixed(2);
  document.getElementById('res-cajas-piso').textContent = cajasPiso;
  document.getElementById('res-total-pego').textContent = sacosPego;

  document.getElementById('resultado-calculo').style.display = 'block';
}
