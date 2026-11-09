# PoolUCC · versión React

La misma app de viajes compartidos de la carpeta raíz, pasada a **React + JSX** con Vite, y con el
modelo de negocio completo: el pasajero pide lugar, el conductor acepta o rechaza, el viaje se
finaliza y se califica. Sigue la estructura del ejercicio de login de clase (`AuthContext`,
`AuthProvider`, `useAuth`, `ProtectedRoute`).

No tiene base de datos: todo se guarda en `localStorage`, igual que la versión HTML.

## Cómo correrlo

```bash
cd poolucc-react
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

También se puede crear una cuenta nueva con cualquier correo `@ucc.edu.ar`.
Para volver a empezar de cero: **Perfil → Reiniciar demo**.

## Recorrido para mostrar el circuito completo

1. Entrá como `alumno@ucc.edu.ar`. Buscá desde **Villa Cabrera** a **Sede Centro**, en "Mostrar" elegí
   **Todos** y abrí el viaje de Nacho Albizuri (lunes 08:15). **Pedir lugar**: queda **Pendiente**.
2. Cerrá sesión y entrá como `demo@ucc.edu.ar`. La campana del menú tiene un aviso. En **Ofrecer →
   Ver solicitudes** aceptá el pedido.
3. En **Mis viajes**, tocá **Finalizar viaje**.
4. Volvé a la cuenta del pasajero: en **Avisos** están "aceptó tu solicitud" y "¡Calificalo!", y en
   **Reservas** el viaje aparece como Realizado, con el botón **Calificar**.

Los viajes con la etiqueta "Acepta solo" (por ejemplo, el de Javier Ortiz) se confirman al instante.

## Estructura

```
src/
  main.jsx           BrowserRouter > AuthProvider > DatosProvider > App
  App.jsx            todas las rutas; las de la app van dentro de <ProtectedRoute> y <Layout>
  context/           AuthContext, DatosContext (createContext)
  providers/         AuthProvider (cuentas y sesión), DatosProvider (viajes, reservas, avisos, chats)
  hooks/             useAuth, useDatos, useUbicacion (GPS del navegador), useTema (modo oscuro)
  routes/            ProtectedRoute: sin sesión, manda al login
  pages/             una por pantalla
  components/        piezas reutilizables: Menu, TarjetaViaje, Recorrido, Dialogo, Mapa, Estrellas...
  data/datos.js      sedes, barrios, viajes, reservas y cuentas de ejemplo
  utils/             formato (precios, puntajes) y geo (distancias)
  index.css          la misma hoja de estilos de la versión HTML, con modo oscuro
```

`DatosProvider` concentra todo el acceso a los datos: si más adelante hay un backend real (por
ejemplo Supabase), es el único archivo que hay que cambiar.

## Pantallas

| Ruta | Pantalla | Versión HTML |
|---|---|---|
| `/login`, `/registro` | Ingresar y crear cuenta | login.html (registro es nuevo) |
| `/` | Buscar viaje | index.html |
| `/resultados` | Viajes disponibles, filtros, orden y mapa con un punto por viaje | resultados.html |
| `/viaje/:id` | Detalle, mapa con el recorrido y pedido de lugar | viaje.html?id= |
| `/reserva/:id` | Estado de la reserva (pendiente, confirmada, rechazada, cancelada, realizada) | reservado.html?id= |
| `/chat/:idViaje` | Chat entre pasajero y conductor | chat.html?id= |
| `/calificar/:id` | Calificar con estrellas | calificar.html?id= |
| `/mis-reservas` | Todas las reservas del pasajero | nueva |
| `/mis-viajes`, `/mis-viajes/realizados` | Viajes publicados, finalizar o cancelar | mis-viajes*.html |
| `/publicar` | Publicar un viaje | publicar.html |
| `/solicitudes/:idViaje` | Aceptar o rechazar pedidos, ver pasajeros | solicitudes.html?id= |
| `/avisos` | Avisos con contador en el menú | nueva |
| `/perfil` | Perfil, modo oscuro, cerrar sesión y reiniciar demo | perfil.html |

## Qué de React se usa

| Tema | Dónde |
|---|---|
| Componentes y props | `components/` (por ejemplo `<TarjetaViaje viaje distancia />`) |
| `useState` | formularios, filtros, diálogos |
| `useEffect` | guardar en `localStorage`, abrir el `<dialog>`, ajustar el mapa, bajar el chat |
| `useRef` | `<dialog>` y la caja del chat |
| Context + Provider + hook propio | sesión (`useAuth`) y datos (`useDatos`), como el ejercicio de clase |
| Hooks propios | `useUbicacion`, `useTema` |
| React Router | `<Routes>`, rutas anidadas, `<ProtectedRoute>` con `<Outlet>`, `useParams`, `useSearchParams`, `useNavigate`, `<NavLink>` |
| Renderizado condicional y listas con `.map` y `key` | en casi todas las páginas |
| Formularios controlados | Login, Registro, Buscar, Publicar |

Librerías externas: `react-router-dom`, `leaflet` + `react-leaflet` (mapa) y `lucide-react` (íconos).

## Limitaciones (por no tener servidor)

- Los datos viven en el navegador: otra compu u otro navegador empiezan de cero.
- Las contraseñas se guardan tal cual en el navegador: no usar contraseñas reales.
- Los conductores de ejemplo (Marta, Javier...) no contestan el chat ni las solicitudes; para ver las
  dos puntas se usan las dos cuentas de prueba en el mismo navegador.
