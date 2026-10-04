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
 * Arma la tarjeta de un pasajero que solicitó un lugar.
 * @method tarjetaSolicitante
 * @param {Object} s - Solicitante (nombre, iniciales, puntaje, carrera, curso, plazas)
 * @param {number} indice - Posición en la lista, para darle un name único al grupo de radios
 * @return {string} HTML de la tarjeta
 */
function tarjetaSolicitante(s, indice){
  const nombreGrupo = "solicitante" + indice;
  return `
    <article class="tarjeta">
      <div class="viaje-cabecera">
        <span class="avatar">${s.iniciales}</span>
        <div class="viaje-conductor">
          <h2>${s.nombre}</h2>
          <p>★ ${formatearPuntaje(s.puntaje)} · ${s.carrera} · ${s.curso}</p>
        </div>
        <span class="etiqueta">${s.plazas === 1 ? "1 plaza" : s.plazas + " plazas"}</span>
      </div>
      <div class="opciones">
        <label><input type="radio" name="${nombreGrupo}" value="rechazar" required> Rechazar</label>
        <label><input type="radio" name="${nombreGrupo}" value="aceptar"> Aceptar</label>
      </div>
    </article>`;
}
/**
 * Dibuja la lista de solicitantes del viaje, o un aviso si no hay ninguno.
 * @method mostrarSolicitudes
 */
function mostrarSolicitudes() {
  const solicitantes = viaje.solicitantes || [];
  if (solicitantes.length === 0) {
    document.getElementById("listaSolicitudes").innerHTML = `
      <div class="tarjeta texto-centrado">
        <h2>No tenés solicitudes pendientes</h2>
      </div>`;
    return;
  }

  let html = "";
  solicitantes.forEach((s, indice) => {
    html += tarjetaSolicitante(s, indice);
  });
  document.getElementById("listaSolicitudes").innerHTML = html;
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

  alert(aceptadas === 0 ? "Rechazaste las solicitudes." : "Aceptaste " + aceptadas + (aceptadas === 1 ? " pasajero." : " pasajeros."));
  window.location.href = "mis-viajes.html";
  return false;
}

if (viaje !== undefined) {
  document.getElementById("ruta").textContent = viaje.desde + " → " + viaje.hasta + " · " + viaje.dia + " " + viaje.salida;
  mostrarSolicitudes();
  actualizarLugares();
}