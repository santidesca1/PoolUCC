import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Clock, X, Flag, MessageCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import ChipEstado from "../components/ChipEstado";
import Dialogo from "../components/Dialogo";
import ListaVacia from "../components/ListaVacia";
import { formatearPrecio, textoPlazas } from "../utils/formato";

// Título e ícono de la cabecera según el estado de la reserva
function cabecera(reserva, viaje) {
  switch (reserva.estado) {
    case "pendiente": return { Icono: Clock, titulo: "Pedido enviado", texto: `Esperando que ${viaje.conductor} lo acepte` };
    case "confirmada": return { Icono: Check, titulo: "Viaje reservado", texto: "Tu lugar está confirmado" };
    case "rechazada": return { Icono: X, titulo: "Pedido no aceptado", texto: "El conductor no puede llevarte en este viaje" };
    case "cancelada":
      return reserva.motivo === "conductor"
        ? { Icono: X, titulo: "Viaje cancelado", texto: `${viaje.conductor} canceló este viaje` }
        : { Icono: X, titulo: "Reserva cancelada", texto: "Cancelaste esta reserva" };
    default: return { Icono: Flag, titulo: "Viaje realizado", texto: "¡Gracias por compartir el viaje!" };
  }
}

export default function Reserva() {
  const { id } = useParams();
  const { user } = useAuth();
  const { buscarReserva, buscarViaje, cancelarReserva } = useDatos();
  const [confirmando, setConfirmando] = useState(false);

  const reserva = buscarReserva(id);

  if (!reserva || reserva.emailPasajero !== user.email) {
    return (
      <main className="estrecho">
        <section className="contenido">
          <ListaVacia titulo="No encontramos esta reserva">
            <Link className="boton" to="/mis-reservas">Ver mis reservas</Link>
          </ListaVacia>
        </section>
      </main>
    );
  }

  const viaje = buscarViaje(reserva.idViaje);
  const { Icono, titulo, texto } = cabecera(reserva, viaje);
  const activa = reserva.estado === "pendiente" || reserva.estado === "confirmada";

  return (
    <main className="estrecho">
      <header className="hero hero-centrado">
        <div className="marca-exito"><Icono size={32} aria-hidden="true" /></div>
        <h1>{titulo}</h1>
        <p>{texto}</p>
        <p>{viaje.desde} → {viaje.hasta} · {viaje.dia} {viaje.salida}</p>
      </header>

      <section className="contenido">
        <div className="tarjeta tarjeta-fila">
          <span className="avatar avatar-grande">{viaje.iniciales}</span>
          <div className="viaje-conductor">
            <h2>{viaje.conductor}</h2>
            <p className="texto-suave">{viaje.auto}</p>
          </div>
          {activa && (
            <Link className="boton boton-borde boton-chico boton-icono" to={`/chat/${viaje.id}`}>
              <MessageCircle size={16} aria-hidden="true" /> Escribir
            </Link>
          )}
        </div>

        <div className="tarjeta tarjeta-acento tarjeta-fila">
          <div>
            <p className="texto-suave">{reserva.estado === "realizada" ? "Pagaste" : "Pagás al subir"}</p>
            <p className="cifra">{formatearPrecio(reserva.total)}</p>
          </div>
          <div className="columna" style={{ alignItems: "flex-end", gap: "0.375rem" }}>
            <ChipEstado estado={reserva.estado} />
            <p className="texto-suave">{textoPlazas(reserva.plazas)}</p>
          </div>
        </div>

        {reserva.estado === "realizada" && reserva.calificacion === undefined && (
          <Link className="boton" to={`/calificar/${reserva.id}`}>Calificar el viaje</Link>
        )}
        {reserva.estado === "realizada" && reserva.calificacion !== undefined && (
          <p className="texto-suave texto-centrado">Calificaste este viaje con {reserva.calificacion} ★</p>
        )}
        {(reserva.estado === "rechazada" || reserva.estado === "cancelada") && (
          <Link className="boton" to="/">Buscar otro viaje</Link>
        )}
        {activa && (
          <button className="boton boton-peligro" type="button" onClick={() => setConfirmando(true)}>Cancelar reserva</button>
        )}
        <Link className="boton boton-borde" to="/mis-reservas">Ver todas mis reservas</Link>
      </section>

      <Dialogo
        abierto={confirmando}
        titulo="¿Cancelar la reserva?"
        texto="Tu lugar queda libre para otro compañero y le avisamos al conductor."
        textoAceptar="Sí, cancelar"
        peligro
        onAceptar={() => { cancelarReserva(reserva.id); setConfirmando(false); }}
        onCancelar={() => setConfirmando(false)}
      />
    </main>
  );
}
