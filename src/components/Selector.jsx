import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Desplegable propio (reemplaza al <select> del navegador para que todos se vean igual).
 * @param {string} id - id del botón (el <label htmlFor> lo señala)
 * @param {string} valor - valor elegido
 * @param {Function} onCambiar - recibe el valor de la opción elegida
 * @param {Array} opciones - [{ valor, texto, deshabilitada }]
 * Se maneja con el mouse, el dedo o el teclado (flechas, Enter, Esc).
 */
export default function Selector({ id, valor, onCambiar, opciones, etiqueta, deshabilitado = false }) {
  const [abierto, setAbierto] = useState(false);
  const [arriba, setArriba] = useState(false);
  const [activa, setActiva] = useState(0);
  const raiz = useRef(null);
  const lista = useRef(null);

  const elegida = opciones.find(o => o.valor === valor);

  // Se cierra al tocar cualquier cosa fuera del desplegable
  useEffect(() => {
    if (!abierto) return;
    const fuera = e => {
      if (!raiz.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto]);

  // La opción marcada siempre queda a la vista
  useEffect(() => {
    if (abierto) lista.current.children[activa]?.scrollIntoView({ block: "nearest" });
  }, [abierto, activa]);

  const abrir = () => {
    // Si abajo no entra la lista, se abre hacia arriba
    const caja = raiz.current.getBoundingClientRect();
    const espacioAbajo = window.innerHeight - caja.bottom - 80;
    const altoLista = Math.min(opciones.length * 44 + 12, 256);
    setArriba(espacioAbajo < altoLista && caja.top > espacioAbajo);
    setActiva(Math.max(0, opciones.findIndex(o => o.valor === valor)));
    setAbierto(true);
  };

  const elegir = opcion => {
    if (opcion.deshabilitada) return;
    onCambiar(opcion.valor);
    setAbierto(false);
    raiz.current.querySelector("button").focus();
  };

  const alApretarTecla = e => {
    if (!abierto) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " ") {
        e.preventDefault();
        abrir();
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiva(Math.min(activa + 1, opciones.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiva(Math.max(activa - 1, 0)); }
    else if (e.key === "Home") { e.preventDefault(); setActiva(0); }
    else if (e.key === "End") { e.preventDefault(); setActiva(opciones.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(opciones[activa]); }
    else if (e.key === "Escape") { e.preventDefault(); setAbierto(false); }
    else if (e.key === "Tab") setAbierto(false);
  };

  return (
    <div className="selector" ref={raiz}>
      <button
        type="button" id={id} className="selector-boton" disabled={deshabilitado}
        aria-haspopup="listbox" aria-expanded={abierto} aria-label={etiqueta}
        onClick={() => (abierto ? setAbierto(false) : abrir())} onKeyDown={alApretarTecla}
      >
        <span>{elegida ? elegida.texto : "Elegir"}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>

      {abierto && (
        <ul className={"lista-opciones" + (arriba ? " arriba" : "")} role="listbox" ref={lista}>
          {opciones.map((o, i) => (
            <li
              key={o.valor} role="option" aria-selected={o.valor === valor} aria-disabled={o.deshabilitada}
              className={(i === activa ? "activa " : "") + (o.deshabilitada ? "deshabilitada" : "")}
              onPointerEnter={() => setActiva(i)} onClick={() => elegir(o)}
            >
              <span>{o.texto}</span>
              {o.valor === valor && <Check size={16} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
