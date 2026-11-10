import { Link } from "react-router-dom";
import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import ChipEstado from "../components/ChipEstado";
import Recorrido from "../components/Recorrido";
import ListaVacia from "../components/ListaVacia";
import { formatearPrecio, textoPlazas } from "../utils/formato";

// Grupos en los que se muestran las reservas, en este orden
const GRUPOS = [
  { titulo: "En curso", estados: ["pendiente", "confirmada"] },
  { titulo: "Realizadas", estados: ["realizada"] },
  { titulo: "Canceladas y no aceptadas", estados: ["cancelada", "rechazada"] }
];

export default function MisReservas() {
  const { misReservas, buscarViaje } = useDatos();

  return (
    <main className="estrecho">
      <BarraTitulo titulo="Mis reservas" subtitulo="Los viajes que pediste como pasajero" />

      <section className="contenido">
        {misReservas.length === 0 && (
          <ListaVacia titulo="Todavía no reservaste ningún viaje" texto="Buscá un viaje hacia tu sede y pedí tu lugar.">
            <Link className="boton" to="/">Buscar viaje</Link>
          </ListaVacia>
        )}

        {GRUPOS.map(grupo => {
          const delGrupo = misReservas.filter(r => grupo.estados.includes(r.estado));
          if (delGrupo.length === 0) return null;
          return (
            <div className="columna" key={grupo.titulo}>
              <h2 className="titulo-grupo">{grupo.titulo}</h2>
              {delGrupo.map(r => {
                const viaje = buscarViaje(r.idViaje);
                const paraCalificar = r.estado === "realizada" && r.calificacion === undefined;
                return (
                  <article className="tarjeta tarjeta-sutil" key={r.id}>
                    <div className="viaje-cabecera">
                      <div className="viaje-conductor">
                        <h3>{viaje.dia} · {viaje.salida}</h3>
                        <p>con {viaje.conductor} · {textoPlazas(r.plazas)}</p>
                      </div>
                      <ChipEstado estado={r.estado} />
                    </div>
                    <Recorrido desde={viaje.desde} hasta={viaje.hasta} />
                    <div className="acciones acciones-pie">
                      <p className="precio-texto">{formatearPrecio(r.total)}</p>
                      {paraCalificar && <Link className="boton boton-chico" to={`/calificar/${r.id}`}>Calificar</Link>}
                      <Link className="boton boton-borde boton-chico" to={`/reserva/${r.id}`}>Ver</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          );
        })}
      </section>
    </main>
  );
}
