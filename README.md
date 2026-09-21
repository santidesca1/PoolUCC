# PoolUCC

Carpooling para estudiantes de la UCC. Verificás tu correo institucional, ofrecés
un viaje o buscás uno disponible, ordenado por cercanía y horario.

Primera entrega del diseño web: **solo HTML y CSS** (sin JavaScript), pensado con lo
visto en clase.

## Cómo verlo

Abrí `index.html` en el navegador (o usá Live Server en VS Code). Todas las pantallas
están enlazadas entre sí. Se ve bien en celular y en escritorio (desde 900px de ancho).

## Pantallas

| Archivo | Pantalla |
|---------|----------|
| `index.html` | Buscar viaje |
| `resultados.html` | Viajes disponibles |
| `viaje.html` | Detalle del viaje |
| `reservado.html` | Viaje reservado |
| `chat.html` | Chat con el conductor |
| `calificar.html` | Calificar el viaje |
| `mis-viajes.html` | Mis viajes: próximos (conductor) |
| `mis-viajes-realizados.html` | Mis viajes: realizados |
| `publicar.html` | Publicar un viaje |
| `solicitudes.html` | Solicitudes de pasajeros |
| `perfil.html` | Perfil |

Los datos son de ejemplo. Viaje, reservado, chat y calificar usan el viaje de Marta Ruiz;
todas las tarjetas de resultados llevan al mismo detalle. El viaje "Completo" de
`resultados.html` no es un link, a propósito.

## Estructura

```
PoolUCC/
├── index.html ... perfil.html   (11 páginas)
├── styles.css                   (una sola hoja de estilos, enlazada en todas)
└── favicon.svg
```

Todas las páginas tienen la misma estructura: `<main>` con `<header>` y `<section>`,
`<nav class="menu">` y `<footer>`.

## Qué de la materia se usa

| Tema | Dónde |
|------|-------|
| Etiquetas semánticas (header, main, nav, section, article, footer) | todas las páginas |
| Formularios: input, select, textarea, radio, checkbox, datalist, fieldset/legend, label for | `index`, `publicar`, `calificar`, `solicitudes`, `chat` |
| Hoja de estilo externa y selectores por etiqueta, clase y descendiente | `styles.css` |
| Variables (`:root` y `var()`) | colores de la marca en `styles.css` |
| Modelo de cajas, `box-sizing`, unidades `rem` | `styles.css` |
| Pseudo-clases (`:hover`, `:focus`, `:first-child`) y pseudo-elementos (`::before`) | botones, menú, recorrido |
| `transition` | botones, menú, tarjetas |
| `position: fixed` | menú de navegación |
| Flexbox | casi todos los componentes |
| Grid y media query (`min-width: 900px`) | pantallas de escritorio |

## Colores

| Rol | Color |
|-----|-------|
| Primario | celeste `#66CCFF` |
| Secundario | celeste lavado `#D2EFFF` |
| Terciario | azul `#112A46` |
| Acento | dorado `#FFC24D`, solo para ahorro y recompensas |

## Pendiente

- Login y verificación del correo UCC.
- Mapa real (hoy son recuadros, se puede probar con un `<iframe>`).
- Edge cases: sin resultados, cancelaciones, reclamos.
