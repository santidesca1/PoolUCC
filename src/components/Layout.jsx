import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import Pie from "./Pie";

// Estructura común de todas las pantallas con sesión: la página, el menú y el pie.
export default function Layout() {
  return (
    <>
      <Outlet />
      <Menu />
      <Pie />
    </>
  );
}
