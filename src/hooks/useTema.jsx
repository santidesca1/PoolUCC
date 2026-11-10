import { useEffect, useState } from "react";

const CLAVE = "poolucc-tema";

// Lo usa main.jsx antes de dibujar, para que la página no parpadee en claro
export function temaGuardado() {
  return localStorage.getItem(CLAVE) === "oscuro" ? "oscuro" : "claro";
}

// Modo claro / oscuro: guarda la preferencia y pone data-theme en <html>
export function useTema() {
  const [tema, setTema] = useState(temaGuardado);

  useEffect(() => {
    localStorage.setItem(CLAVE, tema);
    if (tema === "oscuro") {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [tema]);

  return { tema, setTema };
}
