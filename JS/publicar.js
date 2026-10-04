exigirSesion();

/**
 * Muestra la fecha (viaje de un día) o el día de la semana (viaje semanal).
 * @method cambiarModo
 * @param {string} modo - "dia" o "semana"
 */
function cambiarModo(modo) {
  if (modo === "dia") {
    document.getElementById("campoFecha").style.display = "flex";
    document.getElementById("campoDia").style.display = "none";
  } else {
    document.getElementById("campoFecha").style.display = "none";
    document.getElementById("campoDia").style.display = "flex";
  }
}

/**
 * Devuelve el valor del radio elegido de un grupo.
 * @method valorElegido
 * @param {string} nombre - Atributo name del grupo de radios
 * @return {string} Valor del radio marcado
 */
function valorElegido(nombre) {
  return document.querySelector('input[name="' + nombre + '"]:checked').value;
}

/**
 * Valida el formulario y guarda el viaje nuevo.
 * @method publicar
 * @return {boolean} false siempre: la página cambia desde JavaScript
 */
function publicar() {
  const usuario = obtenerUsuario();
  const desde = document.getElementById("desde").value.trim();
  const hasta = document.getElementById("hasta").value.trim();
  const modo = valorElegido("modo");
  const fecha = document.getElementById("fecha").value;
  const diaSemana = document.getElementById("dia").value;
  const hora = document.getElementById("hora").value;
  const plazas = parseInt(valorElegido("plazas"));
  const cobro = valorElegido("cobro");
  let precio = parseFloat(document.getElementById("precio").value);
  const error = document.getElementById("error");

  if (desde.toLowerCase() === hasta.toLowerCase()) {
    error.textContent = "La salida y la llegada no pueden ser la misma sede.";
    return false;
  }
  if (isNaN(precio) || precio <= 0) {
    error.textContent = "Poné un precio mayor a $0.";
    return false;
  }
  if (precio > 50000) {
    error.textContent = "El precio es solo para cubrir gastos: máximo $50.000.";
    return false;
  }
  if (modo === "dia" && fecha === "") {
    error.textContent = "Elegí la fecha del viaje.";
    return false;
  }

  // Si cobra "por viaje", lo dividimos entre las plazas para mostrar el precio por persona
  if (cobro === "viaje") {
    precio = Math.round(precio / plazas);
  }

  // "2026-10-30" -> "30/10"
  let dia;
  if (modo === "dia") {
    const partes = fecha.split("-");
    dia = partes[2] + "/" + partes[1];
  } else {
    dia = "Cada " + diaSemana.toLowerCase();
  }

  const preferencias = [];
  if (document.querySelector('input[name="sinFumar"]').checked) {
    preferencias.push("Sin fumar");
  }

  // Coordenadas de la salida: la ubicación del usuario o un lugar conocido.
  // Si escribió algo que no conocemos (una calle), quedan en null.
  const punto = coordenadasDeSalida(desde);
  // Para los pasajeros, "Mi ubicación actual" no tendría sentido: lo nombramos distinto
  const textoSalida = desde === MI_UBICACION ? "Ubicación del conductor" : limpiarTexto(desde);

  // El id nuevo es el más grande que exista + 1
  const viajes = obtenerViajes();
  let idMaximo = 0;
  viajes.forEach(v => {
    if (v.id > idMaximo) {
      idMaximo = v.id;
    }
  });

  viajes.push({
    id: idMaximo + 1,
    conductor: usuario.nombre,
    iniciales: usuario.iniciales,
    carrera: usuario.carrera,
    auto: "Auto a confirmar",
    puntaje: 0,
    etiqueta: "",
    precio: precio,
    desde: textoSalida,
    hasta: hasta,
    lat: punto === null ? null : punto.lat,
    lon: punto === null ? null : punto.lon,
    dia: dia,
    salida: hora,
    llegada: "",
    plazas: plazas,
    preferencias: preferencias,
    mio: true,
    solicitudes: 0
  });
  guardarViajes(viajes);

  avisar("¡Viaje publicado!", "Tus compañeros ya lo pueden ver y reservar.", () => {
    window.location.href = "mis-viajes.html";
  });
  return false;
}

cambiarModo(valorElegido("modo"));
