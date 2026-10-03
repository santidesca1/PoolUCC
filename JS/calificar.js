exigirSesion();

const viajes = obtenerViajes();
const reservas = obtenerReservas();
const id = leerIdDeLaUrl();
const viaje = buscarViaje(viajes, id);
const reserva = reservas.find(r => r.idViaje === id);

/**
 * Muestra a quién se califica. Si no hay reserva o ya se calificó, no deja enviar.
 * @method prepararPagina
 */
function prepararPagina() {
  const boton = document.getElementById("botonEnviar");
  const error = document.getElementById("error");

  if (viaje === undefined || reserva === undefined) {
    error.textContent = "Solo podés calificar viajes que reservaste.";
    boton.disabled = true;
    return;
  }

  document.getElementById("iniciales").textContent = viaje.iniciales;
  document.getElementById("ruta").textContent = viaje.desde + " → " + viaje.hasta;
  document.getElementById("conductor").textContent = "Viaje con " + viaje.conductor;
  document.getElementById("volver").href = "reservado.html?id=" + viaje.id;
  document.getElementById("volverAbajo").href = "reservado.html?id=" + viaje.id;

  if (reserva.calificacion !== undefined) {
    error.textContent = "Ya calificaste este viaje con " + reserva.calificacion + " estrellas.";
    boton.disabled = true;
  }
}

/**
 * Guarda la calificación en la reserva y actualiza el puntaje del conductor.
 * @method calificar
 * @return {boolean} false: la página cambia desde JavaScript
 */
function calificar() {
  const puntaje = parseInt(document.querySelector('input[name="puntaje"]:checked').value);
  const comentario = document.getElementById("comentario").value.trim();

  reserva.calificacion = puntaje;
  reserva.comentario = limpiarTexto(comentario);
  reserva.realizado = true;
  guardarReservas(reservas);

  // Simplificado: como no guardamos todas las calificaciones, hacemos de cuenta
  // que el conductor ya tenía 10 y promediamos (un decimal). Si era nuevo, queda la nueva.
  if (viaje.puntaje === 0) {
    viaje.puntaje = puntaje;
  } else {
    viaje.puntaje = Math.round((viaje.puntaje * 10 + puntaje) / 11 * 10) / 10;
  }
  guardarViajes(viajes);

  alert("¡Gracias! Tu calificación ayuda a que todos viajen mejor.");
  window.location.href = "index.html";
  return false;
}

prepararPagina();
