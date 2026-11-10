import { Link, useLocation } from "react-router-dom";
import { Car, ChevronRight } from "lucide-react";
import { useDatos } from "../hooks/useDatos";

// Aviso fijo pegado al menú de abajo (como el "ver carrito" de las apps de comida):
// muestra el próximo viaje y al tocarlo lleva a la reserva.
export default function BarraProximoViaje() {
  const { misReservas, buscarViaje } = useDatos();
  const { pathname } = useLocation();

  // Próximo viaje: la primera reserva pendiente o confirmada
  const proxima = misReservas.find(r => r.estado === "pendiente" || r.estado === "confirmada");
  if (!proxima) return null;

  // Ya está mirando esa reserva: no hace falta el aviso
  if (pathname === `/reserva/${proxima.id}`) return null;

  const viaje = buscarViaje(proxima.idViaje);
  return (
    <Link className="barra-proximo" to={`/reserva/${proxima.id}`}>
      <span className="barra-proximo-icono"><Car size={20} aria-hidden="true" /></span>
      <span className="barra-proximo-texto">
        <small>Tu próximo viaje · {proxima.estado === "pendiente" ? "esperando respuesta" : "confirmado"}</small>
        <b>{viaje.dia} · {viaje.salida} · a {viaje.hasta}</b>
      </span>
      <ChevronRight size={20} aria-hidden="true" />
    </Link>
  );
}
