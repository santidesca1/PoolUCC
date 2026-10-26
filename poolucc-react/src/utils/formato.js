/**
 * Da formato de pesos argentinos a un número: 2500 -> "$2.500".
 * @param {number} numero - Precio sin formato
 * @return {string} Precio con formato
 */
export function formatearPrecio(numero) {
  return "$" + new Intl.NumberFormat("es-AR").format(numero);
}

/**
 * Muestra el puntaje con coma decimal: 4.9 -> "4,9". Si es 0, es "Nuevo".
 * @param {number} puntaje - Puntaje de 0 a 5
 * @return {string} Puntaje con formato
 */
export function formatearPuntaje(puntaje) {
  return puntaje === 0 ? "Nuevo" : puntaje.toFixed(1).replace(".", ",");
}

/**
 * "1 plaza" / "3 plazas".
 * @param {number} cantidad - Cantidad de plazas
 * @return {string} Texto en singular o plural
 */
export function textoPlazas(cantidad) {
  return cantidad + (cantidad === 1 ? " plaza" : " plazas");
}

/**
 * Iniciales de las dos primeras palabras de un nombre: "Santi Descalzo" -> "SD".
 * @param {string} nombre - Nombre y apellido
 * @return {string} Iniciales en mayúscula
 */
export function sacarIniciales(nombre) {
  const palabras = nombre.trim().split(" ").filter(p => p !== "");
  let iniciales = palabras.length > 0 ? palabras[0][0] : "";
  if (palabras.length > 1) {
    iniciales += palabras[1][0];
  }
  return iniciales.toUpperCase();
}
