exigirSesion();

const usuario = obtenerUsuario();

/**
 * Muestra el saludo con el nombre del usuario y la fecha de hoy.
 * @method mostrarSaludo
 */
function mostrarSaludo() {
  if (usuario === null) {
    return;
  }
  const primerNombre = usuario.nombre.split(" ")[0];
  document.getElementById("saludo").textContent = "Hola, " + primerNombre;
  document.getElementById("avatar").textContent = usuario.iniciales;

  const hoy = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  // Primera letra en mayúscula: "martes, 24 de octubre" -> "Martes, 24 de octubre"
  document.getElementById("fecha").textContent = hoy[0].toUpperCase() + hoy.slice(1);
}

/**
 * Si el usuario tiene reservas sin hacer, muestra la última como "Tu próximo viaje".
 * @method mostrarProximoViaje
 */
function mostrarProximoViaje() {
  const reservas = obtenerReservas().filter(r => !r.realizado);
  if (reservas.length === 0) {
    return;
  }
  const ultima = reservas[reservas.length - 1];
  const viaje = buscarViaje(obtenerViajes(), ultima.idViaje);
  if (viaje === undefined) {
    return;
  }
  document.getElementById("proximo").innerHTML = `
    <a class="tarjeta tarjeta-enlace tarjeta-oscura" href="reservado.html?id=${viaje.id}">
      <p>Tu próximo viaje</p>
      <h2 class="cifra-blanca">${viaje.desde} → ${viaje.hasta}</h2>
      <p>${viaje.dia} · ${viaje.salida} · con ${viaje.conductor}</p>
    </a>`;
}

/**
 * Si el usuario ya había buscado, vuelve a completar el formulario.
 * Si salía desde su ubicación, centra el mapa ahí.
 * @method cargarUltimaBusqueda
 */
function cargarUltimaBusqueda() {
  const guardada = localStorage.getItem("busqueda");
  if (guardada === null) {
    return;
  }
  const busqueda = JSON.parse(guardada);
  document.getElementById("desde").value = busqueda.desde;
  document.getElementById("hasta").value = busqueda.hasta;

  const punto = coordenadasDeSalida(busqueda.desde);
  if (punto !== null) {
    document.getElementById("mapa").src = urlMapa(punto.lat, punto.lon);
  }
}

/**
 * Valida el formulario de búsqueda y la guarda para resultados.html.
 * @method buscar
 * @return {boolean} true si se puede buscar, false si hay un error
 */
function buscar() {
  const desde = document.getElementById("desde").value.trim();
  const hasta = document.getElementById("hasta").value.trim();
  const error = document.getElementById("error");

  if (desde.toLowerCase() === hasta.toLowerCase()) {
    error.textContent = "Ya estás en esa sede: elegí otra sede de llegada.";
    return false;
  }

  const busqueda = {
    desde: desde,
    hasta: hasta,
    plazas: parseInt(document.getElementById("plazas").value),
    filtro: document.querySelector('input[name="filtro"]:checked').value
  };
  localStorage.setItem("busqueda", JSON.stringify(busqueda));
  return true;
}

mostrarSaludo();
mostrarProximoViaje();
cargarUltimaBusqueda();
