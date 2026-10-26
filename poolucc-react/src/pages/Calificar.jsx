import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import Estrellas from "../components/Estrellas";
import Dialogo from "../components/Dialogo";
import ListaVacia from "../components/ListaVacia";

export default function Calificar() {
  const { id } = useParams();
  const { user } = useAuth();
  const { buscarReserva, buscarViaje, calificar } = useDatos();
  const navigate = useNavigate();
  const [puntaje, setPuntaje] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  const reserva = buscarReserva(id);

  if (!reserva || reserva.emailPasajero !== user.email || reserva.estado !== "realizada") {
    return (
      <main className="estrecho">
        <BarraTitulo volverA="/mis-reservas" textoVolver="Mis reservas" titulo="Calificar viaje" />
        <section className="contenido">
          <ListaVacia titulo="Todavía no podés calificar este viaje" texto="Se califica cuando el conductor marca el viaje como terminado.">
            <Link className="boton" to="/mis-reservas">Ver mis reservas</Link>
          </ListaVacia>
        </section>
      </main>
    );
  }

  const viaje = buscarViaje(reserva.idViaje);
  const yaCalificado = reserva.calificacion !== undefined && !enviado;

  const enviar = e => {
    e.preventDefault();
    calificar(reserva.id, puntaje, comentario.trim());
    setEnviado(true);
  };

  return (
    <main className="estrecho">
      <BarraTitulo volverA={`/reserva/${reserva.id}`} textoVolver="Volver al viaje" titulo="Calificar viaje" />

      <form className="contenido" onSubmit={enviar}>
        <div className="tarjeta tarjeta-centrada">
          <span className="avatar avatar-grande">{viaje.iniciales}</span>
          <h2>{viaje.desde} → {viaje.hasta}</h2>
          <p className="texto-suave">Viaje con {viaje.conductor}</p>
          <Estrellas valor={yaCalificado ? reserva.calificacion : puntaje} onCambiar={setPuntaje} deshabilitado={yaCalificado} />
        </div>

        <div className="campo">
          <label htmlFor="comentario">Comentarios (opcional)</label>
          <textarea id="comentario" rows={3} maxLength={280} placeholder="¿Cómo fue el viaje?" value={comentario} onChange={e => setComentario(e.target.value)} disabled={yaCalificado} />
        </div>

        {yaCalificado && <p className="mensaje-error">Ya calificaste este viaje con {reserva.calificacion} estrellas.</p>}
        <button className="boton" type="submit" disabled={yaCalificado || puntaje === 0}>Enviar calificación</button>
      </form>

      <Dialogo
        abierto={enviado}
        titulo="¡Gracias por calificar!"
        texto="Tu opinión ayuda a que todos viajen mejor."
        onAceptar={() => navigate("/mis-reservas")}
      />
    </main>
  );
}
