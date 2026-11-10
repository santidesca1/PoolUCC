import { Link } from "react-router-dom";
import { formatearPrecio, formatearPuntaje, textoPlazas } from "../utils/formato";
import { textoDistancia } from "../utils/geo";

// Fila de un viaje en Resultados: conductor a la izquierda y precio grande a la derecha.
// Si está completo no es un link: no se puede reservar.
export default function TarjetaViaje({ viaje, distancia = Infinity }) {
  const completo = viaje.plazas === 0;
  const distanciaTexto = textoDistancia(distancia);

  const interior = (
    <>
      <span className="avatar">{viaje.iniciales}</span>
      <div className="fila-viaje-info">
        <h2>{viaje.conductor}</h2>
        <p>{viaje.dia} · {viaje.salida}{distanciaTexto && " · " + distanciaTexto}</p>
        <p className="fila-viaje-ruta">{viaje.desde} → {viaje.hasta}</p>
        <p>★ {formatearPuntaje(viaje.puntaje)}{viaje.etiqueta && " · " + viaje.etiqueta}</p>
      </div>
      <div className="fila-viaje-precio">
        <p className="precio">{formatearPrecio(viaje.precio)}</p>
        <p className={completo ? "plazas plazas-completo" : "plazas"}>
          {completo ? "Completo" : textoPlazas(viaje.plazas) + (viaje.plazas === 1 ? " libre" : " libres")}
        </p>
      </div>
    </>
  );

  if (completo) {
    return <article className="fila-viaje fila-viaje-completa">{interior}</article>;
  }
  return (
    <article>
      <Link className="fila-viaje" to={`/viaje/${viaje.id}`}>{interior}</Link>
    </article>
  );
}
