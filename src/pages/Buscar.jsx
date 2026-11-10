import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Check, ChevronRight, Car } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUbicacion } from "../hooks/useUbicacion";
import CampoSalida from "../components/CampoSalida";
import CampanaAvisos from "../components/CampanaAvisos";
import CampoHora from "../components/CampoHora";
import Logo from "../components/Logo";
import Mapa from "../components/Mapa";
import Selector from "../components/Selector";
import { sedes, MI_UBICACION } from "../data/datos";
import { coordenadasDeSalida, buscarLugar } from "../utils/geo";

const FILTROS = ["Hoy", "Mañana", "Mi grado", "Recurrentes"];

export default function Buscar() {
  const { user } = useAuth();
  const { ubicacion, estado, pedirUbicacion } = useUbicacion();
  const navigate = useNavigate();

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState(sedes[0].nombre);
  const [hora, setHora] = useState("");
  const [plazas, setPlazas] = useState("1");
  const [filtro, setFiltro] = useState("Hoy");
  const [error, setError] = useState("");

  // La fecha de hoy se calcula una sola vez (no en cada render)
  const [hoy] = useState(() => new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date()));

  // Puntos del mapa: desde dónde salgo y la sede elegida
  const puntos = [];
  const salida = coordenadasDeSalida(desde, ubicacion);
  if (salida) puntos.push({ ...salida, tipo: "usuario", etiqueta: "Tu salida" });
  const sede = buscarLugar(hasta);
  if (sede) puntos.push({ lat: sede.lat, lon: sede.lon, tipo: "sede", etiqueta: sede.nombre });

  const buscar = e => {
    e.preventDefault();
    if (desde.trim().toLowerCase() === hasta.toLowerCase()) {
      setError("Ya estás en esa sede: elegí otra sede de llegada.");
      return;
    }
    const params = new URLSearchParams({ desde: desde.trim(), hasta, plazas, filtro, hora });
    navigate("/resultados?" + params.toString());
  };

  return (
    <main className="pantalla-mapa">
      <div className="zona-mapa">
        <Mapa puntos={puntos} titulo="Mapa de tu salida y la sede" />
        <p className="flotante-izq logo-flotante"><Logo /></p>
        <div className="flotante-der"><CampanaAvisos flotante /></div>
      </div>

      <div className="hoja">
        <p className="texto-suave hoja-saludo">
          Hola, {user.nombre.split(" ")[0]} · {hoy[0].toUpperCase() + hoy.slice(1)}
        </p>
        <h1>¿A qué sede vas?</h1>

        <form className="columna" onSubmit={buscar}>
          <CampoSalida
            id="desde" etiqueta="Salgo desde" valor={desde} onCambiar={setDesde} estado={estado}
            onPedirUbicacion={() => pedirUbicacion(() => setDesde(MI_UBICACION))}
          />

          <fieldset>
            <legend>Sede de llegada</legend>
            <div className="lista-sedes">
              {sedes.map(s => (
                <label key={s.nombre} className={"sede-fila" + (hasta === s.nombre ? " elegida" : "")}>
                  <input type="radio" name="hasta" value={s.nombre} checked={hasta === s.nombre} onChange={() => setHasta(s.nombre)} />
                  <span className="sede-icono"><Building2 size={18} aria-hidden="true" /></span>
                  <span className="sede-nombre">{s.nombre}</span>
                  <Check className="sede-check" size={20} aria-hidden="true" />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="oculto">Filtrar viajes</legend>
            <div className="chips">
              {FILTROS.map(f => (
                <label key={f} className={"chip" + (filtro === f ? " elegido" : "")}>
                  <input type="radio" name="filtro" value={f} checked={filtro === f} onChange={() => setFiltro(f)} />
                  {f}
                </label>
              ))}
            </div>
          </fieldset>

          <details className="mas-opciones">
            <summary>Hora y cantidad de lugares</summary>
            <div className="fila">
              <div className="campo">
                <label htmlFor="hora">Salir desde las</label>
                <CampoHora id="hora" valor={hora} onCambiar={setHora} opcional />
              </div>
              <div className="campo">
                <label htmlFor="plazas">Lugares</label>
                <Selector id="plazas" valor={plazas} onCambiar={setPlazas}
                  opciones={["1", "2", "3", "4"].map(n => ({ valor: n, texto: n }))} />
              </div>
            </div>
          </details>

          {error && <p className="mensaje-error">{error}</p>}
          <button className="boton" type="submit">Buscar viajes</button>
        </form>

        <Link className="fila-viaje" to="/publicar">
          <span className="sede-icono"><Car size={18} aria-hidden="true" /></span>
          <div className="fila-viaje-info">
            <h2>¿Manejás vos?</h2>
            <p>Publicá tu ruta en un minuto</p>
          </div>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
