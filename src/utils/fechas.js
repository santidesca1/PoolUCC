/**
 * Fecha en formato "2026-11-10" según la hora LOCAL del usuario.
 * (toISOString() usa la hora UTC, que en Argentina ya es "mañana" desde las 21 h.)
 * @param {Date} fecha - Fecha a convertir (por defecto, ahora)
 * @return {string} Fecha como "AAAA-MM-DD"
 */
export function fechaLocalISO(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

/**
 * Texto corto para un día: "Hoy", "Mañana" o "30/10".
 * @param {string} fechaISO - Fecha como "AAAA-MM-DD"
 * @return {string} Etiqueta del día
 */
export function etiquetaDia(fechaISO) {
  const hoy = new Date();
  const manana = new Date();
  manana.setDate(hoy.getDate() + 1);
  if (fechaISO === fechaLocalISO(hoy)) return "Hoy";
  if (fechaISO === fechaLocalISO(manana)) return "Mañana";
  const [, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}`;
}

/**
 * Nombre del día de la semana, en minúscula: "lunes".
 * @param {number} diasDesdeHoy - 0 es hoy, 1 es mañana
 * @return {string} Día de la semana
 */
export function nombreDia(diasDesdeHoy = 0) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + diasDesdeHoy);
  return new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(fecha);
}
