import { useEffect, useRef, useState } from "react";
import { LocateFixed } from "lucide-react";
import { lugares } from "../data/datos";

// Campo "Desde": texto libre con sugerencias (sedes y barrios) + botón "Mi ubicación".
// La lista de sugerencias es propia, con el mismo estilo que los demás desplegables.
export default function CampoSalida({ id, etiqueta, valor, onCambiar, estado, onPedirUbicacion }) {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(-1);
  const raiz = useRef(null);

  // Si ya escribió un lugar exacto se muestran todos; si no, solo los que coinciden
  const texto = valor.trim().toLowerCase();
  const exacto = lugares.some(l => l.nombre.toLowerCase() === texto);
  const sugerencias = texto === "" || exacto ? lugares : lugares.filter(l => l.nombre.toLowerCase().includes(texto));

  // Se cierra al tocar fuera del campo
  useEffect(() => {
    if (!abierto) return;
    const fuera = e => {
      if (!raiz.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto]);

  const elegir = lugar => {
    onCambiar(lugar.nombre);
    setAbierto(false);
    setActiva(-1);
  };

  const alApretarTecla = e => {
    if (e.key === "ArrowDown") { e.preventDefault(); setAbierto(true); setActiva(Math.min(activa + 1, sugerencias.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiva(Math.max(activa - 1, 0)); }
    else if (e.key === "Escape") setAbierto(false);
    else if (e.key === "Enter" && abierto && activa >= 0 && sugerencias[activa]) { e.preventDefault(); elegir(sugerencias[activa]); }
  };

  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="campo-con-boton">
        <div className="combo" ref={raiz}>
          <input type="text" id={id} placeholder="Tu barrio o una sede" required autoComplete="off"
            role="combobox" aria-expanded={abierto && sugerencias.length > 0} aria-autocomplete="list"
            value={valor} onChange={e => { onCambiar(e.target.value); setAbierto(true); setActiva(-1); }}
            onFocus={() => setAbierto(true)} onKeyDown={alApretarTecla} />
          {abierto && sugerencias.length > 0 && (
            <ul className="lista-opciones" role="listbox">
              {sugerencias.map((l, i) => (
                <li key={l.nombre} role="option" aria-selected={l.nombre === valor}
                  className={i === activa ? "activa" : ""} onPointerEnter={() => setActiva(i)} onClick={() => elegir(l)}>
                  <span>{l.nombre}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="boton boton-borde boton-chico boton-icono" type="button" onClick={onPedirUbicacion}
          title="Usar mi ubicación actual" aria-label="Usar mi ubicación actual">
          <LocateFixed size={16} aria-hidden="true" /> <span className="texto-boton">Mi ubicación</span>
        </button>
      </div>
      {estado && <small className="ayuda">{estado}</small>}
    </div>
  );
}
