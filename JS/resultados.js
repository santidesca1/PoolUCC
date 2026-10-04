exigirSesion();

const lista = document.getElementById("lista");
const contador = document.getElementById("contador");

// Lo que el usuario buscó en index.html (puede no existir si entró directo)
const guardada = localStorage.getItem("busqueda");
const busqueda = guardada === null ? null : JSON.parse(guardada);
const plazasBuscadas = busqueda === null ? 1 : busqueda.plazas;

// Desde dónde sale el usuario (su ubicación o un lugar conocido); null si no se sabe
const origen = busqueda === null ? null : coordenadasDeSalida(busqueda.desde);

/**
 * Km entre la salida del usuario y la salida del viaje.
 * Si alguna de las dos no se conoce, devuelve Infinity (queda al final al ordenar).
 * @method distanciaDe
 * @param {Object} v - Viaje
 * @return {number} Distancia en km
 */
function distanciaDe(v) {
  if (origen === null || v.lat === null) {
    return Infinity;
  }
  return distanciaKm(origen, v);
}

/**
 * Completa los filtros con lo que el usuario buscó en el inicio.
 * @method cargarBusqueda
 */
function cargarBusqueda() {
  // Sin un punto de salida conocido no se puede ordenar por cercanía
  if (origen === null) {
    const opcion = document.getElementById("opcionCercania");
    opcion.disabled = true;
    opcion.textContent = "Más cerca de mí (indicá desde dónde salís)";
    document.getElementById("orden").value = "horario";
  }

  if (busqueda === null) {
    return;
  }
  document.getElementById("resumen").textContent =
    busqueda.desde + " → " + busqueda.hasta + " · " + busqueda.plazas + (busqueda.plazas === 1 ? " plaza" : " plazas");
  document.getElementById("filtroSede").value = busqueda.hasta;
  document.getElementById("tipo").value = busqueda.filtro;
  document.getElementById("soloConLugares").checked = true;
  document.getElementById("textoLugares").textContent = "Solo con " + busqueda.plazas + (busqueda.plazas === 1 ? " lugar libre" : " lugares libres");
}

/**
 * Dice si un viaje corresponde al tipo elegido en "Mostrar".
 * @method cumpleTipo
 * @param {Object} v - Viaje
 * @param {string} tipo - Todos, Hoy, Mañana, Mi grado o Recurrentes
 * @return {boolean} true si el viaje se muestra
 */
function cumpleTipo(v, tipo) {
  switch (tipo) {
    case "Hoy":
      return v.dia === "Hoy";
    case "Mañana":
      return v.dia === "Mañana";
    case "Mi grado":
      return v.etiqueta === "Mismo grado";
    case "Recurrentes":
      return v.etiqueta === "Recurrente";
    default:
      return true;
  }
}

/**
 * Filtra y ordena los viajes según los filtros, y los dibuja en la lista.
 * @method mostrarViajes
 */
function mostrarViajes() {
  const sede = document.getElementById("filtroSede").value;
  const precioMaximo = parseFloat(document.getElementById("precioMaximo").value);
  const tipo = document.getElementById("tipo").value;
  const orden = document.getElementById("orden").value;
  const soloConLugares = document.getElementById("soloConLugares").checked;

  // Los viajes que publicó el usuario no aparecen: no puede reservar su propio viaje
  let resultado = obtenerViajes().filter(v => !v.mio);

  if (sede !== "Todas") {
    resultado = resultado.filter(v => v.hasta === sede);
  }
  if (!isNaN(precioMaximo)) {
    resultado = resultado.filter(v => v.precio <= precioMaximo);
  }
  resultado = resultado.filter(v => cumpleTipo(v, tipo));
  if (soloConLugares) {
    resultado = resultado.filter(v => v.plazas >= plazasBuscadas);
  }

  if (orden === "cercania") {
    resultado.sort((a, b) => distanciaDe(a) - distanciaDe(b));
  } else if (orden === "precioMenor") {
    resultado.sort((a, b) => a.precio - b.precio);
  } else if (orden === "precioMayor") {
    resultado.sort((a, b) => b.precio - a.precio);
  } else if (orden === "puntaje") {
    resultado.sort((a, b) => b.puntaje - a.puntaje);
  } else {
    resultado.sort((a, b) => a.salida < b.salida ? -1 : 1);
  }

  if (resultado.length === 0) {
    contador.textContent = "Sin resultados";
    lista.innerHTML = `
      <div class="tarjeta texto-centrado">
        <h2>No encontramos viajes</h2>
        <p class="texto-suave">Probá con otra sede, otro día o sacá algún filtro.</p>
      </div>`;
    return;
  }

  let html = "";
  for (let i = 0; i < resultado.length; i++) {
    html += tarjetaViaje(resultado[i], distanciaDe(resultado[i]));
  }
  lista.innerHTML = html;
  contador.textContent = resultado.length + (resultado.length === 1 ? " viaje" : " viajes");
}

cargarBusqueda();
mostrarViajes();
