import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Título de la pestaña del navegador según la primera parte de la dirección
const TITULOS = {
  "": "Buscar viaje",
  login: "Ingresar",
  registro: "Crear cuenta",
  resultados: "Viajes disponibles",
  viaje: "Detalle del viaje",
  reserva: "Mi reserva",
  chat: "Chat",
  calificar: "Calificar viaje",
  "mis-reservas": "Mis reservas",
  "mis-viajes": "Mis viajes",
  publicar: "Publicar viaje",
  solicitudes: "Solicitudes",
  avisos: "Avisos",
  perfil: "Mi perfil"
};

// Se usa una sola vez, en App: cambia document.title en cada pantalla
export function useTituloDePagina() {
  const { pathname } = useLocation();
  const titulo = TITULOS[pathname.split("/")[1]];

  useEffect(() => {
    document.title = titulo ? titulo + " · PoolUCC" : "PoolUCC";
  }, [titulo]);
}
