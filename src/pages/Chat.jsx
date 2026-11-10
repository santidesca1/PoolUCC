import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import ListaVacia from "../components/ListaVacia";

// Chat entre el pasajero y el conductor de un viaje.
// El pasajero entra con /chat/:idViaje; el conductor, con /chat/:idViaje?pasajero=correo
export default function Chat() {
  const { idViaje } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { buscarViaje, reservasDeViaje, reservaActiva, mensajes, enviarMensaje } = useDatos();
  const [texto, setTexto] = useState("");
  const cajaRef = useRef(null);

  const viaje = buscarViaje(idViaje);
  const soyConductor = viaje && viaje.conductorEmail === user.email;
  const emailPasajero = soyConductor ? params.get("pasajero") : user.email;
  const lista = viaje && emailPasajero ? mensajes(viaje.id, emailPasajero) : [];

  // Cada vez que llega un mensaje, baja hasta el último
  useEffect(() => {
    if (cajaRef.current) cajaRef.current.scrollTop = cajaRef.current.scrollHeight;
  }, [lista.length]);

  if (!viaje || !emailPasajero) {
    return (
      <main className="estrecho">
        <section className="contenido">
          <ListaVacia titulo="No encontramos esta conversación">
            <Link className="boton" to="/">Volver al inicio</Link>
          </ListaVacia>
        </section>
      </main>
    );
  }

  // Con quién hablo y a dónde vuelvo
  let nombreOtro = viaje.conductor;
  let volverA = `/viaje/${viaje.id}`;
  if (soyConductor) {
    const reserva = reservasDeViaje(viaje.id).find(r => r.emailPasajero === emailPasajero);
    nombreOtro = reserva ? reserva.nombrePasajero : emailPasajero;
    volverA = `/solicitudes/${viaje.id}`;
  } else {
    const activa = reservaActiva(viaje.id);
    if (activa) volverA = `/reserva/${activa.id}`;
  }

  const enviar = e => {
    e.preventDefault();
    if (texto.trim() === "") return;
    enviarMensaje(viaje.id, emailPasajero, texto.trim());
    setTexto("");
  };

  return (
    <main className="estrecho">
      <BarraTitulo volverA={volverA} textoVolver="Volver" titulo={nombreOtro} subtitulo={`${viaje.desde} → ${viaje.hasta} · ${viaje.salida}`} />

      <section className="contenido">
        <div className="tarjeta chat-caja">
          <div className="chat" ref={cajaRef}>
            <span className="etiqueta etiqueta-gris chat-dia">
              {lista.length === 0 ? "Escribí para coordinar el punto de encuentro" : "Hoy"}
            </span>
            {lista.map((m, i) => (
              <p key={i} className={"mensaje " + (m.autor === user.email ? "mensaje-enviado" : "mensaje-recibido")}>{m.texto}</p>
            ))}
          </div>

          <form className="fila chat-escribir" onSubmit={enviar}>
            <div className="campo">
              <label className="oculto" htmlFor="mensaje">Mensaje</label>
              <input type="text" id="mensaje" placeholder="Escribí un mensaje" maxLength={300} value={texto} onChange={e => setTexto(e.target.value)} />
            </div>
            <button className="boton boton-chico boton-icono" type="submit"><Send size={16} aria-hidden="true" /> Enviar</button>
          </form>
        </div>
        <p className="ayuda texto-centrado">
          {soyConductor ? "El pasajero ve tus mensajes en su chat y le llega un aviso." : `${viaje.conductor.split(" ")[0]} ve tus mensajes cuando entra a su cuenta.`}
        </p>
      </section>
    </main>
  );
}
