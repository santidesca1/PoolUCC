// Leer y guardar en localStorage (o sessionStorage) sin que la app se rompa.
//
// localStorage puede fallar de varias formas: el texto guardado puede estar roto (alguien
// lo editó o quedó cortado) y JSON.parse tira error, el navegador puede tenerlo bloqueado
// (modo privado, cookies deshabilitadas) o puede no haber más espacio. Si ese error pasa
// mientras React dibuja, la pantalla queda en blanco. Por eso todo pasa por acá: si algo
// falla, se usa el valor de ejemplo y la app sigue andando.

function elegir(deSesion) {
  return deSesion ? sessionStorage : localStorage;
}

/**
 * Lee un valor guardado como JSON.
 * @param {string} clave - Nombre con el que se guardó
 * @param {*} valorInicial - Lo que se devuelve si no hay nada guardado o está roto
 * @param {boolean} deSesion - true para usar sessionStorage en vez de localStorage
 * @return {*} El valor guardado, o valorInicial
 */
export function leerGuardado(clave, valorInicial, deSesion = false) {
  try {
    const guardado = elegir(deSesion).getItem(clave);
    return guardado === null ? valorInicial : JSON.parse(guardado);
  } catch {
    return valorInicial;
  }
}

/**
 * Guarda un valor como JSON. Si no se puede (sin espacio, almacenamiento bloqueado), la app
 * sigue funcionando; solo se pierde el guardado.
 * @param {string} clave - Nombre con el que se guarda
 * @param {*} valor - Lo que se quiere guardar
 * @param {boolean} deSesion - true para usar sessionStorage en vez de localStorage
 */
export function guardar(clave, valor, deSesion = false) {
  try {
    elegir(deSesion).setItem(clave, JSON.stringify(valor));
  } catch {
    // Sin espacio o bloqueado: no hay nada más que hacer
  }
}

/**
 * Borra un valor guardado.
 * @param {string} clave - Nombre con el que se guardó
 * @param {boolean} deSesion - true para usar sessionStorage en vez de localStorage
 */
export function borrarGuardado(clave, deSesion = false) {
  try {
    elegir(deSesion).removeItem(clave);
  } catch {
    // Almacenamiento bloqueado: no hay nada que borrar
  }
}
