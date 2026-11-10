import { NavLink } from "react-router-dom";
import { Search, Car, Ticket, Bell, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import Logo from "./Logo";

// NavLink le pone la clase "activo" al link de la pantalla actual
const claseLink = ({ isActive }) => (isActive ? "activo" : "");

// Celular: cuatro pestañas abajo. Escritorio: barra de arriba con logo, campana y usuario.
export default function Menu() {
  const { user } = useAuth();
  const { avisosSinLeer } = useDatos();

  return (
    <nav className="menu" aria-label="Menú principal">
      <span className="menu-logo"><Logo /></span>
      <NavLink to="/" end className={claseLink}><Search size={22} aria-hidden="true" /> Buscar</NavLink>
      <NavLink to="/mis-viajes" className={claseLink}><Car size={22} aria-hidden="true" /> Ofrecer</NavLink>
      <NavLink to="/mis-reservas" className={claseLink}><Ticket size={22} aria-hidden="true" /> Reservas</NavLink>
      <NavLink to="/perfil" className={({ isActive }) => "menu-perfil " + (isActive ? "activo" : "")}><User size={22} aria-hidden="true" /> Perfil</NavLink>
      <NavLink to="/avisos" className={({ isActive }) => "menu-campana " + (isActive ? "activo" : "")} aria-label="Avisos">
        <span className="menu-icono">
          <Bell size={20} aria-hidden="true" />
          {avisosSinLeer > 0 && <span className="contador" aria-label={avisosSinLeer + " avisos sin leer"}>{avisosSinLeer}</span>}
        </span>
      </NavLink>
      <NavLink to="/perfil" className={({ isActive }) => "menu-usuario " + (isActive ? "activo" : "")} title="Mi perfil">
        <span className="avatar avatar-chico">{user.iniciales}</span> {user.nombre.split(" ")[0]}
      </NavLink>
    </nav>
  );
}
