# PoolUCC

Carpooling para estudiantes de la UCC. Entrás con tu correo institucional, buscás un viaje hacia
una sede de la universidad o publicás el tuyo para compartir los lugares libres del auto.

**Segunda entrega: React + JSX** (Vite). Taller de Desarrollo Web · UCC · 2026.
Integrantes: Nacho Albizuri y Santiago Descalzo.

## Las dos entregas

| Entrega | Tecnología | Dónde está |
|---|---|---|
| **1** · Diseño web | HTML, CSS y JavaScript, sin framework | carpeta [`entrega-1-html-css-js/`](entrega-1-html-css-js/) y el tag `entrega-1-html-css-js` |
| **2** · Actual | React + JSX, con el modelo de negocio completo | **esta raíz del repositorio** |

Qué se suma en la segunda entrega, además de pasar las 12 pantallas a componentes de React:

- **Solicitudes conectadas**: el pasajero pide lugar y el conductor acepta o rechaza (antes la reserva se
  confirmaba sola y las solicitudes eran datos escritos a mano).
- Registro y login con contraseña, **Mis reservas**, **Avisos** con contador y **Finalizar viaje**.
- Mapas interactivos (un punto por viaje y el recorrido), íconos y modo oscuro.
- Las dos puntas del negocio se pueden ver a la vez, con dos cuentas en dos pestañas.

## Cómo correrlo

Hace falta [Node.js](https://nodejs.org) 20 o más nuevo.

```bash
npm install
npm run dev
```

Abrí la dirección que muestra la terminal (normalmente http://localhost:5173).
Otros comandos: `npm run build` (versión para publicar, en `dist/`) y `npm run lint` (revisa el código).

## Cuentas de prueba

| Correo | Contraseña | Para qué |
|---|---|---|
| `demo@ucc.edu.ar` | `demo` | Conductor: tiene viajes publicados y solicitudes por responder |
| `alumno@ucc.edu.ar` | `demo` | Pasajero |

También se puede crear una cuenta con cualquier correo `@ucc.edu.ar`.
Para volver a empezar de cero: **Perfil → Reiniciar demo**.

## Recorrido para ver el circuito completo

La sesión es **por pestaña**, así que se pueden tener las dos cuentas abiertas a la vez. Los cambios de
una pestaña le llegan a la otra al instante, sin recargar.

1. **Pestaña 1**, como `alumno@ucc.edu.ar`: buscá desde **Villa Cabrera** a **Sede Centro**, en "Mostrar"
   elegí **Todos**, abrí el viaje de Nacho Albizuri (lunes 08:15) y tocá **Pedir lugar**. Queda **Pendiente**.
2. **Pestaña 2**, como `demo@ucc.edu.ar`: en la campana del menú aparece el aviso. En **Ofrecer → Ver
   solicitudes** tocá **Aceptar**. En la pestaña 1 la reserva pasa sola a **Confirmada**.
3. En la pestaña 2, **Ofrecer → Finalizar viaje**. En la pestaña 1 llega el aviso "¡Calificalo!" y desde
   **Reservas** se puede calificar con estrellas.

Los viajes con la etiqueta "Acepta solo" (por ejemplo, el de Javier Ortiz) se confirman al instante.

## Reglas de negocio

**Quién puede entrar y qué viajes existen**
- Solo correos `@ucc.edu.ar`. Sin sesión, toda la app redirige al login.
- Todos los viajes **llegan a una sede** (Campus UCC, Sede Centro o Ciencias de la Salud). La salida puede
  ser otra sede, un barrio o la ubicación actual. Los resultados se ordenan por cercanía.
- Un viaje se publica para un día o se repite cada semana. Cobra por persona o por viaje, solo para cubrir
  gastos: entre $1 y $50.000. No se puede publicar con la misma salida y llegada, ni en una fecha u hora
  que ya pasó.

**Ciclo de una reserva**

| Estado | Cuándo | Qué pasa con los lugares |
|---|---|---|
| Pendiente | El pasajero pidió lugar y el conductor todavía no respondió | No se descuentan |
| Confirmada | El conductor aceptó (o el viaje acepta solo) | Se descuentan |
| Rechazada | El conductor no aceptó, o terminó el viaje sin responder | — |
| Cancelada | La canceló el pasajero (se devuelven los lugares) o el conductor canceló el viaje | Se devuelven |
| Realizada | El conductor finalizó el viaje con la reserva confirmada | — |

**Lo que no se puede hacer**
- Reservar un viaje propio, un viaje completo, uno ya hecho o cancelado, o dos veces el mismo viaje.
- Aceptar más pasajeros que lugares libres.
- Calificar un viaje que no se hizo, o calificarlo dos veces.

Cada cambio de estado le llega al otro usuario como un **aviso**.

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/login`, `/registro` | Ingresar y crear cuenta |
| `/` | Buscar viaje |
| `/resultados` | Viajes disponibles: filtros, orden y mapa con un punto por viaje |
| `/viaje/:id` | Detalle, mapa con el recorrido y pedido de lugar |
| `/reserva/:id` | Estado de la reserva |
| `/chat/:idViaje` | Chat entre pasajero y conductor |
| `/calificar/:id` | Calificar con estrellas |
| `/mis-reservas` | Todas las reservas del pasajero |
| `/mis-viajes`, `/mis-viajes/realizados` | Viajes publicados: finalizar o cancelar |
| `/publicar` | Publicar un viaje |
| `/solicitudes/:idViaje` | Aceptar o rechazar pedidos y ver los pasajeros |
| `/avisos` | Avisos con contador en el menú |
| `/perfil` | Perfil, modo oscuro, cerrar sesión y reiniciar demo |

## Estructura

Sigue el ejercicio de login de clase (`AuthContext`, `AuthProvider`, `useAuth`, `ProtectedRoute`).

```
src/
  main.jsx           BrowserRouter > AuthProvider > DatosProvider > App
  App.jsx            todas las rutas; las de la app van dentro de <ProtectedRoute> y <Layout>
  context/           AuthContext, DatosContext (createContext)
  providers/         AuthProvider (cuentas y sesión), DatosProvider (viajes, reservas, avisos, chats)
  hooks/             useAuth, useDatos, useUbicacion (GPS del navegador), useTema, useTituloDePagina
  routes/            ProtectedRoute: sin sesión, manda al login
  pages/             una por pantalla
  components/        piezas reutilizables: Menu, TarjetaViaje, Recorrido, Dialogo, Mapa, Estrellas...
  data/datos.js      sedes, barrios, viajes, reservas y cuentas de ejemplo
  utils/             formato (precios, puntajes), geo (distancias) y fechas
  index.css          hoja de estilos con la paleta de la marca y modo oscuro
```

`DatosProvider` concentra todo el acceso a los datos: si más adelante hay un backend real (por ejemplo
Supabase), es el único archivo que hay que cambiar.

## Qué de la materia se usa

| Tema | Dónde |
|---|---|
| Componentes y props | `components/` (por ejemplo `<TarjetaViaje viaje distancia />`) |
| `useState` | formularios, filtros, diálogos |
| `useEffect` | guardar en `localStorage`, abrir el `<dialog>`, ajustar el mapa, escuchar otras pestañas |
| `useRef` | `<dialog>` y la caja del chat |
| Context + Provider + hook propio | sesión (`useAuth`) y datos (`useDatos`), como el ejercicio de clase |
| Hooks propios | `useUbicacion`, `useTema`, `useTituloDePagina` |
| React Router | `<Routes>`, rutas anidadas, `<ProtectedRoute>` con `<Outlet>`, `useParams`, `useSearchParams`, `useNavigate`, `<NavLink>` |
| Renderizado condicional y listas con `.map` y `key` | en casi todas las páginas |
| Formularios controlados | Login, Registro, Buscar, Publicar |
| `localStorage` y `sessionStorage` con `JSON.stringify` / `JSON.parse` | `AuthProvider`, `DatosProvider` |
| CSS: variables, flexbox, grid, media queries, `transition`, modo oscuro | `index.css` |

Librerías externas: `react-router-dom`, `leaflet` + `react-leaflet` (mapas) y `lucide-react` (íconos).

## Decisiones técnicas

- **Sin base de datos**: todo se guarda en `localStorage`, como la primera entrega.
- **La sesión va en `sessionStorage`** (una por pestaña) y los datos en `localStorage` (compartidos). El
  evento `storage` mantiene sincronizadas las pestañas; sin eso, una pestaña con datos viejos borraba lo
  que guardaba la otra.
- **Las fechas se calculan en hora local**, no en UTC. De cada viaje se guarda la fecha real y "Hoy",
  "Mañana" o "30/10" se calcula al mostrarla.
- **Los mapas usan `CircleMarker`** en lugar de los íconos de Leaflet, que con Vite no cargan solos.

## Limitaciones (por no tener servidor)

- Los datos viven en el navegador: otra compu u otro navegador empiezan de cero.
- Las contraseñas se guardan tal cual en el navegador: no usar contraseñas reales.
- Los conductores de ejemplo (Marta, Javier...) no contestan el chat ni las solicitudes; para ver las dos
  puntas se usan las dos cuentas de prueba.
- "Finalizar viaje" se puede tocar antes de la fecha del viaje, para poder mostrar el circuito en una demo.
- Al cerrar la pestaña hay que volver a iniciar sesión.
