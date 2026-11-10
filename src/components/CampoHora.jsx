import Selector from "./Selector";

const dos = n => String(n).padStart(2, "0");
const HORAS = Array.from({ length: 24 }, (_, i) => dos(i));
const MINUTOS = Array.from({ length: 12 }, (_, i) => dos(i * 5));

/**
 * Horario con dos desplegables (hora y minutos) que arma el texto "HH:MM".
 * Con "opcional" se puede dejar sin hora ("") y el valor queda vacío.
 */
export default function CampoHora({ id, valor, onCambiar, opcional = false }) {
  const [hora, minutos] = valor === "" ? ["", ""] : valor.split(":");

  const opcionesHora = HORAS.map(h => ({ valor: h, texto: h }));
  if (opcional) opcionesHora.unshift({ valor: "", texto: "--" });

  const cambiarHora = h => onCambiar(h === "" ? "" : h + ":" + (minutos || "00"));
  const cambiarMinutos = m => onCambiar(hora + ":" + m);

  return (
    <div className="fila-hora">
      <Selector id={id} etiqueta="Hora" valor={hora} onCambiar={cambiarHora} opciones={opcionesHora} />
      <span aria-hidden="true">:</span>
      <Selector
        id={id + "-minutos"} etiqueta="Minutos" valor={minutos} onCambiar={cambiarMinutos}
        opciones={MINUTOS.map(m => ({ valor: m, texto: m }))} deshabilitado={hora === ""}
      />
    </div>
  );
}
