exigirSesion();

const lista = document.getElementById("lista");
const contador = document.getElementById("contador");

// Lo que el usuario buscó en index.html (puede no existir si entró directo)
const guardada = localStorage.getItem("busqueda");
const busqueda = guardada === null ? null : JSON.parse(guardada);
const plazasBuscadas = busqueda === null ? 1 : busqueda.plazas;

/**
 * Completa los filtros con lo que el usuario buscó en el inicio.
 * @method cargarBusqueda
 */
function cargarBusqueda() {
  if (busqueda === null) {
    return;
  }
  document.getElementById("resumen").textContent =
    busqueda.desde + " → " + busqueda.hasta + " · " + busqueda.plazas + (busqueda.plazas === 1 ? " plaza" : " plazas");
  document.getElementById("filtroTexto").value = busqueda.hasta;
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
  const texto = document.getElementById("filtroTexto").value.trim().toLowerCase();
  const precioMaximo = parseFloat(document.getElementById("precioMaximo").value);
  const tipo = document.getElementById("tipo").value;
  const orden = document.getElementById("orden").value;
  const soloConLugares = document.getElementById("soloConLugares").checked;

  // Los viajes que publicó el usuario no aparecen: no puede reservar su propio viaje
  let resultado = obtenerViajes().filter(v => !v.mio);

  resultado = resultado.filter(v => v.hasta.toLowerCase().indexOf(texto) !== -1);
  if (!isNaN(precioMaximo)) {
    resultado = resultado.filter(v => v.precio <= precioMaximo);
  }
  resultado = resultado.filter(v => cumpleTipo(v, tipo));
  if (soloConLugares) {
    resultado = resultado.filter(v => v.plazas >= plazasBuscadas);
  }

  if (orden === "precioMenor") {
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
        <p class="texto-suave">Probá con otro destino, otro día o sacá algún filtro.</p>
      </div>`;
    return;
  }

  let html = "";
  for (let i = 0; i < resultado.length; i++) {
    html += tarjetaViaje(resultado[i]);
  }
  lista.innerHTML = html;
  contador.textContent = resultado.length + (resultado.length === 1 ? " viaje" : " viajes");
}

cargarBusqueda();
mostrarViajes();
