import { useState } from "react";

const CLAVE = "poolucc-ubicacion";

function leerUbicacion() {
  const guardada = localStorage.getItem(CLAVE);
  return guardada ? JSON.parse(guardada) : null;
}

/**
 * Pide la ubicación al navegador (que le pregunta permiso al usuario) y la guarda.
 * Devuelve la última ubicación conocida, un mensaje de estado y la función para pedirla.
 */
export function useUbicacion() {
  const [ubicacion, setUbicacion] = useState(leerUbicacion);
  const [estado, setEstado] = useState("");

  const pedirUbicacion = alObtener => {
    if (!navigator.geolocation) {
      setEstado("Tu navegador no permite compartir la ubicación.");
      return;
    }
    setEstado("Buscando tu ubicación...");
    // getCurrentPosition recibe dos callbacks: uno si sale bien y otro si falla
    navigator.geolocation.getCurrentPosition(
      posicion => {
        const nueva = { lat: posicion.coords.latitude, lon: posicion.coords.longitude };
        localStorage.setItem(CLAVE, JSON.stringify(nueva));
        setUbicacion(nueva);
        setEstado("Listo: salís desde donde estás ahora.");
        if (alObtener) alObtener(nueva);
      },
      () => setEstado("No pudimos obtener tu ubicación. Revisá el permiso o escribí desde dónde salís.")
    );
  };

  return { ubicacion, estado, pedirUbicacion };
}
