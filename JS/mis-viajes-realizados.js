exigirSesion();

/**
 * Arma la tarjeta de un viaje realizado por el usuario como conductor.
 * @method tarjetaViajeRealizado
 * @param {Object} v - Viaje
 * @return {string} HTML de la tarjeta
 */
function tarjetaViajeRealizado(v) {
  // ojo el espacio antes de "plaza"/"plazas", si no queda pegado al número
  const textoPlazas = v.plazas === 0 ? "Completo" : v.plazas + (v.plazas === 1 ? " plaza libre" : " plazas libres");
  return `
    <article class="tarjeta">
      <div class="viaje-cabecera">
        <p class="viaje-conductor"><strong>${v.dia}</strong></p>
        <span class="etiqueta etiqueta-gris">Realizado</span>
      </div>
      <ul class="recorrido">
        <li><span>${v.desde}</span></li>
        <li><span>${v.hasta}</span></li>
      </ul>
      <div class="viaje-cabecera">
        <p class="viaje-conductor plazas">${textoPlazas}</p>
        <p class="texto-suave">${v.pasajeros} ${v.pasajeros === 1 ? "pasajero" : "pasajeros"}</p>
      </div>
    </article>`;
}

/**
 * Dibuja los viajes que el usuario ya realizó como conductor, con sus
 * estadísticas, y centra el mapa en el destino de uno de ellos.
 * @method mostrarViajesRealizados
 */
function mostrarViajesRealizados() {
  const mios = obtenerViajes().filter(v => v.mio);
  // separo en dos grupos: a "Próximos" le toca el conteo de los que no son realizados
  const proximos = mios.filter(v => !v.realizado);
  const realizados = mios.filter(v => v.realizado);

  document.getElementById("pestanaProximos").textContent = "Próximos (" + proximos.length + ")";
  document.getElementById("pestanaRealizados").textContent = "Realizados (" + realizados.length + ")";

  if (realizados.length === 0) {
    document.getElementById("listaRealizados").innerHTML = `
      <div class="tarjeta texto-centrado">
        <h2>Todavía no hiciste ningún viaje</h2>
        <p class="texto-suave">Cuando termines un viaje publicado, va a aparecer acá.</p>
      </div>`;
    // sin viajes no hay nada que sumar, oculto el cartel de estadísticas
    document.querySelector(".estadisticas").style.display = "none";
    return;
  }

  let html = "";
  let totalGenerado = 0;
  realizados.forEach(v => {
    html += tarjetaViajeRealizado(v);
    // lo generado en cada viaje = precio por persona x cuántos subieron
    totalGenerado += v.precio * v.pasajeros;
  });
  document.getElementById("listaRealizados").innerHTML = html;

  document.getElementById("viajesTotales").textContent = realizados.length;
  document.getElementById("totalGenerado").textContent = formatearPrecio(totalGenerado);

  // centro el mapa en el destino (buscarLugar/urlMapa ya están en comun.js)
  const destino = buscarLugar(realizados[0].hasta);
  if (destino !== undefined) {
    document.getElementById("mapa").src = urlMapa(destino.lat, destino.lon);
  }
}
mostrarViajesRealizados();
