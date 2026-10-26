import { Link } from "react-router-dom";
import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import ListaVacia from "../components/ListaVacia";

function formatearFecha(iso) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export default function Avisos() {
  const { misAvisos, avisosSinLeer, marcarAvisosLeidos } = useDatos();
  // Los más nuevos arriba (slice hace una copia, así reverse no cambia el original)
  const ordenados = misAvisos.slice().reverse();

  return (
    <main className="estrecho">
      <BarraTitulo titulo="Avisos" subtitulo={avisosSinLeer > 0 ? `${avisosSinLeer} sin leer` : "Estás al día"}>
        {avisosSinLeer > 0 && (
          <button className="boton boton-borde boton-chico" type="button" onClick={marcarAvisosLeidos}>Marcar como leídos</button>
        )}
      </BarraTitulo>

      <section className="contenido">
        {ordenados.length === 0 && (
          <ListaVacia titulo="No tenés avisos" texto="Acá te avisamos cuando respondan tus pedidos, te escriban o cambie un viaje." />
        )}
        {ordenados.map(a => (
          <Link key={a.id} to={a.link} className={"tarjeta tarjeta-enlace aviso" + (a.leido ? "" : " aviso-nuevo")}>
            {!a.leido && <span className="punto-nuevo" aria-label="Sin leer" />}
            <p>
              {a.texto}
              <time dateTime={a.fecha}>{formatearFecha(a.fecha)}</time>
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
