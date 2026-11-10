// Funciones que usan todas las páginas.
// No tenemos base de datos: guardamos todo en localStorage como texto JSON.

// Si cambiamos los datos de ejemplo (datos.js), subimos este número para que
// los navegadores que ya tenían datos viejos guardados los vuelvan a cargar.
const VERSION_DATOS = "3";
if (localStorage.getItem("versionDatos") !== VERSION_DATOS) {
  localStorage.removeItem("viajes");
  localStorage.removeItem("reservas");
  localStorage.removeItem("busqueda");
  localStorage.removeItem("chats");
  localStorage.setItem("versionDatos", VERSION_DATOS);
}

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
 * Busca las coordenadas de un lugar conocido (sede o barrio) por su nombre.
 * @method buscarLugar
 * @param {string} nombre - Nombre escrito por el usuario
 * @return {Object} El lugar { nombre, lat, lon }, o undefined si no lo conocemos
 */
function buscarLugar(nombre) {
  const buscado = nombre.trim().toLowerCase();
  return lugares.find(l => l.nombre.toLowerCase() === buscado);
}

/**
 * Devuelve las coordenadas desde donde sale el usuario: su ubicación actual
 * (si la compartió) o el lugar conocido que escribió.
 * @method coordenadasDeSalida
 * @param {string} desde - Lo que dice el campo "Desde"
 * @return {Object} { lat, lon }, o null si no se sabe
 */
function coordenadasDeSalida(desde) {
  if (desde === MI_UBICACION) {
    const guardada = localStorage.getItem("ubicacion");
    return guardada === null ? null : JSON.parse(guardada);
  }
  const lugar = buscarLugar(desde);
  return lugar === undefined ? null : { lat: lugar.lat, lon: lugar.lon };
}

/**
 * Distancia aproximada en kilómetros entre dos puntos.
 * Para distancias cortas (una ciudad) alcanza con tratar el mapa como plano:
 * un grado de latitud son unos 111 km y uno de longitud, 111 km × cos(latitud).
 * @method distanciaKm
 * @param {Object} a - Punto { lat, lon }
 * @param {Object} b - Punto { lat, lon }
 * @return {number} Distancia en km
 */
function distanciaKm(a, b) {
  const x = (b.lon - a.lon) * 111 * Math.cos(a.lat * Math.PI / 180);
  const y = (b.lat - a.lat) * 111;
  return Math.sqrt(x * x + y * y);
}

/**
 * Arma la dirección de un mapa de OpenStreetMap centrado en un punto, con marcador.
 * @method urlMapa
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @return {string} Dirección para el src del iframe
 */
function urlMapa(lat, lon) {
  // toFixed(4) para que no queden números como -31.418499999999998
  const caja = (lon - 0.015).toFixed(4) + "," + (lat - 0.01).toFixed(4) + "," +
               (lon + 0.015).toFixed(4) + "," + (lat + 0.01).toFixed(4);
  return "https://www.openstreetmap.org/export/embed.html?bbox=" + caja + "&layer=mapnik&marker=" + lat + "," + lon;
}

/**
 * Pide al navegador la ubicación del usuario (el navegador le pregunta si da permiso).
 * Si la obtiene: la guarda, completa el campo "desde" y centra el mapa (si hay).
 * @method usarMiUbicacion
 */
function usarMiUbicacion() {
  const estado = document.getElementById("estadoUbicacion");
  if (!navigator.geolocation) {
    estado.textContent = "Tu navegador no permite compartir la ubicación.";
    return;
  }
  estado.textContent = "Buscando tu ubicación...";

  // getCurrentPosition recibe dos callbacks: uno si sale bien y otro si falla
  navigator.geolocation.getCurrentPosition(
    posicion => {
      const ubicacion = {
        lat: posicion.coords.latitude,
        lon: posicion.coords.longitude
      };
      localStorage.setItem("ubicacion", JSON.stringify(ubicacion));
      document.getElementById("desde").value = MI_UBICACION;
      estado.textContent = "Listo: salís desde donde estás ahora.";

      const mapa = document.getElementById("mapa");
      if (mapa !== null) {
        mapa.src = urlMapa(ubicacion.lat, ubicacion.lon);
      }
    },
    () => {
      estado.textContent = "No pudimos obtener tu ubicación. Revisá que hayas dado permiso, o escribí desde dónde salís.";
    }
  );
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
 * @param {number} distancia - Km desde la salida del usuario (opcional)
 * @return {string} HTML de la tarjeta
 */
function tarjetaViaje(v, distancia) {
  const completo = v.plazas === 0;
  // Si sabemos desde dónde sale el usuario, mostramos qué tan lejos queda la salida
  let textoDistancia = "";
  if (distancia !== undefined && distancia !== Infinity) {
    textoDistancia = distancia < 0.3
      ? " · sale de tu zona"
      : ` · a ${distancia.toFixed(1).replace(".", ",")} km de vos`;
  }
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
    <p class="${clasePlazas}">${v.dia} · ${textoPlazas}${textoDistancia}</p>`;

  if (completo) {
    return `<article class="tarjeta tarjeta-completa">${interior}</article>`;
  }
  return `<article><a class="tarjeta tarjeta-enlace" href="viaje.html?id=${v.id}">${interior}</a></article>`;
}

/* ---------- Ventana de aviso / confirmación ----------
   Cada página que la usa tiene en su HTML un <dialog id="dialogo">.
   Reemplaza a alert() y confirm(), que se ven distintos en cada navegador. */

let accionDelDialogo = null;   // función a ejecutar según lo que elija el usuario
let dialogoEsAviso = false;    // un aviso ejecuta la acción al cerrarse de cualquier forma

/**
 * Completa y abre la ventana.
 * @method abrirDialogo
 * @param {string} titulo - Título de la ventana
 * @param {string} texto - Mensaje
 * @param {string} textoBoton - Texto del botón principal
 * @param {boolean} esAviso - true: un solo botón; false: también "Cancelar"
 * @param {Function} accion - Qué hacer después (puede no haber)
 */
function abrirDialogo(titulo, texto, textoBoton, esAviso, accion) {
  document.getElementById("dialogoTitulo").textContent = titulo;
  document.getElementById("dialogoTexto").textContent = texto;

  const aceptar = document.getElementById("dialogoAceptar");
  aceptar.textContent = textoBoton;
  // Si se confirma algo que borra datos, el botón va en rojo
  aceptar.className = esAviso ? "boton boton-chico" : "boton boton-peligro boton-chico";
  document.getElementById("dialogoCancelar").style.display = esAviso ? "none" : "inline-block";

  accionDelDialogo = accion;
  dialogoEsAviso = esAviso;
  document.getElementById("dialogo").showModal();
}

/**
 * Muestra un aviso con un solo botón. Al cerrarlo se ejecuta "despues".
 * @method avisar
 * @param {string} titulo - Título
 * @param {string} texto - Mensaje
 * @param {Function} despues - Qué hacer al cerrar (opcional)
 */
function avisar(titulo, texto, despues) {
  abrirDialogo(titulo, texto, "Entendido", true, despues);
}

/**
 * Pide confirmación antes de algo que no se puede deshacer.
 * @method confirmar
 * @param {string} titulo - Título
 * @param {string} texto - Mensaje
 * @param {string} textoBoton - Texto del botón que confirma (ej: "Sí, cancelar")
 * @param {Function} siAcepta - Qué hacer si el usuario confirma
 */
function confirmar(titulo, texto, textoBoton, siAcepta) {
  abrirDialogo(titulo, texto, textoBoton, false, siAcepta);
}

/**
 * Se llama desde los botones del diálogo.
 * @method cerrarDialogo
 * @param {boolean} acepto - true si tocó el botón principal
 */
function cerrarDialogo(acepto) {
  const accion = accionDelDialogo;
  accionDelDialogo = null;   // así no se ejecuta dos veces
  document.getElementById("dialogo").close();
  if (accion && (dialogoEsAviso || acepto)) {
    accion();
  }
}

/**
 * Evento onclose del diálogo. Sirve para cuando el usuario cierra un aviso
 * con la tecla Esc en vez de tocar el botón: igual hay que seguir.
 * @method alCerrarDialogo
 */
function alCerrarDialogo() {
  // Si ya se abrió otro aviso (por ejemplo, después de confirmar), este cierre es viejo
  if (document.getElementById("dialogo").open) {
    return;
  }
  const accion = accionDelDialogo;
  accionDelDialogo = null;
  if (accion && dialogoEsAviso) {
    accion();
  }
}

/**
 * Pone las iniciales y el nombre del usuario en la barra de navegación (escritorio).
 * @method mostrarUsuarioEnMenu
 */
function mostrarUsuarioEnMenu() {
  const usuario = obtenerUsuario();
  const iniciales = document.getElementById("menuIniciales");
  if (usuario === null || iniciales === null) {
    return;
  }
  iniciales.textContent = usuario.iniciales;
  document.getElementById("menuNombre").textContent = usuario.nombre.split(" ")[0];
}

mostrarUsuarioEnMenu();
