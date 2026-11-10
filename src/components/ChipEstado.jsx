import { Clock, CheckCircle2, XCircle, Ban, Flag } from "lucide-react";

// Cada estado de una reserva con su color e ícono
const ESTADOS = {
  pendiente: { texto: "Pendiente", clase: "etiqueta-amarilla", Icono: Clock },
  confirmada: { texto: "Confirmada", clase: "etiqueta-verde", Icono: CheckCircle2 },
  rechazada: { texto: "Rechazada", clase: "etiqueta-roja", Icono: XCircle },
  cancelada: { texto: "Cancelada", clase: "etiqueta-gris", Icono: Ban },
  realizada: { texto: "Realizada", clase: "etiqueta-gris", Icono: Flag }
};

export default function ChipEstado({ estado }) {
  const { texto, clase, Icono } = ESTADOS[estado];
  return (
    <span className={"etiqueta etiqueta-icono " + clase}>
      <Icono size={13} aria-hidden="true" /> {texto}
    </span>
  );
}
