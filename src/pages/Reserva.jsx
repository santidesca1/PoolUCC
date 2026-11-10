import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, X, MessageCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import ChipEstado from "../components/ChipEstado";
import Dialogo from "../components/Dialogo";
import ListaVacia from "../components/ListaVacia";
import { formatearPrecio, textoPlazas } from "../utils/formato";

// Título grande según el estado de la reserva
function titulo(reserva, viaje) {
  switch (reserva.estado) {
    case "pendiente": return `Esperando que ${viaje.conductor.split(" ")[0]} acepte tu pedido`;
    case "confirmada": return "Tu lugar está confirmado";
    case "rechazada": return "El conductor no pudo llevarte en este viaje";
    case "cancelada":
      return reserva.motivo === "conductor" ? `${viaje.conductor.split(" ")[0]} canceló este viaje` : "Cancelaste esta reserva";
    default: return "Viaje realizado. ¡Gracias por compartirlo!";
  }
}

// Línea de pasos: cada uno está hecho, es el que está pasando ahora, o falta
function pasos(reserva, viaje) {
  const enviado = { titulo: "Pedido enviado", detalle: "El conductor ya lo recibió", estado: "hecho" };
  const viajeHoy = `${viaje.dia} · ${viaje.salida}`;
  switch (reserva.estado) {
    case "pendiente":
      return [enviado,
        { titulo: "Respuesta del conductor", detalle: "Te avisamos en cuanto responda", estado: "ahora" },
        { titulo: "Viaje · " + viajeHoy, detalle: `${viaje.desde} → ${viaje.hasta}`, estado: "futuro" }];
    case "confirmada":
      return [enviado,
        { titulo: "Pedido aceptado", detalle: "Tu lugar está reservado", estado: "hecho" },
        { titulo: "Viaje · " + viajeHoy, detalle: `${viaje.desde} → ${viaje.hasta}`, estado: "ahora" }];
    case "realizada":
      return [enviado,
        { titulo: "Pedido aceptado", detalle: "Tu lugar estaba reservado", estado: "hecho" },
        { titulo: "Viaje realizado", detalle: `${viaje.desde} → ${viaje.hasta}`, estado: "hecho" }];
    case "rechazada":
      return [enviado, { titulo: "Pedido no aceptado", detalle: "No hubo lugar para vos", estado: "cancelado" }];
    default:
      return [enviado, { titulo: "Reserva cancelada", detalle: "Los lugares volvieron al viaje", estado: "cancelado" }];
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
        <BarraTitulo volverA="/mis-reservas" textoVolver="Volver a mis reservas" titulo="Mi reserva" />
        <section className="contenido">
          <ListaVacia titulo="No encontramos esta reserva">
            <Link className="boton" to="/mis-reservas">Ver mis reservas</Link>
          </ListaVacia>
        </section>
      </main>
    );
  }

  const viaje = buscarViaje(reserva.idViaje);
  const activa = reserva.estado === "pendiente" || reserva.estado === "confirmada";

  return (
    <main className="estrecho">
      <BarraTitulo volverA="/mis-reservas" textoVolver="Volver a mis reservas" titulo="Mi reserva" />

      <section className="contenido">
        <div className="reserva-titulo">
          <ChipEstado estado={reserva.estado} />
          <h1>{titulo(reserva, viaje)}</h1>
        </div>

        <ol className="pasos" aria-label="Estado del pedido">
          {pasos(reserva, viaje).map(p => (
            <li key={p.titulo} className={"paso " + p.estado}>
              <span className="paso-punto" aria-hidden="true">
                {p.estado === "hecho" && <Check size={14} strokeWidth={3} />}
                {p.estado === "cancelado" && <X size={14} strokeWidth={3} />}
              </span>
              <div>
                <b>{p.titulo}</b>
                <span>{p.detalle}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="tarjeta tarjeta-fila">
          <div className="viaje-cabecera">
            <span className="avatar">{viaje.iniciales}</span>
            <div className="viaje-conductor">
              <h2>{viaje.conductor}</h2>
              <p>{viaje.auto}</p>
            </div>
          </div>
          <p className="precio">{formatearPrecio(reserva.total)}</p>
        </div>
        <p className="texto-suave">
          {textoPlazas(reserva.plazas)} · {reserva.estado === "realizada" ? "Pagaste en efectivo o transferencia" : "Pagás al subir"}
        </p>

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
          <Link className="boton boton-borde boton-icono" to={`/chat/${viaje.id}`}>
            <MessageCircle size={18} aria-hidden="true" /> Escribirle a {viaje.conductor.split(" ")[0]}
          </Link>
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
