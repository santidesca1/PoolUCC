import { NavLink } from "react-router-dom";
import { Search, Car, Ticket, Bell, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";

// NavLink le pone la clase "activo" al link de la pantalla actual
const claseLink = ({ isActive }) => (isActive ? "activo" : "");

export default function Menu() {
  const { user } = useAuth();
  const { avisosSinLeer } = useDatos();

  return (
    <nav className="menu">
      <p className="logo menu-logo">Pool<span>UCC</span></p>
      <NavLink to="/" end className={claseLink}><Search size={18} aria-hidden="true" /> Buscar</NavLink>
      <NavLink to="/mis-viajes" className={claseLink}><Car size={18} aria-hidden="true" /> Ofrecer</NavLink>
      <NavLink to="/mis-reservas" className={claseLink}><Ticket size={18} aria-hidden="true" /> Reservas</NavLink>
      <NavLink to="/avisos" className={claseLink}>
        <span className="menu-icono">
          <Bell size={18} aria-hidden="true" />
          {avisosSinLeer > 0 && <span className="contador" aria-label={avisosSinLeer + " avisos sin leer"}>{avisosSinLeer}</span>}
        </span>
        Avisos
      </NavLink>
      <NavLink to="/perfil" className={({ isActive }) => "menu-perfil " + (isActive ? "activo" : "")}><User size={18} aria-hidden="true" /> Perfil</NavLink>
      <NavLink to="/perfil" className={({ isActive }) => "menu-usuario " + (isActive ? "activo" : "")} title="Mi perfil">
        <span className="avatar avatar-chico">{user.iniciales}</span> {user.nombre.split(" ")[0]}
      </NavLink>
    </nav>
  );
}
