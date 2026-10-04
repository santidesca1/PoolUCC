exigirSesion();

const viajes = obtenerViajes();
// Si se entra sin ?id=, se usa el viaje de ejemplo que tiene solicitudes
const idUrl = leerIdDeLaUrl();
const viaje = buscarViaje(viajes, isNaN(idUrl) ? 102 : idUrl);

/**
 * Cuenta cuántas solicitudes están marcadas como "Aceptar".
 * @method contarAceptadas
 * @return {number} Cantidad de pasajeros aceptados
 */
function contarAceptadas() {
  return document.querySelectorAll('input[value="aceptar"]:checked').length;
}

/**
 * Muestra cuántos lugares quedan libres según las solicitudes aceptadas.
 * @method actualizarLugares
 */
function actualizarLugares() {
  if (viaje === undefined) {
    return;
  }
  const quedan = viaje.plazas - contarAceptadas();
  document.getElementById("lugares").textContent = quedan;
  document.getElementById("error").textContent = quedan < 0 ? "Aceptaste más pasajeros que lugares libres." : "";
}

/**
 * Guarda las respuestas: descuenta los lugares y vuelve a Mis viajes.
 * @method confirmarSolicitudes
 * @return {boolean} false: la página cambia desde JavaScript
 */
function confirmarSolicitudes() {
  if (viaje === undefined) {
    window.location.href = "mis-viajes.html";
    return false;
  }
  const aceptadas = contarAceptadas();
  if (aceptadas > viaje.plazas) {
    return false;
  }
  viaje.plazas = viaje.plazas - aceptadas;
  viaje.solicitudes = 0;
  guardarViajes(viajes);

  const texto = aceptadas === 0
    ? "Rechazaste las solicitudes."
    : "Aceptaste " + aceptadas + (aceptadas === 1 ? " pasajero" : " pasajeros") + ". Les avisamos que tienen lugar.";
  avisar("Solicitudes respondidas", texto, () => {
    window.location.href = "mis-viajes.html";
  });
  return false;
}

if (viaje !== undefined) {
  document.getElementById("ruta").textContent = viaje.dia + " " + viaje.salida + " · a " + viaje.hasta;
  actualizarLugares();
}
