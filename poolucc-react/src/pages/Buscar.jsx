import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import { useUbicacion } from "../hooks/useUbicacion";
import CampoSalida from "../components/CampoSalida";
import ChipEstado from "../components/ChipEstado";
import Mapa from "../components/Mapa";
import { sedes, MI_UBICACION } from "../data/datos";
import { coordenadasDeSalida, buscarLugar } from "../utils/geo";

const FILTROS = ["Hoy", "Mañana", "Mi grado", "Recurrentes"];

export default function Buscar() {
  const { user } = useAuth();
  const { misReservas, buscarViaje } = useDatos();
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

  // Próximo viaje: la primera reserva pendiente o confirmada
  const proxima = misReservas.find(r => r.estado === "pendiente" || r.estado === "confirmada");
  const viajeProximo = proxima ? buscarViaje(proxima.idViaje) : null;

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
    <main>
      <header className="hero">
        <div className="hero-fila">
          <p className="logo">Pool<span>UCC</span></p>
          <Link className="avatar" to="/perfil" title="Ir a mi perfil">{user.iniciales}</Link>
        </div>
        <p className="hero-fecha">{hoy[0].toUpperCase() + hoy.slice(1)}</p>
        <h1>Hola, {user.nombre.split(" ")[0]}</h1>
      </header>

      <section className="contenido inicio-grilla">
        <div className="columna area-buscar">
          <form className="tarjeta" onSubmit={buscar}>
            <CampoSalida
              id="desde" etiqueta="Desde" valor={desde} onCambiar={setDesde} estado={estado}
              onPedirUbicacion={() => pedirUbicacion(() => setDesde(MI_UBICACION))}
            />

            <div className="campo">
              <label htmlFor="hasta">Hasta (sede)</label>
              <select id="hasta" value={hasta} onChange={e => setHasta(e.target.value)}>
                {sedes.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
              </select>
            </div>

            <div className="fila">
              <div className="campo">
                <label htmlFor="hora">Salir desde las</label>
                <input type="time" id="hora" value={hora} onChange={e => setHora(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="plazas">Plazas</label>
                <select id="plazas" value={plazas} onChange={e => setPlazas(e.target.value)}>
                  {["1", "2", "3", "4"].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <fieldset>
              <legend>Filtrar viajes</legend>
              <div className="opciones">
                {FILTROS.map(f => (
                  <label key={f}>
                    <input type="radio" name="filtro" value={f} checked={filtro === f} onChange={() => setFiltro(f)} /> {f}
                  </label>
                ))}
              </div>
            </fieldset>

            {error && <p className="mensaje-error">{error}</p>}
            <button className="boton" type="submit">Buscar</button>
          </form>
        </div>

        <Mapa className="area-mapa" puntos={puntos} titulo="Mapa de tu salida y la sede" />

        <div className="columna area-lateral">
          {viajeProximo && (
            <Link className="tarjeta tarjeta-enlace tarjeta-oscura" to={`/reserva/${proxima.id}`}>
              <div className="fila-titulo">
                <p>Tu próximo viaje</p>
                <ChipEstado estado={proxima.estado} />
              </div>
              <h2 className="cifra-blanca">{viajeProximo.desde} → {viajeProximo.hasta}</h2>
              <p>{viajeProximo.dia} · {viajeProximo.salida} · con {viajeProximo.conductor}</p>
            </Link>
          )}

          <Link className="tarjeta tarjeta-enlace tarjeta-acento" to="/publicar">
            <h2>¿Manejás vos?</h2>
            <p className="texto-suave">Publicá tu ruta en un minuto</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
