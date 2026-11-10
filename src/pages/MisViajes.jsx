import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useDatos } from "../hooks/useDatos";
import BarraTitulo from "../components/BarraTitulo";
import PestanasMisViajes from "../components/PestanasMisViajes";
import Recorrido from "../components/Recorrido";
import ListaVacia from "../components/ListaVacia";
import Dialogo from "../components/Dialogo";
import Mapa from "../components/Mapa";
import { buscarLugar } from "../utils/geo";
import { formatearPrecio, textoPlazas } from "../utils/formato";

export default function MisViajes() {
  const { misViajes, reservasDeViaje, finalizarViaje, eliminarViaje } = useDatos();
  // Qué confirmación está abierta: { tipo: "finalizar" | "eliminar", viaje }
  const [accion, setAccion] = useState(null);

  const proximos = misViajes.filter(v => !v.realizado);
  const realizados = misViajes.filter(v => v.realizado);

  // Mapa: salida del primer viaje y su sede
  const puntos = [];
  if (proximos.length > 0) {
    const v = proximos[0];
    const sede = buscarLugar(v.hasta);
    if (v.lat !== null) puntos.push({ lat: v.lat, lon: v.lon, tipo: "viaje", etiqueta: "Salida: " + v.desde });
    if (sede) puntos.push({ lat: sede.lat, lon: sede.lon, tipo: "sede", etiqueta: sede.nombre });
  }

  const confirmar = () => {
    if (accion.tipo === "finalizar") finalizarViaje(accion.viaje.id);
    else eliminarViaje(accion.viaje.id);
    setAccion(null);
  };

  return (
    <main>
      <BarraTitulo titulo="Mis viajes">
        <Link className="boton boton-borde boton-chico boton-icono" to="/publicar"><Plus size={16} aria-hidden="true" /> Publicar viaje</Link>
      </BarraTitulo>

      <section className="contenido dos-columnas">
        <div className="columna">
          <PestanasMisViajes proximos={proximos.length} realizados={realizados.length} />

          {proximos.length === 0 && (
            <ListaVacia titulo="Todavía no publicaste viajes" texto="Si vas a la facu en auto, compartí los lugares libres.">
              <Link className="boton" to="/publicar">Publicar mi primer viaje</Link>
            </ListaVacia>
          )}

          {proximos.map(v => {
            const reservas = reservasDeViaje(v.id);
            const pendientes = reservas.filter(r => r.estado === "pendiente").length;
            const confirmados = reservas.filter(r => r.estado === "confirmada").length;
            let estado = <span className="etiqueta etiqueta-gris">Publicado</span>;
            if (pendientes > 0) estado = <span className="etiqueta etiqueta-amarilla">{pendientes} por responder</span>;
            else if (v.plazas === 0) estado = <span className="etiqueta etiqueta-verde">Completo</span>;

            return (
              <article className="tarjeta tarjeta-sutil" key={v.id}>
                <div className="viaje-cabecera">
                  <p className="viaje-conductor"><strong>{v.dia} · {v.salida}</strong></p>
                  {v.autoAceptar && <span className="etiqueta">Acepta solo</span>}
                  {estado}
                </div>
                <Recorrido desde={v.desde === "Ubicación del conductor" ? "Tu ubicación" : v.desde} hasta={v.hasta} />
                <p className="texto-suave">
                  {formatearPrecio(v.precio)} por persona · {v.plazas === 0 ? "sin lugares libres" : textoPlazas(v.plazas) + (v.plazas === 1 ? " libre" : " libres")} · {confirmados} {confirmados === 1 ? "pasajero confirmado" : "pasajeros confirmados"}
                </p>
                <div className="acciones">
                  {pendientes > 0 && <Link className="boton boton-chico" to={`/solicitudes/${v.id}`}>Ver solicitudes</Link>}
                  {pendientes === 0 && reservas.length > 0 && <Link className="boton boton-borde boton-chico" to={`/solicitudes/${v.id}`}>Pasajeros</Link>}
                  <button className="boton boton-borde boton-chico" type="button" onClick={() => setAccion({ tipo: "finalizar", viaje: v })}>Finalizar viaje</button>
                  <button className="boton boton-peligro boton-chico" type="button" onClick={() => setAccion({ tipo: "eliminar", viaje: v })}>Cancelar viaje</button>
                </div>
              </article>
            );
          })}
        </div>

        <Mapa className="solo-escritorio mapa-alto" puntos={puntos} titulo="Mapa de tu próximo viaje" />
      </section>

      <Dialogo
        abierto={accion !== null}
        titulo={accion?.tipo === "finalizar" ? "¿Terminó el viaje?" : "¿Cancelar este viaje?"}
        texto={accion?.tipo === "finalizar"
          ? "Pasa a Realizados y les pedimos a tus pasajeros que lo califiquen."
          : "Les avisamos a los pasajeros que reservaron y sus reservas se cancelan."}
        textoAceptar={accion?.tipo === "finalizar" ? "Sí, terminó" : "Sí, cancelar"}
        peligro={accion?.tipo === "eliminar"}
        onAceptar={confirmar}
        onCancelar={() => setAccion(null)}
      />
    </main>
  );
}
