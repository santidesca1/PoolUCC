import { Link } from "react-router-dom";
import Recorrido from "./Recorrido";
import { formatearPrecio, formatearPuntaje, textoPlazas } from "../utils/formato";
import { textoDistancia } from "../utils/geo";

// Tarjeta de un viaje en Resultados. Si está completo no es un link: no se puede reservar.
export default function TarjetaViaje({ viaje, distancia = Infinity }) {
  const completo = viaje.plazas === 0;
  const distanciaTexto = textoDistancia(distancia);

  const interior = (
    <>
      <div className="viaje-cabecera">
        <span className="avatar">{viaje.iniciales}</span>
        <div className="viaje-conductor">
          <h2>{viaje.conductor}</h2>
          <p>★ {formatearPuntaje(viaje.puntaje)} {viaje.etiqueta && <span className="etiqueta">{viaje.etiqueta}</span>}</p>
        </div>
        <p className="precio">{formatearPrecio(viaje.precio)}</p>
      </div>
      <Recorrido desde={viaje.desde} hasta={viaje.hasta} salida={viaje.salida} llegada={viaje.llegada} />
      <p className={completo ? "plazas plazas-completo" : "plazas"}>
        {viaje.dia} · {completo ? "Completo" : textoPlazas(viaje.plazas) + (viaje.plazas === 1 ? " libre" : " libres")}
        {distanciaTexto && " · " + distanciaTexto}
      </p>
    </>
  );

  if (completo) {
    return <article className="tarjeta tarjeta-completa">{interior}</article>;
  }
  return (
    <article>
      <Link className="tarjeta tarjeta-enlace" to={`/viaje/${viaje.id}`}>{interior}</Link>
    </article>
  );
}
