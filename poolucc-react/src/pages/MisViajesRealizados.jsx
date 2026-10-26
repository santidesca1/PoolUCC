import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import PestanasMisViajes from "../components/PestanasMisViajes";
import Recorrido from "../components/Recorrido";
import ListaVacia from "../components/ListaVacia";
import Mapa from "../components/Mapa";
import { buscarLugar } from "../utils/geo";
import { formatearPrecio } from "../utils/formato";

export default function MisViajesRealizados() {
  const { misViajes, reservasDeViaje } = useDatos();
  const proximos = misViajes.filter(v => !v.realizado);
  const realizados = misViajes.filter(v => v.realizado);

  // Lo generado sale de las reservas que efectivamente viajaron
  let totalGenerado = 0;
  const filas = realizados.map(v => {
    const viajaron = reservasDeViaje(v.id).filter(r => r.estado === "realizada");
    const pasajeros = viajaron.reduce((suma, r) => suma + r.plazas, 0);
    viajaron.forEach(r => { totalGenerado += r.total; });
    return { viaje: v, pasajeros };
  });

  const puntos = [];
  if (realizados.length > 0) {
    const sede = buscarLugar(realizados[0].hasta);
    if (sede) puntos.push({ lat: sede.lat, lon: sede.lon, tipo: "sede", etiqueta: sede.nombre });
  }

  return (
    <main>
      <BarraTitulo titulo="Mis viajes" />

      <section className="contenido dos-columnas">
        <div className="columna">
          <PestanasMisViajes proximos={proximos.length} realizados={realizados.length} />

          {realizados.length === 0 ? (
            <ListaVacia titulo="Todavía no hiciste ningún viaje" texto="Cuando finalices un viaje publicado, va a aparecer acá." />
          ) : (
            <>
              {filas.map(({ viaje, pasajeros }) => (
                <article className="tarjeta" key={viaje.id}>
                  <div className="viaje-cabecera">
                    <p className="viaje-conductor"><strong>{viaje.dia}</strong></p>
                    <span className="etiqueta etiqueta-gris">Realizado</span>
                  </div>
                  <Recorrido desde={viaje.desde === "Ubicación del conductor" ? "Tu ubicación" : viaje.desde} hasta={viaje.hasta} />
                  <p className="texto-suave">{pasajeros} {pasajeros === 1 ? "pasajero" : "pasajeros"} · {formatearPrecio(viaje.precio)} por persona</p>
                </article>
              ))}

              {/* El dorado (acento) se usa solo para lo que se ganó o ahorró */}
              <div className="tarjeta tarjeta-oscura estadisticas">
                <div>
                  <p>Viajes totales</p>
                  <p className="cifra cifra-blanca">{realizados.length}</p>
                </div>
                <div>
                  <p>Total generado</p>
                  <p className="cifra cifra-acento">{formatearPrecio(totalGenerado)}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <Mapa className="solo-escritorio mapa-alto" puntos={puntos} titulo="Mapa de la sede" />
      </section>
    </main>
  );
}
