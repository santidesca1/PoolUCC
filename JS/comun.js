// Funciones que usan todas las páginas.
// No tenemos base de datos: guardamos todo en localStorage como texto JSON.

/**
 * Devuelve la lista de viajes. La primera vez copia los de datos.js.
 * @method obtenerViajes
 * @return {Array} Lista de viajes
 */
function obtenerViajes() {
  const guardados = localStorage.getItem("viajes");
  if (guardados === null) {
    guardarViajes(viajesIniciales);
    return viajesIniciales;
  }
  return JSON.parse(guardados);
}

/**
 * Guarda la lista de viajes en localStorage.
 * @method guardarViajes
 * @param {Array} lista - Viajes a guardar
 */
function guardarViajes(lista) {
  localStorage.setItem("viajes", JSON.stringify(lista));
}

/**
 * Busca un viaje por su id.
 * @method buscarViaje
 * @param {Array} lista - Viajes donde buscar
 * @param {number} id - Id del viaje
 * @return {Object} El viaje, o undefined si no existe
 */
function buscarViaje(lista, id) {
  return lista.find(v => v.id === id);
}

/**
 * Devuelve las reservas hechas por el usuario.
 * @method obtenerReservas
 * @return {Array} Lista de reservas { idViaje, plazas, total }
 */
function obtenerReservas() {
  const guardadas = localStorage.getItem("reservas");
  return guardadas === null ? [] : JSON.parse(guardadas);
}

/**
 * Guarda las reservas en localStorage.
 * @method guardarReservas
 * @param {Array} lista - Reservas a guardar
 */
function guardarReservas(lista) {
  localStorage.setItem("reservas", JSON.stringify(lista));
}

/**
 * Devuelve el usuario que inició sesión, o null si no hay ninguno.
 * @method obtenerUsuario
 * @return {Object} Usuario { nombre, email, carrera, iniciales }
 */
function obtenerUsuario() {
  const guardado = localStorage.getItem("usuario");
  return guardado === null ? null : JSON.parse(guardado);
}

/**
 * Si no hay sesión iniciada, manda al usuario a login.html.
 * @method exigirSesion
 */
function exigirSesion() {
  if (obtenerUsuario() === null) {
    window.location.href = "login.html";
  }
}

/**
 * Da formato de pesos argentinos a un número: 2500 -> "$2.500".
 * @method formatearPrecio
 * @param {number} numero - Precio sin formato
 * @return {string} Precio con formato
 */
function formatearPrecio(numero) {
  return "$" + new Intl.NumberFormat("es-AR").format(numero);
}

/**
 * Muestra el puntaje con coma decimal: 4.9 -> "4,9". Si es 0, el
 * conductor todavía no tiene calificaciones.
 * @method formatearPuntaje
 * @param {number} puntaje - Puntaje de 0 a 5
 * @return {string} Puntaje con formato
 */
function formatearPuntaje(puntaje) {
  return puntaje === 0 ? "Nuevo" : puntaje.toFixed(1).replace(".", ",");
}

/**
 * Lee el id que viene en la dirección (por ejemplo viaje.html?id=3).
 * @method leerIdDeLaUrl
 * @return {number} El id, o NaN si no hay
 */
function leerIdDeLaUrl() {
  const partes = window.location.search.split("id=");
  return parseInt(partes[1]);
}

/**
 * Reemplaza < y > para que un texto escrito por el usuario no se
 * interprete como HTML al mostrarlo con innerHTML.
 * @method limpiarTexto
 * @param {string} texto - Texto escrito por el usuario
 * @return {string} Texto seguro para mostrar
 */
function limpiarTexto(texto) {
  return texto.split("<").join("&lt;").split(">").join("&gt;");
}

/**
 * Arma el HTML de una tarjeta de viaje (se usa en resultados y en el inicio).
 * Si el viaje está completo no es un link, porque no se puede reservar.
 * @method tarjetaViaje
 * @param {Object} v - Viaje
 * @return {string} HTML de la tarjeta
 */
function tarjetaViaje(v) {
  const completo = v.plazas === 0;
  const clasePlazas = completo ? "plazas plazas-completo" : "plazas";
  const textoPlazas = completo ? "Completo" : v.plazas + (v.plazas === 1 ? " plaza libre" : " plazas libres");
  const etiqueta = v.etiqueta ? ` <span class="etiqueta">${v.etiqueta}</span>` : "";

  const interior = `
    <div class="viaje-cabecera">
      <span class="avatar">${v.iniciales}</span>
      <div class="viaje-conductor">
        <h2>${v.conductor}</h2>
        <p>★ ${formatearPuntaje(v.puntaje)}${etiqueta}</p>
      </div>
      <p class="precio">${formatearPrecio(v.precio)}</p>
    </div>
    <ul class="recorrido">
      <li><span>${v.desde}</span> <time datetime="${v.salida}">${v.salida}</time></li>
      <li><span>${v.hasta}</span> <time datetime="${v.llegada}">${v.llegada}</time></li>
    </ul>
    <p class="${clasePlazas}">${v.dia} · ${textoPlazas}</p>`;

  if (completo) {
    return `<article class="tarjeta tarjeta-completa">${interior}</article>`;
  }
  return `<article><a class="tarjeta tarjeta-enlace" href="viaje.html?id=${v.id}">${interior}</a></article>`;
}
