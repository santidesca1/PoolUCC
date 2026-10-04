exigirSesion();

/**
 * Muestra los datos del usuario y calcula sus estadísticas.
 * @method mostrarPerfil
 */
function mostrarPerfil() {
  const usuario = obtenerUsuario();
  if (usuario === null) {
    return;
  }
  document.getElementById("iniciales").textContent = usuario.iniciales;
  document.getElementById("nombre").textContent = usuario.nombre;
  document.getElementById("carrera").textContent = usuario.carrera;
  document.getElementById("email").textContent = usuario.email;

  const reservas = obtenerReservas();
  let totalPagado = 0;
  reservas.forEach(r => {
    totalPagado = totalPagado + r.total;
  });

  const realizados = reservas.filter(r => r.realizado);
  const publicados = obtenerViajes().filter(v => v.mio);
  let lugares = 0;
  publicados.forEach(v => {
    lugares = lugares + v.plazas;
  });

  document.getElementById("cantidadReservas").textContent = reservas.length;
  document.getElementById("cantidadRealizados").textContent = realizados.length;
  document.getElementById("totalPagado").textContent = formatearPrecio(totalPagado);
  document.getElementById("cantidadPublicados").textContent = publicados.length;
  document.getElementById("lugaresOfrecidos").textContent = lugares;
}

/**
 * Muestra los datos de pasajero o los de conductor.
 * @method cambiarVista
 * @param {string} rol - "pasajero" o "conductor"
 */
function cambiarVista(rol) {
  const pasajero = document.getElementById("vistaPasajero");
  const conductor = document.getElementById("vistaConductor");
  if (rol === "conductor") {
    pasajero.style.display = "none";
    conductor.style.display = "flex";
  } else {
    pasajero.style.display = "flex";
    conductor.style.display = "none";
  }
}

/**
 * Cierra la sesión (los viajes y reservas quedan guardados).
 * @method cerrarSesion
 */
function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

/**
 * Borra todo lo guardado y deja la app como recién instalada.
 * Sirve para volver a mostrar la demo desde cero.
 * @method reiniciarDemo
 */
function reiniciarDemo() {
  confirmar("¿Reiniciar la demo?", "Se borran el usuario, los viajes publicados, las reservas y los chats.", "Sí, borrar todo", () => {
    const claves = ["usuario", "viajes", "reservas", "busqueda", "chats", "ubicacion"];
    for (const clave of claves) {
      localStorage.removeItem(clave);
    }
    window.location.href = "login.html";
  });
}

mostrarPerfil();
