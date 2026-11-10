import { useEffect, useState } from "react";

const CLAVE = "poolucc-tema";

// Lo usa main.jsx antes de dibujar, para que la página no parpadee en claro
export function temaGuardado() {
  try {
    return localStorage.getItem(CLAVE) === "oscuro" ? "oscuro" : "claro";
  } catch {
    return "claro"; // almacenamiento bloqueado: modo claro
  }
}

// Modo claro / oscuro: guarda la preferencia y pone data-theme en <html>
export function useTema() {
  const [tema, setTema] = useState(temaGuardado);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, tema);
    } catch {
      // No se pudo guardar: el tema igual se aplica, solo que no se recuerda
    }
    if (tema === "oscuro") {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [tema]);

  return { tema, setTema };
}
