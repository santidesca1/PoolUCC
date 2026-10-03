exigirSesion();

const viajes = obtenerViajes();
const viaje = buscarViaje(viajes, leerIdDeLaUrl());

/**
 * Completa la página con los datos del viaje elegido.
 * @method mostrarDetalle
 */
function mostrarDetalle() {
  if (viaje === undefined) {
    document.getElementById("detalle").innerHTML = `
      <div class="tarjeta texto-centrado">
        <h2>No encontramos este viaje</h2>
        <p class="texto-suave">Puede que el conductor lo haya cancelado.</p>
        <a class="boton" href="resultados.html">Ver otros viajes</a>
      </div>`;
    document.getElementById("mapa").textContent = "Mapa";
    return;
  }

  document.getElementById("mapa").textContent = "Mapa · " + viaje.desde + " → " + viaje.hasta;
  document.getElementById("titulo").textContent = viaje.salida + " · " + viaje.hasta;
  document.getElementById("precio").textContent = formatearPrecio(viaje.precio);
  document.getElementById("desde").textContent = viaje.desde;
  document.getElementById("salida").textContent = viaje.salida;
  document.getElementById("hasta").textContent = viaje.hasta;
  document.getElementById("llegada").textContent = viaje.llegada;
  document.getElementById("dia").textContent = viaje.dia;
  document.getElementById("iniciales").textContent = viaje.iniciales;
  document.getElementById("conductor").textContent = viaje.conductor;
  document.getElementById("puntaje").textContent = "★ " + formatearPuntaje(viaje.puntaje) + " · " + viaje.carrera;

  const primerNombre = viaje.conductor.split(" ")[0];
  const linkChat = document.getElementById("linkChat");
  linkChat.textContent = "Escribirle a " + primerNombre;
  linkChat.href = "chat.html?id=" + viaje.id;

  let etiquetas = `<li class="etiqueta etiqueta-verde">✓ Verificado</li>`;
  etiquetas += `<li class="etiqueta etiqueta-gris">${viaje.auto}</li>`;
  if (viaje.etiqueta !== "") {
    etiquetas += `<li class="etiqueta">${viaje.etiqueta}</li>`;
  }
  document.getElementById("etiquetas").innerHTML = etiquetas;

  let preferencias = "";
  viaje.preferencias.forEach(p => {
    preferencias += `<li class="etiqueta etiqueta-gris">${p}</li>`;
  });
  document.getElementById("preferencias").innerHTML = preferencias;

  // Una opción por cada plaza libre (si hay 3: 1, 2 o 3)
  let opciones = "";
  for (let i = 1; i <= viaje.plazas; i++) {
    opciones += `<option value="${i}">${i}</option>`;
  }
  document.getElementById("cantidad").innerHTML = opciones;

  revisarSiSePuedeReservar();
  calcularTotal();
}

/**
 * Desactiva el botón si el viaje está completo, es del usuario o ya lo reservó.
 * @method revisarSiSePuedeReservar
 */
function revisarSiSePuedeReservar() {
  const boton = document.getElementById("botonReservar");
  const error = document.getElementById("error");
  const yaReservado = obtenerReservas().find(r => r.idViaje === viaje.id);

  if (viaje.plazas === 0) {
    document.getElementById("plazasLibres").textContent = "Este viaje está completo.";
  } else {
    document.getElementById("plazasLibres").textContent =
      viaje.plazas + (viaje.plazas === 1 ? " plaza libre" : " plazas libres") + " · Efectivo o transferencia";
  }

  if (yaReservado !== undefined) {
    error.innerHTML = `Ya reservaste este viaje. <a class="volver" href="reservado.html?id=${viaje.id}">Ver mi reserva</a>`;
    boton.disabled = true;
  } else if (viaje.mio) {
    error.textContent = "Este viaje lo publicaste vos.";
    boton.disabled = true;
  } else if (viaje.plazas === 0) {
    boton.disabled = true;
  }
}

/**
 * Muestra el total a pagar: precio por plaza × cantidad de plazas.
 * @method calcularTotal
 */
function calcularTotal() {
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const total = isNaN(cantidad) ? viaje.precio : viaje.precio * cantidad;
  document.getElementById("total").textContent = formatearPrecio(total);
}

/**
 * Guarda la reserva, descuenta las plazas del viaje y va a la confirmación.
 * @method reservar
 */
function reservar() {
  const cantidad = parseInt(document.getElementById("cantidad").value);

  const reservas = obtenerReservas();
  reservas.push({
    idViaje: viaje.id,
    plazas: cantidad,
    total: viaje.precio * cantidad
  });
  guardarReservas(reservas);

  viaje.plazas = viaje.plazas - cantidad;
  guardarViajes(viajes);

  window.location.href = "reservado.html?id=" + viaje.id;
}

mostrarDetalle();
