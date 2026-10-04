# PoolUCC

Carpooling para estudiantes de la UCC. Entrás con tu correo institucional, buscás un
viaje hacia la facu o publicás el tuyo para compartir los lugares libres del auto.

Hecho con **HTML, CSS y JavaScript**, con lo visto en clase. No tiene base de datos:
los viajes de ejemplo están en `JS/datos.js` y todo lo que hace el usuario (reservas,
viajes publicados, chats) se guarda en el navegador con `localStorage`.

## Cómo verlo

Abrí `index.html` en el navegador (o usá Live Server en VS Code). Como no hay sesión,
te manda a `login.html`: ingresá con cualquier nombre y un correo que termine en
`@ucc.edu.ar`. Se ve bien en celular y en escritorio (desde 900px de ancho).

Para volver a empezar de cero: **Perfil → Reiniciar demo**.

### Recorrido para probar

1. **Buscar**: Campus Norte → Plaza España. Si ponés el mismo lugar en los dos campos, avisa.
2. **Resultados**: probá el filtro de destino, el precio máximo, "Mostrar" y "Ordenar por".
   Si no hay viajes, aparece "No encontramos viajes".
3. **Detalle**: elegí cuántas plazas y mirá el total. Al reservar, el viaje pierde esas plazas.
4. **Reservado**: desde acá podés escribirle al conductor (responde solo a los 2 segundos),
   calificar el viaje o cancelar la reserva (las plazas vuelven al viaje).
5. **Ofrecer**: publicá un viaje (prueba poner precio 0 o el mismo lugar), aceptá
   solicitudes y eliminá viajes.
6. **Perfil**: muestra cuántos viajes reservaste y publicaste, y cuánto pagaste.

## Pantallas

| Archivo | Pantalla | JavaScript |
|---------|----------|------------|
| `login.html` | Ingresar con correo UCC | `JS/login.js` |
| `index.html` | Buscar viaje | `JS/index.js` |
| `resultados.html` | Viajes disponibles, con filtros y orden | `JS/resultados.js` |
| `viaje.html` | Detalle del viaje y reserva | `JS/viaje.js` |
| `reservado.html` | Viaje reservado / cancelar | `JS/reservado.js` |
| `chat.html` | Chat con el conductor | `JS/chat.js` |
| `calificar.html` | Calificar el viaje | `JS/calificar.js` |
| `mis-viajes.html` | Mis viajes publicados | `JS/mis-viajes.js` |
| `mis-viajes-realizados.html` | Viajes realizados (de ejemplo) | — |
| `publicar.html` | Publicar un viaje | `JS/publicar.js` |
| `solicitudes.html` | Solicitudes de pasajeros | `JS/solicitudes.js` |
| `perfil.html` | Perfil, cerrar sesión, reiniciar demo | `JS/perfil.js` |

## Estructura

```
PoolUCC/
├── login.html, index.html ... perfil.html   (12 páginas)
├── styles.css         una sola hoja de estilos, enlazada en todas
├── favicon.svg
└── JS/
    ├── datos.js       viajes de ejemplo (array de objetos)
    ├── comun.js       funciones que usan todas las páginas
    └── <página>.js    un archivo por página
```

Cada página carga `datos.js`, `comun.js` y su propio archivo, con `defer`.
En `localStorage` se guardan estas claves: `usuario`, `viajes`, `reservas`,
`busqueda` y `chats`, siempre como texto con `JSON.stringify` / `JSON.parse`.

## Qué de la materia se usa

### HTML y CSS

| Tema | Dónde |
|------|-------|
| Etiquetas semánticas (header, main, nav, section, article, footer) | todas las páginas |
| Formularios: input, select, textarea, radio, checkbox, datalist, fieldset/legend, label for | `login`, `index`, `resultados`, `publicar`, `calificar`, `solicitudes`, `chat` |
| `<iframe>` (mapa de OpenStreetMap) | `index` |
| Hoja de estilo externa, selectores por etiqueta, clase y descendiente | `styles.css` |
| Variables (`:root` y `var()`) | colores de la marca |
| Modelo de cajas, `box-sizing`, unidades `rem` | `styles.css` |
| Pseudo-clases (`:hover`, `:focus`, `:disabled`, `:first-child`) y `::before` | botones, menú, recorrido |
| `transition`, `position: fixed` | botones, menú |
| Flexbox | casi todos los componentes |
| Grid y media query (`min-width: 900px`) | dos columnas y barra superior en escritorio |

### JavaScript

| Tema | Dónde |
|------|-------|
| Archivos externos con `<script src>` | todas las páginas |
| `let` / `const`, `if` / `else if`, ternario, `switch` | todos los `.js`; `switch` en `resultados.js` |
| `for`, `forEach`, `for...of` | `resultados.js`, `publicar.js`, `perfil.js` |
| Funciones clásicas y flecha | todos los `.js` |
| Eventos en el HTML: `onclick`, `onchange`, `oninput`, `onsubmit` | botones y formularios |
| `getElementById`, `querySelector`, `querySelectorAll`, `.value`, `textContent`, `innerHTML` | todos los `.js` |
| `parseInt`, `parseFloat`, `isNaN`, `toFixed`, `Math.round` | precios, plazas y puntajes |
| Métodos de strings: `toLowerCase`, `indexOf`, `slice`, `split`, `replace`, `trim` | validar el correo, filtros, fechas |
| Arrays: `push`, `splice`, `filter`, `find`, `sort` | reservar, cancelar, publicar, eliminar, filtrar y ordenar |
| `localStorage` (`setItem`, `getItem`, `removeItem`) y JSON | `comun.js` |
| `Intl.NumberFormat` (precio como `$2.500`) | `comun.js` |
| Callbacks: `setTimeout` | respuesta automática del chat |
| Documentación con JSDoc | todas las funciones |

## Casos borde que contempla

- Correo que no es `@ucc.edu.ar`, o entrar a cualquier página sin sesión → login.
- Origen y destino iguales (buscar y publicar), precio 0 o mayor a $50.000.
- Búsqueda sin resultados.
- Viaje completo: no es un link y no se puede reservar.
- Reservar dos veces el mismo viaje, o reservar un viaje propio.
- Cancelar una reserva (devuelve las plazas); un viaje ya calificado no se cancela.
- Aceptar más pasajeros que lugares libres.
- Viaje o reserva que no existe (por ejemplo, `viaje.html?id=999`).
- Mis viajes vacío.

## Colores

| Rol | Color |
|-----|-------|
| Primario | celeste `#66CCFF` |
| Secundario | celeste lavado `#D2EFFF` |
| Terciario | azul `#112A46` |
| Acento | dorado `#FFC24D`, solo para ahorro y recompensas |

## Limitaciones (por no tener servidor)

- Los datos viven en el navegador de cada uno: si abrís la página en otra compu, empieza de cero.
- El login no tiene contraseña ni verifica que el correo exista; solo revisa el dominio.
- El chat responde siempre lo mismo y los mapas de viaje/resultados son recuadros.
