import { useEffect, useRef } from "react";

/**
 * Ventana de aviso o de confirmación. Si se pasa onCancelar, muestra dos botones
 * (confirmación); si no, uno solo (aviso). La página decide cuándo está abierta.
 */
export default function Dialogo({ abierto, titulo, texto, textoAceptar = "Entendido", peligro = false, onAceptar, onCancelar }) {
  const ref = useRef(null);

  // <dialog> se abre y se cierra con sus propios métodos: los llamamos cuando cambia "abierto"
  useEffect(() => {
    const dialogo = ref.current;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  // Esc: en una confirmación es "Cancelar"; en un aviso, "Entendido"
  const alApretarEsc = e => {
    e.preventDefault();
    if (onCancelar) onCancelar();
    else onAceptar();
  };

  return (
    <dialog className="dialogo" ref={ref} onCancel={alApretarEsc}>
      <h2>{titulo}</h2>
      <p className="texto-suave">{texto}</p>
      <div className="dialogo-botones">
        {onCancelar && (
          <button className="boton boton-borde boton-chico" type="button" onClick={onCancelar}>Cancelar</button>
        )}
        <button className={"boton boton-chico" + (peligro ? " boton-peligro" : "")} type="button" onClick={onAceptar}>
          {textoAceptar}
        </button>
      </div>
    </dialog>
  );
}
