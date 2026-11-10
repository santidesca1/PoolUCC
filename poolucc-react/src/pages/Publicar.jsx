import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatos } from "../hooks/useDatos";
import { useUbicacion } from "../hooks/useUbicacion";
import BarraTitulo from "../components/BarraTitulo";
import CampoSalida from "../components/CampoSalida";
import Dialogo from "../components/Dialogo";
import { sedes, MI_UBICACION } from "../data/datos";
import { coordenadasDeSalida } from "../utils/geo";
import { fechaLocalISO, etiquetaDia } from "../utils/fechas";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function Publicar() {
  const { publicarViaje } = useDatos();
  const { ubicacion, estado, pedirUbicacion } = useUbicacion();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    desde: "", hasta: sedes[0].nombre, modo: "dia", fecha: "", diaSemana: "Viernes",
    hora: "14:00", plazas: "2", cobro: "persona", precio: "2500", autoAceptar: true, sinFumar: true
  });
  const [error, setError] = useState("");
  const [publicado, setPublicado] = useState(false);

  // Sirve para inputs de texto, selects, radios y checkboxes
  const cambiar = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const publicar = e => {
    e.preventDefault();
    const plazas = Number(form.plazas);
    let precio = Number(form.precio);
    // Fecha y hora de ahora en hora local (no UTC): "2026-11-10" y "23:15"
    const ahora = new Date();
    const hoy = fechaLocalISO(ahora);
    const horaActual = String(ahora.getHours()).padStart(2, "0") + ":" + String(ahora.getMinutes()).padStart(2, "0");

    if (form.desde.trim().toLowerCase() === form.hasta.toLowerCase()) return setError("La salida y la llegada no pueden ser la misma sede.");
    if (!(precio > 0)) return setError("Poné un precio mayor a $0.");
    if (precio > 50000) return setError("El precio es solo para cubrir gastos: máximo $50.000.");
    if (form.modo === "dia" && form.fecha === "") return setError("Elegí la fecha del viaje.");
    if (form.modo === "dia" && form.fecha < hoy) return setError("Elegí una fecha que todavía no pasó.");
    if (form.modo === "dia" && form.fecha === hoy && form.hora <= horaActual) return setError("Esa hora ya pasó. Elegí un horario más tarde.");

    // Si cobra "por viaje", lo dividimos entre las plazas para mostrar el precio por persona
    if (form.cobro === "viaje") precio = Math.round(precio / plazas);

    const semanal = form.modo === "semana";
    const punto = coordenadasDeSalida(form.desde, ubicacion);
    publicarViaje({
      desde: form.desde === MI_UBICACION ? "Ubicación del conductor" : form.desde.trim(),
      hasta: form.hasta,
      lat: punto ? punto.lat : null,
      lon: punto ? punto.lon : null,
      // Se guarda la fecha real; "Hoy", "Mañana" o "30/10" se calcula al mostrarla (ver DatosProvider)
      fecha: semanal ? null : form.fecha,
      semanal,
      diaSemana: semanal ? form.diaSemana : null,
      dia: semanal ? "Cada " + form.diaSemana.toLowerCase() : etiquetaDia(form.fecha),
      salida: form.hora,
      plazas,
      precio,
      preferencias: form.sinFumar ? ["Sin fumar"] : [],
      autoAceptar: form.autoAceptar
    });
    setError("");
    setPublicado(true);
  };

  return (
    <main className="estrecho">
      <BarraTitulo volverA="/mis-viajes" textoVolver="Mis viajes" titulo="Publicar viaje" />

      <form className="contenido" onSubmit={publicar}>
        <fieldset className="tarjeta">
          <legend>Ruta</legend>
          <CampoSalida
            id="desde" etiqueta="Salida" valor={form.desde} estado={estado}
            onCambiar={valor => setForm({ ...form, desde: valor })}
            onPedirUbicacion={() => pedirUbicacion(() => setForm(f => ({ ...f, desde: MI_UBICACION })))}
          />
          <div className="campo">
            <label htmlFor="hasta">Llegada (sede)</label>
            <select id="hasta" name="hasta" value={form.hasta} onChange={cambiar}>
              {sedes.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
            </select>
          </div>

          <div className="opciones">
            <label><input type="radio" name="modo" value="dia" checked={form.modo === "dia"} onChange={cambiar} /> Un día</label>
            <label><input type="radio" name="modo" value="semana" checked={form.modo === "semana"} onChange={cambiar} /> Cada semana</label>
          </div>

          <div className="fila">
            {/* Renderizado condicional: se muestra la fecha o el día según el modo */}
            {form.modo === "dia" ? (
              <div className="campo">
                <label htmlFor="fecha">Fecha</label>
                <input type="date" id="fecha" name="fecha" min={fechaLocalISO()} value={form.fecha} onChange={cambiar} />
              </div>
            ) : (
              <div className="campo">
                <label htmlFor="diaSemana">Todos los</label>
                <select id="diaSemana" name="diaSemana" value={form.diaSemana} onChange={cambiar}>
                  {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}
            <div className="campo">
              <label htmlFor="hora">Horario</label>
              <input type="time" id="hora" name="hora" value={form.hora} onChange={cambiar} required />
            </div>
          </div>
        </fieldset>

        <fieldset className="tarjeta">
          <legend>Lugares disponibles</legend>
          <div className="opciones">
            {["1", "2", "3", "4"].map(n => (
              <label key={n}><input type="radio" name="plazas" value={n} checked={form.plazas === n} onChange={cambiar} /> {n}</label>
            ))}
          </div>
        </fieldset>

        <fieldset className="tarjeta">
          <legend>Cobro</legend>
          <div className="opciones">
            <label><input type="radio" name="cobro" value="persona" checked={form.cobro === "persona"} onChange={cambiar} /> Por persona</label>
            <label><input type="radio" name="cobro" value="viaje" checked={form.cobro === "viaje"} onChange={cambiar} /> Por viaje</label>
          </div>
          <div className="campo">
            <label htmlFor="precio">Precio ($)</label>
            <input type="number" id="precio" name="precio" min="0" max="50000" step="500" value={form.precio} onChange={cambiar} required />
            <small className="ayuda">Solo para cubrir gastos</small>
          </div>
        </fieldset>

        <fieldset className="tarjeta">
          <legend>Preferencias</legend>
          <div className="opciones opciones-columna">
            <label><input type="checkbox" name="autoAceptar" checked={form.autoAceptar} onChange={cambiar} /> Aceptar pedidos automáticamente</label>
            <label><input type="checkbox" name="sinFumar" checked={form.sinFumar} onChange={cambiar} /> Sin fumar en el auto</label>
          </div>
          <small className="ayuda">Si no aceptás automáticamente, cada pedido te llega a Solicitudes para que lo apruebes.</small>
        </fieldset>

        {error && <p className="mensaje-error">{error}</p>}
        <button className="boton" type="submit">Publicar viaje</button>
      </form>

      <Dialogo
        abierto={publicado}
        titulo="¡Viaje publicado!"
        texto="Tus compañeros ya lo pueden ver y pedir lugar."
        onAceptar={() => navigate("/mis-viajes")}
      />
    </main>
  );
}
