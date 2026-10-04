exigirSesion();

const viajes = obtenerViajes();
const reservas = obtenerReservas();
const id = leerIdDeLaUrl();
const viaje = buscarViaje(viajes, id);
const reserva = reservas.find(r => r.idViaje === id);

/**
 * Muestra los datos de la reserva, o un aviso si no existe.
 * @method mostrarReserva
 */
function mostrarReserva() {
  if (viaje === undefined || reserva === undefined) {
    document.querySelector(".marca-exito").textContent = "!";
    document.querySelector("h1").textContent = "No hay reserva";
    document.getElementById("ruta").textContent = "No encontramos una reserva para este viaje.";
    document.getElementById("contenido").innerHTML = `<a class="boton" href="index.html">Buscar un viaje</a>`;
    return;
  }

  document.getElementById("ruta").textContent = viaje.desde + " → " + viaje.hasta + " · " + viaje.dia + " " + viaje.salida;
  document.getElementById("iniciales").textContent = viaje.iniciales;
  document.getElementById("conductor").textContent = viaje.conductor;
  document.getElementById("auto").textContent = viaje.auto;
  document.getElementById("total").textContent = formatearPrecio(reserva.total);
  document.getElementById("plazas").textContent = reserva.plazas + (reserva.plazas === 1 ? " plaza" : " plazas");
  document.getElementById("linkChat").href = "chat.html?id=" + viaje.id;
  document.getElementById("linkCalificar").href = "calificar.html?id=" + viaje.id;

  // Un viaje que ya se hizo (y se calificó) no se puede cancelar
  if (reserva.realizado) {
    document.querySelector("h1").textContent = "Viaje realizado";
    document.getElementById("linkCalificar").style.display = "none";
    document.getElementById("botonCancelar").style.display = "none";
  }
}

/**
 * Cancela la reserva: la borra y le devuelve las plazas al viaje.
 * @method cancelarReserva
 */
function cancelarReserva() {
  if (!confirm("¿Seguro que querés cancelar la reserva?")) {
    return;
  }
  const posicion = reservas.indexOf(reserva);
  reservas.splice(posicion, 1);
  guardarReservas(reservas);

  viaje.plazas = viaje.plazas + reserva.plazas;
  guardarViajes(viajes);

  alert("Reserva cancelada. Le avisamos a " + viaje.conductor + ".");
  window.location.href = "index.html";
}

mostrarReserva();
