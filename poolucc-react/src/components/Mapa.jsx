import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CORDOBA = [-31.42, -64.19];

// Mueve el mapa para que entren todos los puntos (MapContainer no se actualiza solo)
function AjustarVista({ puntos }) {
  const map = useMap();
  // Texto con todas las coordenadas: el efecto solo se repite cuando cambian los puntos
  const clave = puntos.map(p => p.lat + "," + p.lon).join(";");

  useEffect(() => {
    if (clave === "") return;
    const coords = clave.split(";").map(par => par.split(",").map(Number));
    if (coords.length === 1) {
      map.setView(coords[0], 14);
    } else {
      map.fitBounds(coords, { padding: [30, 30] });
    }
  }, [clave, map]);

  return null;
}

/**
 * Mapa de OpenStreetMap con puntos y, opcionalmente, una línea.
 * @param {Array} puntos - [{ lat, lon, tipo: "usuario" | "viaje" | "sede", etiqueta }]
 * @param {Array} linea - [[lat, lon], [lat, lon]] para dibujar un recorrido
 * Usamos CircleMarker (círculos) en vez de los íconos de Leaflet, que con Vite no cargan solos.
 * Los colores vienen del CSS (clases pin-*), así respetan el modo oscuro.
 */
export default function Mapa({ puntos = [], linea = null, className = "", titulo = "Mapa" }) {
  return (
    <div className={"mapa-leaflet " + className} role="region" aria-label={titulo}>
      <MapContainer center={CORDOBA} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {linea && <Polyline positions={linea} pathOptions={{ className: "linea-recorrido", weight: 4 }} />}
        {puntos.map((p, i) => (
          <CircleMarker
            key={i + "-" + p.lat + "-" + p.lon}
            center={[p.lat, p.lon]}
            radius={p.tipo === "usuario" ? 9 : 7}
            pathOptions={{ className: "pin-" + p.tipo, weight: 2, fillOpacity: 0.9 }}
          >
            {p.etiqueta && <Tooltip>{p.etiqueta}</Tooltip>}
          </CircleMarker>
        ))}
        <AjustarVista puntos={puntos} />
      </MapContainer>
    </div>
  );
}
