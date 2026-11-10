import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useDatos } from "../hooks/useDatos";

// Campana de avisos del celular (en escritorio los avisos están en la barra de arriba).
// "flotante" es la versión blanca que va encima del mapa.
export default function CampanaAvisos({ flotante = false }) {
  const { avisosSinLeer } = useDatos();
  return (
    <Link className={(flotante ? "fab" : "campana") + " fab-campana"} to="/avisos"
      aria-label={avisosSinLeer > 0 ? `Avisos (${avisosSinLeer} sin leer)` : "Avisos"}>
      <Bell size={20} aria-hidden="true" />
      {avisosSinLeer > 0 && <span className="contador" aria-hidden="true">{avisosSinLeer}</span>}
    </Link>
  );
}
