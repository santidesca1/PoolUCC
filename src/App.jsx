import { Routes, Route, Navigate } from "react-router-dom";
import { useTituloDePagina } from "./hooks/useTituloDePagina";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Buscar from "./pages/Buscar";
import Resultados from "./pages/Resultados";
import DetalleViaje from "./pages/DetalleViaje";
import Reserva from "./pages/Reserva";
import Chat from "./pages/Chat";
import Calificar from "./pages/Calificar";
import MisReservas from "./pages/MisReservas";
import MisViajes from "./pages/MisViajes";
import MisViajesRealizados from "./pages/MisViajesRealizados";
import Publicar from "./pages/Publicar";
import Solicitudes from "./pages/Solicitudes";
import Avisos from "./pages/Avisos";
import Perfil from "./pages/Perfil";

export default function App() {
  useTituloDePagina();

  return (
    <Routes>
      {/* Sin sesión */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Con sesión: todas comparten el menú (Layout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Buscar />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/viaje/:id" element={<DetalleViaje />} />
          <Route path="/reserva/:id" element={<Reserva />} />
          <Route path="/chat/:idViaje" element={<Chat />} />
          <Route path="/calificar/:id" element={<Calificar />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/mis-viajes" element={<MisViajes />} />
          <Route path="/mis-viajes/realizados" element={<MisViajesRealizados />} />
          <Route path="/publicar" element={<Publicar />} />
          <Route path="/solicitudes/:idViaje" element={<Solicitudes />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
