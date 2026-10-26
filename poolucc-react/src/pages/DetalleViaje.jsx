import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import Recorrido from "../components/Recorrido";
import ListaVacia from "../components/ListaVacia";
import Mapa from "../components/Mapa";
import { buscarLugar } from "../utils/geo";
import { formatearPrecio, formatearPuntaje, textoPlazas } from "../utils/formato";

export default function DetalleViaje() {
  const { id } = useParams();
  const { user } = useAuth();
  const { buscarViaje, reservaActiva, solicitarReserva } = useDatos();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");

  const viaje = buscarViaje(id);

  if (!viaje || viaje.cancelado) {
    return (
      <main className="estrecho">
        <BarraTitulo volverA="/resultados" textoVolver="Volver" titulo="Detalle del viaje" />
        <section className="contenido">
          <ListaVacia titulo="No encontramos este viaje" texto="Puede que el conductor lo haya cancelado.">
            <Link className="boton" to="/resultados">Ver otros viajes</Link>
          </ListaVacia>
        </section>
      </main>
    );
  }

  const esMio = viaje.conductorEmail === user.email;
  const yaReservada = reservaActiva(viaje.id);
  const completo = viaje.plazas === 0;
  const sePuedeReservar = !esMio && !yaReservada && !completo && !viaje.realizado;
  const total = viaje.precio * cantidad;
  const textoBoton = viaje.autoAceptar ? "Reservar plaza" : "Pedir lugar";

  // Mapa: punto de salida, sede y una línea entre los dos
  const sede = buscarLugar(viaje.hasta);
  const puntos = [];
  if (viaje.lat !== null) puntos.push({ lat: viaje.lat, lon: viaje.lon, tipo: "viaje", etiqueta: "Salida: " + viaje.desde });
  if (sede) puntos.push({ lat: sede.lat, lon: sede.lon, tipo: "sede", etiqueta: sede.nombre });
  const linea = puntos.length === 2 ? puntos.map(p => [p.lat, p.lon]) : null;

  const reservar = () => {
    try {
      const idReserva = solicitarReserva(viaje.id, cantidad);
      navigate(`/reserva/${idReserva}`);
    } catch (err) {
      setError(err.message);
    }
  };

  let aviso = "";
  if (yaReservada) aviso = "Ya tenés una reserva en este viaje.";
  else if (esMio) aviso = "Este viaje lo publicaste vos.";
  else if (viaje.realizado) aviso = "Este viaje ya se hizo.";

  return (
    <main className="con-barra-reservar">
      <BarraTitulo volverA="/resultados" textoVolver="Volver a resultados" titulo="Detalle del viaje" />

      <section className="contenido dos-columnas">
        <Mapa className="mapa-alto" puntos={puntos} linea={linea} titulo="Recorrido del viaje" />

        <div className="columna">
          <section className="tarjeta">
            <h2>{viaje.dia} · sale {viaje.salida}</h2>
            <Recorrido desde={viaje.desde} hasta={viaje.hasta} salida={viaje.salida} llegada={viaje.llegada} />
            {viaje.preferencias.length > 0 && (
              <ul className="etiquetas">
                {viaje.preferencias.map(p => <li key={p} className="etiqueta etiqueta-gris">{p}</li>)}
              </ul>
            )}
          </section>

          <section className="tarjeta">
            <div className="viaje-cabecera">
              <span className="avatar avatar-grande">{viaje.iniciales}</span>
              <div className="viaje-conductor">
                <h2>{viaje.conductor}</h2>
                <p>★ {formatearPuntaje(viaje.puntaje)} · {viaje.carrera}</p>
              </div>
            </div>
            <ul className="etiquetas">
              <li className="etiqueta etiqueta-verde">✓ Verificado</li>
              <li className="etiqueta etiqueta-gris">{viaje.auto}</li>
              {viaje.etiqueta && <li className="etiqueta">{viaje.etiqueta}</li>}
            </ul>
            {!esMio && (
              <Link className="boton boton-borde boton-chico boton-ajustado boton-icono" to={`/chat/${viaje.id}`}>
                <MessageCircle size={16} aria-hidden="true" /> Escribirle a {viaje.conductor.split(" ")[0]}
              </Link>
            )}
          </section>

          <div className="tarjeta">
            <div className="fila-titulo">
              <h2>Tu reserva</h2>
              <p className="precio">{formatearPrecio(viaje.precio)} <small className="ayuda">por plaza</small></p>
            </div>
            {sePuedeReservar && (
              <div className="fila">
                <div className="campo">
                  <label htmlFor="cantidad">Plazas a reservar</label>
                  <select id="cantidad" value={cantidad} onChange={e => setCantidad(Number(e.target.value))}>
                    {Array.from({ length: viaje.plazas }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <p className="ayuda">Total</p>
                  <p className="cifra">{formatearPrecio(total)}</p>
                </div>
              </div>
            )}
            <p className="texto-suave">
              {completo ? "Este viaje está completo." : textoPlazas(viaje.plazas) + (viaje.plazas === 1 ? " libre" : " libres") + " · Efectivo o transferencia"}
            </p>
            {sePuedeReservar && (
              <p className="ayuda">
                {viaje.autoAceptar ? "Este conductor acepta las reservas al instante." : "El conductor tiene que aceptar tu pedido. Te avisamos cuando responda."}
              </p>
            )}
            {aviso && (
              <p className="mensaje-error">
                {aviso} {yaReservada && <Link className="volver" to={`/reserva/${yaReservada.id}`}>Ver mi reserva</Link>}
              </p>
            )}
            {error && <p className="mensaje-error">{error}</p>}
            <button className="boton" type="button" onClick={reservar} disabled={!sePuedeReservar}>{textoBoton}</button>
          </div>
        </div>
      </section>

      {/* Solo en el celular: total y botón siempre a mano */}
      <div className="barra-reservar">
        <div>
          <p className="ayuda">Total</p>
          <p className="cifra">{formatearPrecio(total)}</p>
        </div>
        <button className="boton boton-chico" type="button" onClick={reservar} disabled={!sePuedeReservar}>
          {sePuedeReservar ? textoBoton : yaReservada ? "Ya reservado" : "No disponible"}
        </button>
      </div>
    </main>
  );
}
