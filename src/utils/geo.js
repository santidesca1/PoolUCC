import { lugares, MI_UBICACION } from "../data/datos";

/**
 * Busca las coordenadas de un lugar conocido (sede o barrio) por su nombre.
 * @param {string} nombre - Nombre escrito por el usuario
 * @return {Object} El lugar { nombre, lat, lon }, o undefined si no lo conocemos
 */
export function buscarLugar(nombre) {
  const buscado = nombre.trim().toLowerCase();
  return lugares.find(l => l.nombre.toLowerCase() === buscado);
}

/**
 * Coordenadas desde donde sale el usuario: su ubicación actual (si la compartió)
 * o el lugar conocido que escribió.
 * @param {string} desde - Lo que dice el campo "Desde"
 * @param {Object} ubicacion - { lat, lon } guardada por useUbicacion, o null
 * @return {Object} { lat, lon }, o null si no se sabe
 */
export function coordenadasDeSalida(desde, ubicacion) {
  if (desde === MI_UBICACION) {
    return ubicacion;
  }
  const lugar = buscarLugar(desde || "");
  return lugar === undefined ? null : { lat: lugar.lat, lon: lugar.lon };
}

/**
 * Distancia aproximada en km entre dos puntos. Para distancias cortas alcanza con
 * tratar el mapa como plano: un grado de latitud son unos 111 km y uno de
 * longitud, 111 km × cos(latitud).
 * @param {Object} a - Punto { lat, lon }
 * @param {Object} b - Punto { lat, lon }
 * @return {number} Distancia en km
 */
export function distanciaKm(a, b) {
  const x = (b.lon - a.lon) * 111 * Math.cos(a.lat * Math.PI / 180);
  const y = (b.lat - a.lat) * 111;
  return Math.sqrt(x * x + y * y);
}

/**
 * Texto de la distancia para las tarjetas: "sale de tu zona" o "a 2,5 km de vos".
 * @param {number} km - Distancia, o Infinity si no se sabe
 * @return {string} Texto, o "" si no se sabe
 */
export function textoDistancia(km) {
  if (km === Infinity) {
    return "";
  }
  return km < 0.3 ? "sale de tu zona" : "a " + km.toFixed(1).replace(".", ",") + " km de vos";
}
