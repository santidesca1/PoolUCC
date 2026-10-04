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

  const publicados = obtenerViajes().filter(v => v.mio);

  document.getElementById("cantidadReservas").textContent = reservas.length;
  document.getElementById("cantidadPublicados").textContent = publicados.length;
  document.getElementById("totalPagado").textContent = formatearPrecio(totalPagado);
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
  if (!confirm("Se borran el usuario, los viajes publicados, las reservas y los chats. ¿Seguro?")) {
    return;
  }
  const claves = ["usuario", "viajes", "reservas", "busqueda", "chats"];
  for (const clave of claves) {
    localStorage.removeItem(clave);
  }
  window.location.href = "login.html";
}

mostrarPerfil();
