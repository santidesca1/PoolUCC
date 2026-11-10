import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import ChipEstado from "../components/ChipEstado";
import ListaVacia from "../components/ListaVacia";
import { formatearPuntaje, textoPlazas } from "../utils/formato";

// Tarjeta de un pasajero (pedido pendiente o ya confirmado)
function TarjetaPasajero({ reserva, idViaje, children }) {
  return (
    <article className="tarjeta tarjeta-sutil">
      <div className="viaje-cabecera">
        <span className="avatar">{reserva.iniciales}</span>
        <div className="viaje-conductor">
          <h2>{reserva.nombrePasajero}</h2>
          <p>★ {formatearPuntaje(reserva.puntajePasajero)} · {reserva.carrera}{reserva.curso && " · " + reserva.curso}</p>
        </div>
        <span className="etiqueta">{textoPlazas(reserva.plazas)}</span>
      </div>
      <div className="acciones">
        <Link className="boton boton-borde boton-chico boton-icono" to={`/chat/${idViaje}?pasajero=${encodeURIComponent(reserva.emailPasajero)}`}>
          <MessageCircle size={16} aria-hidden="true" /> Escribir
        </Link>
        {children}
      </div>
    </article>
  );
}

export default function Solicitudes() {
  const { idViaje } = useParams();
  const { user } = useAuth();
  const { buscarViaje, reservasDeViaje, responderSolicitud } = useDatos();
  const [error, setError] = useState("");

  const viaje = buscarViaje(idViaje);

  if (!viaje || viaje.conductorEmail !== user.email) {
    return (
      <main className="estrecho">
        <BarraTitulo volverA="/mis-viajes" textoVolver="Mis viajes" titulo="Solicitudes" />
        <section className="contenido">
          <ListaVacia titulo="Este viaje no es tuyo o ya no existe">
            <Link className="boton" to="/mis-viajes">Ver mis viajes</Link>
          </ListaVacia>
        </section>
      </main>
    );
  }

  const reservas = reservasDeViaje(viaje.id);
  const pendientes = reservas.filter(r => r.estado === "pendiente");
  const confirmadas = reservas.filter(r => r.estado === "confirmada");

  const responder = (idReserva, acepta) => {
    try {
      responderSolicitud(idReserva, acepta);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="estrecho">
      <BarraTitulo volverA="/mis-viajes" textoVolver="Mis viajes" titulo="Solicitudes" subtitulo={`${viaje.dia} ${viaje.salida} · a ${viaje.hasta}`} />

      <section className="contenido">
        <p className="tarjeta tarjeta-fila">
          <span className="texto-suave">Lugares disponibles</span>
          <strong className="cifra">{viaje.plazas}</strong>
        </p>
        {error && <p className="mensaje-error">{error}</p>}

        <h2 className="titulo-grupo">Por responder</h2>
        {pendientes.length === 0 && <ListaVacia titulo="No tenés solicitudes pendientes" />}
        {pendientes.map(r => (
          <TarjetaPasajero key={r.id} reserva={r} idViaje={viaje.id}>
            <button className="boton boton-peligro boton-chico" type="button" onClick={() => responder(r.id, false)}>Rechazar</button>
            <button className="boton boton-chico" type="button" onClick={() => responder(r.id, true)}>Aceptar</button>
          </TarjetaPasajero>
        ))}

        {confirmadas.length > 0 && (
          <>
            <h2 className="titulo-grupo">Pasajeros confirmados</h2>
            {confirmadas.map(r => (
              <TarjetaPasajero key={r.id} reserva={r} idViaje={viaje.id}>
                <ChipEstado estado="confirmada" />
              </TarjetaPasajero>
            ))}
          </>
        )}
      </section>
    </main>
  );
}
