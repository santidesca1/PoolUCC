exigirSesion();

/**
 * Arma la tarjeta de un viaje publicado por el usuario.
 * @method tarjetaMiViaje
 * @param {Object} v - Viaje
 * @return {string} HTML de la tarjeta
 */
function tarjetaMiViaje(v) {
  let estado;
  if (v.solicitudes > 0) {
    estado = `<span class="etiqueta etiqueta-amarilla">${v.solicitudes} por confirmar</span>`;
  } else if (v.plazas === 0) {
    estado = `<span class="etiqueta etiqueta-verde">Confirmado</span>`;
  } else {
    estado = `<span class="etiqueta etiqueta-gris">Publicado</span>`;
  }

  const textoPlazas = v.plazas === 0 ? "Completo" : v.plazas + (v.plazas === 1 ? " plaza libre" : " plazas libres");
  const clasePlazas = v.plazas === 0 ? "viaje-conductor plazas plazas-completo" : "viaje-conductor plazas";
  const botonSolicitudes = v.solicitudes > 0
    ? `<a class="boton boton-oscuro boton-chico" href="solicitudes.html?id=${v.id}">Solicitudes</a>`
    : "";

  return `
    <article class="tarjeta">
      <div class="viaje-cabecera">
        <p class="viaje-conductor"><strong>${v.dia} · ${v.salida}</strong></p>
        ${estado}
      </div>
      <ul class="recorrido">
        <li><span>${v.desde}</span></li>
        <li><span>${v.hasta}</span></li>
      </ul>
      <p class="texto-suave">${formatearPrecio(v.precio)} por persona</p>
      <div class="viaje-cabecera">
        <p class="${clasePlazas}">${textoPlazas}</p>
        ${botonSolicitudes}
        <button class="boton boton-peligro boton-chico" type="button" onclick="eliminarViaje(${v.id})">Eliminar</button>
      </div>
    </article>`;
}

/**
 * Dibuja la lista de viajes publicados por el usuario.
 * @method mostrarMisViajes
 */
function mostrarMisViajes() {
  const mios = obtenerViajes().filter(v => v.mio);
  document.getElementById("pestanaProximos").textContent = "Próximos (" + mios.length + ")";

  if (mios.length === 0) {
    document.getElementById("lista").innerHTML = `
      <div class="tarjeta texto-centrado">
        <h2>Todavía no publicaste viajes</h2>
        <p class="texto-suave">Si vas a la facu en auto, compartí los lugares libres.</p>
        <a class="boton" href="publicar.html">Publicar mi primer viaje</a>
      </div>`;
    return;
  }

  let html = "";
  mios.forEach(v => {
    html += tarjetaMiViaje(v);
  });
  document.getElementById("lista").innerHTML = html;
}

/**
 * Borra un viaje publicado por el usuario (con confirmación).
 * @method eliminarViaje
 * @param {number} id - Id del viaje a borrar
 */
function eliminarViaje(id) {
  if (!confirm("¿Eliminar este viaje? Los pasajeros que reservaron van a recibir un aviso.")) {
    return;
  }
  const viajes = obtenerViajes();
  const posicion = viajes.findIndex(v => v.id === id);
  viajes.splice(posicion, 1);
  guardarViajes(viajes);
  mostrarMisViajes();
}

mostrarMisViajes();
