import { LocateFixed } from "lucide-react";
import { lugares } from "../data/datos";

// Campo "Desde": texto libre con sugerencias (sedes y barrios) + botón "Mi ubicación"
export default function CampoSalida({ id, etiqueta, valor, onCambiar, estado, onPedirUbicacion }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="campo-con-boton">
        <input type="text" id={id} list={id + "-lugares"} placeholder="Tu barrio o una sede" required
          value={valor} onChange={e => onCambiar(e.target.value)} />
        <button className="boton boton-borde boton-chico boton-icono" type="button" onClick={onPedirUbicacion}
          title="Usar mi ubicación actual" aria-label="Usar mi ubicación actual">
          <LocateFixed size={16} aria-hidden="true" /> <span className="texto-boton">Mi ubicación</span>
        </button>
      </div>
      {estado && <small className="ayuda">{estado}</small>}
      <datalist id={id + "-lugares"}>
        {lugares.map(l => <option key={l.nombre} value={l.nombre} />)}
      </datalist>
    </div>
  );
}
