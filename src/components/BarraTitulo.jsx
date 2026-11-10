import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CampanaAvisos from "./CampanaAvisos";

// Barra de arriba: botón redondo para volver, título y, a la derecha, un botón (children)
// o la campana de avisos (solo en el celular; en escritorio está en el menú).
export default function BarraTitulo({ volverA, textoVolver = "Volver", titulo, subtitulo, campana = true, children }) {
  return (
    <header className="barra">
      {volverA && (
        <Link className="boton-volver" to={volverA} aria-label={textoVolver} title={textoVolver}>
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
      )}
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {children}
      {campana && !children && <CampanaAvisos />}
    </header>
  );
}
