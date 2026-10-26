import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Barra blanca con "Volver", título y, opcionalmente, un botón a la derecha.
export default function BarraTitulo({ volverA, textoVolver, titulo, subtitulo, children }) {
  return (
    <header className="barra">
      {volverA && (
        <Link className="volver" to={volverA}>
          <ArrowLeft size={16} aria-hidden="true" /> {textoVolver}
        </Link>
      )}
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {children}
    </header>
  );
}
