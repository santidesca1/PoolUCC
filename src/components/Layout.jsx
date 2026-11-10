import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import Pie from "./Pie";

// Estructura común de todas las pantallas con sesión: la página, el menú y el pie
// (el pie solo se ve en escritorio: en el celular queda el menú abajo).
export default function Layout() {
  return (
    <>
      <Outlet />
      <Menu />
      <div className="pie-escritorio"><Pie /></div>
    </>
  );
}
