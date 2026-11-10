import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import { useUbicacion } from "../hooks/useUbicacion";
import BarraTitulo from "../components/BarraTitulo";
import TarjetaViaje from "../components/TarjetaViaje";
import ListaVacia from "../components/ListaVacia";
import Mapa from "../components/Mapa";
import Selector from "../components/Selector";
import { sedes } from "../data/datos";
import { coordenadasDeSalida, distanciaKm, buscarLugar } from "../utils/geo";
import { textoPlazas } from "../utils/formato";
import { fechaLocalISO, nombreDia } from "../utils/fechas";

/** Dice si un viaje corresponde al tipo elegido en "Mostrar". Los semanales cuentan en su día. */
function cumpleTipo(v, tipo) {
  const diaSemanal = v.semanal ? v.diaSemana.toLowerCase() : "";
  switch (tipo) {
    case "Hoy": return v.dia === "Hoy" || diaSemanal === nombreDia(0);
    case "Mañana": return v.dia === "Mañana" || diaSemanal === nombreDia(1);
    case "Mi grado": return v.etiqueta === "Mismo grado";
    case "Recurrentes": return v.etiqueta === "Recurrente" || v.semanal === true;
    default: return true;
  }
}

// Botones para ordenar la lista (el de cercanía necesita saber desde dónde salís)
const ORDENES = [
  { valor: "cercania", texto: "Más cerca" },
  { valor: "horario", texto: "Horario" },
  { valor: "precioMenor", texto: "Precio" },
  { valor: "puntaje", texto: "Puntaje" }
];

export default function Resultados() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { viajes } = useDatos();
  const { ubicacion } = useUbicacion();

  // Lo que vino del buscador (puede no venir nada si entró directo)
  const desde = params.get("desde") || "";
  const plazasBuscadas = Number(params.get("plazas") || 1);
  const hora = params.get("hora") || "";
  const origen = coordenadasDeSalida(desde, ubicacion);

  const [sede, setSede] = useState(params.get("hasta") || "Todas");
  const [precioMaximo, setPrecioMaximo] = useState("");
  const [tipo, setTipo] = useState(params.get("filtro") || "Todos");
  const [orden, setOrden] = useState(origen ? "cercania" : "horario");
  const [soloConLugares, setSoloConLugares] = useState(params.has("plazas"));
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const distanciaDe = v => (origen === null || v.lat === null ? Infinity : distanciaKm(origen, v));

  // No aparecen: los viajes del usuario, los cancelados, los ya hechos ni los de una fecha que ya pasó
  const hoy = fechaLocalISO();
  let resultado = viajes.filter(v =>
    v.conductorEmail !== user.email && !v.cancelado && !v.realizado && !(v.fecha && v.fecha < hoy)
  );
  if (sede !== "Todas") resultado = resultado.filter(v => v.hasta === sede);
  if (precioMaximo !== "") resultado = resultado.filter(v => v.precio <= Number(precioMaximo));
  if (hora !== "") resultado = resultado.filter(v => v.salida >= hora);
  resultado = resultado.filter(v => cumpleTipo(v, tipo));
  if (soloConLugares) resultado = resultado.filter(v => v.plazas >= plazasBuscadas);

  // sort ordena el mismo array; por eso trabajamos sobre la copia que hizo filter
  if (orden === "cercania") resultado.sort((a, b) => distanciaDe(a) - distanciaDe(b));
  else if (orden === "precioMenor") resultado.sort((a, b) => a.precio - b.precio);
  else if (orden === "puntaje") resultado.sort((a, b) => b.puntaje - a.puntaje);
  else resultado.sort((a, b) => (a.salida < b.salida ? -1 : 1));

  // Mapa: mi salida, un punto por viaje y la sede elegida
  const puntos = [];
  if (origen) puntos.push({ ...origen, tipo: "usuario", etiqueta: "Tu salida" });
  resultado.forEach(v => {
    if (v.lat !== null) puntos.push({ lat: v.lat, lon: v.lon, tipo: "viaje", etiqueta: `${v.conductor} · ${v.salida}` });
  });
  const lugarSede = buscarLugar(sede);
  if (lugarSede) puntos.push({ lat: lugarSede.lat, lon: lugarSede.lon, tipo: "sede", etiqueta: lugarSede.nombre });

  const resumen = desde ? `${desde} → ${params.get("hasta")} · ${textoPlazas(plazasBuscadas)}` : "Todos los viajes";

  return (
    <main>
      <BarraTitulo volverA="/" textoVolver="Volver a buscar" titulo="Viajes disponibles" subtitulo={resumen} />

      <section className="contenido dos-columnas">
        <div className="columna">
          <div className="chips" role="group" aria-label="Ordenar por">
            {ORDENES.map(o => (
              <button key={o.valor} type="button" className={"chip" + (orden === o.valor ? " elegido" : "")}
                aria-pressed={orden === o.valor} disabled={o.valor === "cercania" && origen === null}
                title={o.valor === "cercania" && origen === null ? "Indicá desde dónde salís para ordenar por cercanía" : undefined}
                onClick={() => setOrden(o.valor)}>
                {o.texto}
              </button>
            ))}
          </div>

          <div className="fila-titulo">
            <h2>{resultado.length === 0 ? "Sin resultados" : resultado.length + (resultado.length === 1 ? " viaje" : " viajes")}</h2>
            <button className="boton boton-borde boton-chico boton-icono boton-filtros" type="button" onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}>
              <SlidersHorizontal size={16} aria-hidden="true" /> {filtrosAbiertos ? "Cerrar filtros" : "Filtros y orden"}
            </button>
          </div>

          <form className={"filtros columna" + (filtrosAbiertos ? " abierto" : "")} onSubmit={e => e.preventDefault()}>
            <div className="campo">
              <label htmlFor="filtroSede">Sede de llegada</label>
              <Selector id="filtroSede" valor={sede} onCambiar={setSede}
                opciones={[{ valor: "Todas", texto: "Todas las sedes" }, ...sedes.map(s => ({ valor: s.nombre, texto: s.nombre }))]} />
            </div>
            <div className="fila">
              <div className="campo">
                <label htmlFor="precioMaximo">Precio máximo</label>
                <input type="number" id="precioMaximo" min="0" step="500" placeholder="Sin límite" value={precioMaximo} onChange={e => setPrecioMaximo(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="tipo">Mostrar</label>
                <Selector id="tipo" valor={tipo} onCambiar={setTipo}
                  opciones={["Todos", "Hoy", "Mañana", "Mi grado", "Recurrentes"].map(t => ({ valor: t, texto: t }))} />
              </div>
            </div>
            <div className="opciones">
              <label>
                <input type="checkbox" checked={soloConLugares} onChange={e => setSoloConLugares(e.target.checked)} />
                Solo con {plazasBuscadas === 1 ? "1 lugar libre" : plazasBuscadas + " lugares libres"}
              </label>
            </div>
            {hora && <p className="ayuda">Mostrando viajes que salen desde las {hora}.</p>}
          </form>

          {resultado.length === 0 ? (
            <ListaVacia titulo="No encontramos viajes" texto="Probá con otra sede, otro horario o sacá algún filtro." />
          ) : (
            <div className="columna">
              {resultado.map(v => <TarjetaViaje key={v.id} viaje={v} distancia={distanciaDe(v)} />)}
            </div>
          )}
        </div>

        <Mapa className="mapa-franja" puntos={puntos} titulo="Mapa de los viajes encontrados" />
      </section>
    </main>
  );
}
