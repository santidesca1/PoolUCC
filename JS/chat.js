exigirSesion();

const idUrl = leerIdDeLaUrl();
// Si se entra sin ?id=, se abre el chat con Marta (viaje 1)
const viaje = buscarViaje(obtenerViajes(), isNaN(idUrl) ? 1 : idUrl);

/**
 * Devuelve todos los chats guardados: un objeto con una lista de mensajes por viaje.
 * @method obtenerChats
 * @return {Object} Por ejemplo { "1": [ { texto: "Hola", enviado: true } ] }
 */
function obtenerChats() {
  const guardados = localStorage.getItem("chats");
  return guardados === null ? {} : JSON.parse(guardados);
}

/**
 * Devuelve los mensajes del chat de este viaje. Si no hay, arranca con un saludo.
 * @method obtenerMensajes
 * @return {Array} Mensajes { texto, enviado }
 */
function obtenerMensajes() {
  const chats = obtenerChats();
  if (chats[viaje.id] === undefined) {
    return [{ texto: "¡Hola! Salgo a las " + viaje.salida + " desde " + viaje.desde + ".", enviado: false }];
  }
  return chats[viaje.id];
}

/**
 * Guarda los mensajes de este viaje.
 * @method guardarMensajes
 * @param {Array} mensajes - Mensajes del chat
 */
function guardarMensajes(mensajes) {
  const chats = obtenerChats();
  chats[viaje.id] = mensajes;
  localStorage.setItem("chats", JSON.stringify(chats));
}

/**
 * Dibuja todos los mensajes del chat.
 * @method mostrarMensajes
 */
function mostrarMensajes() {
  let html = `<span class="etiqueta etiqueta-gris chat-dia">Hoy</span>`;
  obtenerMensajes().forEach(m => {
    const clase = m.enviado ? "mensaje mensaje-enviado" : "mensaje mensaje-recibido";
    html += `<p class="${clase}">${m.texto}</p>`;
  });
  const chat = document.getElementById("chat");
  chat.innerHTML = html;
  // Baja hasta el último mensaje (como en cualquier app de mensajes)
  chat.scrollTop = chat.scrollHeight;
}

/**
 * Agrega el mensaje que escribió el usuario y, 2 segundos después,
 * una respuesta automática del conductor.
 * @method enviarMensaje
 * @return {boolean} false, para que el formulario no recargue la página
 */
function enviarMensaje() {
  const campo = document.getElementById("mensaje");
  const texto = campo.value.trim();
  if (texto === "" || viaje === undefined) {
    return false;
  }

  const mensajes = obtenerMensajes();
  mensajes.push({ texto: limpiarTexto(texto), enviado: true });
  guardarMensajes(mensajes);
  mostrarMensajes();
  campo.value = "";

  setTimeout(() => {
    const actualizados = obtenerMensajes();
    actualizados.push({ texto: "¡Dale! Cualquier cosa avisame por acá.", enviado: false });
    guardarMensajes(actualizados);
    mostrarMensajes();
  }, 2000);

  return false;
}

if (viaje !== undefined) {
  document.getElementById("conductor").textContent = viaje.conductor;
  document.getElementById("iniciales").textContent = viaje.iniciales;
  document.getElementById("ruta").textContent = viaje.desde + " → " + viaje.hasta + " · " + viaje.salida;
  document.title = "Chat con " + viaje.conductor + " - PoolUCC";

  // "Volver" lleva a la reserva si existe; si no, al detalle del viaje
  const reservado = obtenerReservas().find(r => r.idViaje === viaje.id);
  document.getElementById("volver").href = reservado !== undefined ? "reservado.html?id=" + viaje.id : "viaje.html?id=" + viaje.id;

  mostrarMensajes();
}
