// Texto que aparece en "Desde" cuando el usuario comparte su ubicación
const MI_UBICACION = "Mi ubicación actual";

// Sedes de la UCC: todos los viajes llegan a una de estas
const sedes = [
  { nombre: "Campus UCC", lat: -31.4866, lon: -64.2437 },
  { nombre: "Sede Centro (Obispo Trejo)", lat: -31.4210, lon: -64.1884 },
  { nombre: "Ciencias de la Salud", lat: -31.4118, lon: -64.1680 }
];

// Barrios conocidos para sugerir como salida (coordenadas aproximadas)
const barrios = [
  { nombre: "Nueva Córdoba", lat: -31.4275, lon: -64.1855 },
  { nombre: "Güemes", lat: -31.4300, lon: -64.1960 },
  { nombre: "Barrio Jardín", lat: -31.4580, lon: -64.1880 },
  { nombre: "General Paz", lat: -31.4100, lon: -64.1720 },
  { nombre: "Alta Córdoba", lat: -31.3950, lon: -64.1830 },
  { nombre: "Villa Cabrera", lat: -31.3820, lon: -64.2050 },
  { nombre: "Cerro de las Rosas", lat: -31.3700, lon: -64.2330 }
];

// Todos los lugares con coordenadas (para calcular distancias)
const lugares = sedes.concat(barrios);

// Viajes de ejemplo. La primera vez que se abre la página se copian a
// localStorage (ver comun.js) y desde ahí la app los lee y los modifica.
// "lat" y "lon" son las coordenadas de la salida (null si no se conocen).
// Los que tienen "mio: true" son los viajes que publicó el usuario.
const viajesIniciales = [
  {
    id: 1,
    conductor: "Marta Ruiz",
    iniciales: "MR",
    carrera: "Ingeniería Informática",
    auto: "Fiat Cronos · gris",
    puntaje: 4.9,
    etiqueta: "Mismo grado",
    precio: 2500,
    desde: "Nueva Córdoba",
    hasta: "Campus UCC",
    lat: -31.4275,
    lon: -64.1855,
    dia: "Hoy",
    salida: "07:40",
    llegada: "08:10",
    plazas: 2,
    preferencias: ["Sin fumar", "Música suave", "Mochila chica"],
    mio: false
  },
  {
    id: 2,
    conductor: "Javier Ortiz",
    iniciales: "JO",
    carrera: "Abogacía",
    auto: "Peugeot 208 · blanco",
    puntaje: 4.7,
    etiqueta: "",
    precio: 2000,
    desde: "Barrio Jardín",
    hasta: "Campus UCC",
    lat: -31.4580,
    lon: -64.1880,
    dia: "Hoy",
    salida: "07:50",
    llegada: "08:15",
    plazas: 2,
    preferencias: ["Sin fumar"],
    mio: false
  },
  {
    id: 3,
    conductor: "Lucía Prat",
    iniciales: "LP",
    carrera: "Arquitectura",
    auto: "Volkswagen Gol · rojo",
    puntaje: 5.0,
    etiqueta: "Recurrente",
    precio: 3000,
    desde: "Sede Centro (Obispo Trejo)",
    hasta: "Campus UCC",
    lat: -31.4210,
    lon: -64.1884,
    dia: "Hoy",
    salida: "08:45",
    llegada: "09:15",
    plazas: 0,
    preferencias: ["Puntualidad"],
    mio: false
  },
  {
    id: 4,
    conductor: "Tomás Herrera",
    iniciales: "TH",
    carrera: "Medicina",
    auto: "Renault Sandero · negro",
    puntaje: 4.8,
    etiqueta: "",
    precio: 1800,
    desde: "General Paz",
    hasta: "Ciencias de la Salud",
    lat: -31.4100,
    lon: -64.1720,
    dia: "Hoy",
    salida: "07:50",
    llegada: "08:05",
    plazas: 1,
    preferencias: ["Sin fumar", "Sin música"],
    mio: false
  },
  {
    id: 5,
    conductor: "Camila Rojas",
    iniciales: "CR",
    carrera: "Psicología",
    auto: "Chevrolet Onix · gris",
    puntaje: 4.5,
    etiqueta: "",
    precio: 2200,
    desde: "Alta Córdoba",
    hasta: "Sede Centro (Obispo Trejo)",
    lat: -31.3950,
    lon: -64.1830,
    dia: "Hoy",
    salida: "13:30",
    llegada: "13:50",
    plazas: 3,
    preferencias: ["Mascotas OK"],
    mio: false
  },
  {
    id: 6,
    conductor: "Valentina Sosa",
    iniciales: "VS",
    carrera: "Ingeniería Informática",
    auto: "Fiat Mobi · azul",
    puntaje: 4.9,
    etiqueta: "Mismo grado",
    precio: 2800,
    desde: "Cerro de las Rosas",
    hasta: "Campus UCC",
    lat: -31.3700,
    lon: -64.2330,
    dia: "Mañana",
    salida: "07:30",
    llegada: "08:10",
    plazas: 4,
    preferencias: ["Música suave"],
    mio: false
  },
  {
    id: 7,
    conductor: "Agustín Molina",
    iniciales: "AM",
    carrera: "Ciencias Económicas",
    auto: "Toyota Etios · plateado",
    puntaje: 4.6,
    etiqueta: "",
    precio: 2300,
    desde: "Güemes",
    hasta: "Campus UCC",
    lat: -31.4300,
    lon: -64.1960,
    dia: "Hoy",
    salida: "08:00",
    llegada: "08:25",
    plazas: 3,
    preferencias: ["Sin fumar"],
    mio: false
  },
  {
    id: 101,
    conductor: "Vos",
    iniciales: "",
    carrera: "",
    auto: "",
    puntaje: 0,
    etiqueta: "",
    precio: 2000,
    desde: "Villa Cabrera",
    hasta: "Campus UCC",
    lat: -31.3820,
    lon: -64.2050,
    dia: "Viernes",
    salida: "14:00",
    llegada: "",
    plazas: 0,
    preferencias: [],
    mio: true,
    solicitudes: 0
  },
  {
    id: 102,
    conductor: "Vos",
    iniciales: "",
    carrera: "",
    auto: "",
    puntaje: 0,
    etiqueta: "",
    precio: 2500,
    desde: "Villa Cabrera",
    hasta: "Sede Centro (Obispo Trejo)",
    lat: -31.3820,
    lon: -64.2050,
    dia: "Lunes",
    salida: "08:15",
    llegada: "",
    plazas: 3,
    preferencias: [],
    mio: true,
    solicitudes: 2,
    // agrego solicitantes acá para que se peudan dibujar las tarjetas de cada solicitante en la vista del conductor
    solicitantes: [
      { nombre: "Sofía Martín", iniciales: "SM", puntaje: 4.6, carrera: "Ingeniería Informática", curso: "2.°", plazas:1},
      { nombre: "Diego Salas", iniciales: "DS", puntaje: 4.9, carrera: "Derecho", curso: "1.°", plazas:1}
    ]
  }
];
