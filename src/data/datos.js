// Datos de ejemplo. La primera vez que se abre la app se copian a localStorage
// (ver DatosProvider y AuthProvider) y desde ahí se leen y se modifican.

// Texto que aparece en "Desde" cuando el usuario comparte su ubicación
export const MI_UBICACION = "Mi ubicación actual";

// Sedes de la UCC: todos los viajes llegan a una de estas
export const sedes = [
  { nombre: "Campus UCC", lat: -31.4866, lon: -64.2437 },
  { nombre: "Sede Centro (Obispo Trejo)", lat: -31.4210, lon: -64.1884 },
  { nombre: "Ciencias de la Salud", lat: -31.4118, lon: -64.1680 }
];

// Barrios conocidos para sugerir como salida (coordenadas aproximadas)
export const barrios = [
  { nombre: "Nueva Córdoba", lat: -31.4275, lon: -64.1855 },
  { nombre: "Güemes", lat: -31.4300, lon: -64.1960 },
  { nombre: "Barrio Jardín", lat: -31.4580, lon: -64.1880 },
  { nombre: "General Paz", lat: -31.4100, lon: -64.1720 },
  { nombre: "Alta Córdoba", lat: -31.3950, lon: -64.1830 },
  { nombre: "Villa Cabrera", lat: -31.3820, lon: -64.2050 },
  { nombre: "Cerro de las Rosas", lat: -31.3700, lon: -64.2330 }
];

// Todos los lugares con coordenadas (para calcular distancias)
export const lugares = sedes.concat(barrios);

// Cuentas de prueba, como el usuario de prueba del ejercicio de login de clase.
// Demo: las contraseñas se guardan tal cual, no usar contraseñas reales.
export const usuariosIniciales = [
  { nombre: "Nacho Albizuri", email: "demo@ucc.edu.ar", password: "demo", carrera: "Ingeniería Informática", iniciales: "NA" },
  { nombre: "Santiago Descalzo", email: "alumno@ucc.edu.ar", password: "demo", carrera: "Ingeniería Informática", iniciales: "SD" }
];

const DEMO = "demo@ucc.edu.ar";

// "conductorEmail" dice de quién es cada viaje. Los de la cuenta demo son los
// que se ven en "Mis viajes" al entrar con demo@ucc.edu.ar.
// "lat" y "lon" son las coordenadas de la salida.
export const viajesIniciales = [
  { id: 1, conductor: "Marta Ruiz", conductorEmail: "marta.ruiz@ucc.edu.ar", iniciales: "MR", carrera: "Ingeniería Informática", auto: "Fiat Cronos · gris", puntaje: 4.9, etiqueta: "Mismo grado", precio: 2500, desde: "Nueva Córdoba", hasta: "Campus UCC", lat: -31.4275, lon: -64.1855, dia: "Hoy", salida: "07:40", llegada: "08:10", plazas: 2, preferencias: ["Sin fumar", "Música suave", "Mochila chica"], autoAceptar: false },
  { id: 2, conductor: "Javier Ortiz", conductorEmail: "javier.ortiz@ucc.edu.ar", iniciales: "JO", carrera: "Abogacía", auto: "Peugeot 208 · blanco", puntaje: 4.7, etiqueta: "", precio: 2000, desde: "Barrio Jardín", hasta: "Campus UCC", lat: -31.4580, lon: -64.1880, dia: "Hoy", salida: "07:50", llegada: "08:15", plazas: 2, preferencias: ["Sin fumar"], autoAceptar: true },
  { id: 3, conductor: "Lucía Prat", conductorEmail: "lucia.prat@ucc.edu.ar", iniciales: "LP", carrera: "Arquitectura", auto: "Volkswagen Gol · rojo", puntaje: 5.0, etiqueta: "Recurrente", precio: 3000, desde: "Sede Centro (Obispo Trejo)", hasta: "Campus UCC", lat: -31.4210, lon: -64.1884, dia: "Hoy", salida: "08:45", llegada: "09:15", plazas: 0, preferencias: ["Puntualidad"], autoAceptar: false },
  { id: 4, conductor: "Tomás Herrera", conductorEmail: "tomas.herrera@ucc.edu.ar", iniciales: "TH", carrera: "Medicina", auto: "Renault Sandero · negro", puntaje: 4.8, etiqueta: "", precio: 1800, desde: "General Paz", hasta: "Ciencias de la Salud", lat: -31.4100, lon: -64.1720, dia: "Hoy", salida: "07:50", llegada: "08:05", plazas: 1, preferencias: ["Sin fumar", "Sin música"], autoAceptar: true },
  { id: 5, conductor: "Camila Rojas", conductorEmail: "camila.rojas@ucc.edu.ar", iniciales: "CR", carrera: "Psicología", auto: "Chevrolet Onix · gris", puntaje: 4.5, etiqueta: "", precio: 2200, desde: "Alta Córdoba", hasta: "Sede Centro (Obispo Trejo)", lat: -31.3950, lon: -64.1830, dia: "Hoy", salida: "13:30", llegada: "13:50", plazas: 3, preferencias: ["Mascotas OK"], autoAceptar: false },
  { id: 6, conductor: "Valentina Sosa", conductorEmail: "valentina.sosa@ucc.edu.ar", iniciales: "VS", carrera: "Ingeniería Informática", auto: "Fiat Mobi · azul", puntaje: 4.9, etiqueta: "Mismo grado", precio: 2800, desde: "Cerro de las Rosas", hasta: "Campus UCC", lat: -31.3700, lon: -64.2330, dia: "Mañana", salida: "07:30", llegada: "08:10", plazas: 4, preferencias: ["Música suave"], autoAceptar: false },
  { id: 7, conductor: "Agustín Molina", conductorEmail: "agustin.molina@ucc.edu.ar", iniciales: "AM", carrera: "Ciencias Económicas", auto: "Toyota Etios · plateado", puntaje: 4.6, etiqueta: "", precio: 2300, desde: "Güemes", hasta: "Campus UCC", lat: -31.4300, lon: -64.1960, dia: "Hoy", salida: "08:00", llegada: "08:25", plazas: 3, preferencias: ["Sin fumar"], autoAceptar: false },

  // Viajes de la cuenta demo (antes tenían "mio: true")
  { id: 100, conductor: "Nacho Albizuri", conductorEmail: DEMO, iniciales: "NA", carrera: "Ingeniería Informática", auto: "Ford Ka · blanco", puntaje: 4.8, etiqueta: "", precio: 2000, desde: "Barrio Jardín", hasta: "Campus UCC", lat: -31.4580, lon: -64.1880, dia: "Viernes pasado", salida: "08:00", llegada: "", plazas: 1, preferencias: [], autoAceptar: false, realizado: true },
  { id: 101, conductor: "Nacho Albizuri", conductorEmail: DEMO, iniciales: "NA", carrera: "Ingeniería Informática", auto: "Ford Ka · blanco", puntaje: 4.8, etiqueta: "", precio: 2000, desde: "Villa Cabrera", hasta: "Campus UCC", lat: -31.3820, lon: -64.2050, dia: "Viernes", salida: "14:00", llegada: "", plazas: 0, preferencias: [], autoAceptar: false },
  { id: 102, conductor: "Nacho Albizuri", conductorEmail: DEMO, iniciales: "NA", carrera: "Ingeniería Informática", auto: "Ford Ka · blanco", puntaje: 4.8, etiqueta: "", precio: 2500, desde: "Villa Cabrera", hasta: "Sede Centro (Obispo Trejo)", lat: -31.3820, lon: -64.2050, dia: "Lunes", salida: "08:15", llegada: "", plazas: 3, preferencias: [], autoAceptar: false }
];

// Reservas de ejemplo. Los solicitantes que Nacho tenía en datos.js ahora son
// reservas "pendiente" del viaje 102, así el conductor las ve en Solicitudes.
// Estados posibles: pendiente, confirmada, rechazada, cancelada, realizada.
export const reservasIniciales = [
  { id: "r1", idViaje: 102, emailPasajero: "sofia.martin@ucc.edu.ar", nombrePasajero: "Sofía Martín", iniciales: "SM", puntajePasajero: 4.6, carrera: "Ingeniería Informática", curso: "2.°", plazas: 1, total: 2500, estado: "pendiente" },
  { id: "r2", idViaje: 102, emailPasajero: "diego.salas@ucc.edu.ar", nombrePasajero: "Diego Salas", iniciales: "DS", puntajePasajero: 4.9, carrera: "Abogacía", curso: "1.°", plazas: 1, total: 2500, estado: "pendiente" },
  { id: "r3", idViaje: 101, emailPasajero: "lucas.perez@ucc.edu.ar", nombrePasajero: "Lucas Pérez", iniciales: "LP", puntajePasajero: 4.7, carrera: "Medicina", curso: "3.°", plazas: 2, total: 4000, estado: "confirmada" },
  { id: "r4", idViaje: 100, emailPasajero: "ana.gomez@ucc.edu.ar", nombrePasajero: "Ana Gómez", iniciales: "AG", puntajePasajero: 4.8, carrera: "Arquitectura", curso: "4.°", plazas: 1, total: 2000, estado: "realizada", calificacion: 5 },
  { id: "r5", idViaje: 100, emailPasajero: "bruno.diaz@ucc.edu.ar", nombrePasajero: "Bruno Díaz", iniciales: "BD", puntajePasajero: 4.5, carrera: "Psicología", curso: "2.°", plazas: 1, total: 2000, estado: "realizada" }
];
