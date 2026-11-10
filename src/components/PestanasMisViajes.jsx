import { NavLink } from "react-router-dom";

// Pestañas "Próximos / Realizados" de Mis viajes
export default function PestanasMisViajes({ proximos, realizados }) {
  const clase = ({ isActive }) => (isActive ? "activa" : "");
  return (
    <div className="pestanas">
      <NavLink to="/mis-viajes" end className={clase}>Próximos ({proximos})</NavLink>
      <NavLink to="/mis-viajes/realizados" className={clase}>Realizados ({realizados})</NavLink>
    </div>
  );
}
