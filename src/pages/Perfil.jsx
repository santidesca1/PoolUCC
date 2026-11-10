import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDatos } from "../hooks/useDatos";
import { useTema } from "../hooks/useTema";
import BarraTitulo from "../components/BarraTitulo";
import Dialogo from "../components/Dialogo";
import { formatearPrecio } from "../utils/formato";
import { borrarGuardado } from "../utils/almacenamiento";

export default function Perfil() {
  const { user, logout, reiniciarCuentas } = useAuth();
  const { misReservas, misViajes, reservasDeViaje, reiniciarDatos } = useDatos();
  const { tema, setTema } = useTema();
  const navigate = useNavigate();
  const [vista, setVista] = useState("pasajero");
  const [confirmando, setConfirmando] = useState(false);

  // Como pasajero
  const realizadas = misReservas.filter(r => r.estado === "realizada");
  const pagado = misReservas
    .filter(r => r.estado === "confirmada" || r.estado === "realizada")
    .reduce((suma, r) => suma + r.total, 0);

  // Como conductor
  const publicados = misViajes.filter(v => !v.realizado);
  const lugaresLibres = publicados.reduce((suma, v) => suma + v.plazas, 0);
  const generado = misViajes
    .filter(v => v.realizado)
    .reduce((suma, v) => suma + reservasDeViaje(v.id).filter(r => r.estado === "realizada").reduce((s, r) => s + r.total, 0), 0);

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  const reiniciarDemo = () => {
    reiniciarDatos();
    borrarGuardado("poolucc-ubicacion");
    reiniciarCuentas();
    navigate("/login");
  };

  return (
    <main className="estrecho">
      <BarraTitulo titulo="Perfil" />

      <header className="contenido">
        <div className="viaje-cabecera">
          <span className="avatar avatar-grande">{user.iniciales}</span>
          <div>
            <h2>{user.nombre}</h2>
            <p className="texto-suave">{user.carrera}</p>
          </div>
        </div>
        <ul className="etiquetas">
          <li className="etiqueta etiqueta-verde">✓ Correo UCC verificado</li>
        </ul>
      </header>

      <section className="contenido">
        <fieldset>
          <legend>Ver perfil como</legend>
          <div className="opciones">
            <label><input type="radio" name="vista" checked={vista === "pasajero"} onChange={() => setVista("pasajero")} /> Pasajero</label>
            <label><input type="radio" name="vista" checked={vista === "conductor"} onChange={() => setVista("conductor")} /> Conductor</label>
          </div>
        </fieldset>

        {vista === "pasajero" ? (
          <>
            <div className="tarjeta estadisticas">
              <div><p className="texto-suave">Reservas</p><p className="cifra">{misReservas.length}</p></div>
              <div><p className="texto-suave">Viajes hechos</p><p className="cifra">{realizadas.length}</p></div>
            </div>
            <div className="tarjeta tarjeta-acento">
              <p className="texto-suave">Pagaste en total</p>
              <p className="cifra">{formatearPrecio(pagado)}</p>
              <p className="texto-suave">compartiendo el viaje con compañeros</p>
            </div>
          </>
        ) : (
          <>
            <div className="tarjeta estadisticas">
              <div><p className="texto-suave">Viajes publicados</p><p className="cifra">{publicados.length}</p></div>
              <div><p className="texto-suave">Lugares libres</p><p className="cifra">{lugaresLibres}</p></div>
            </div>
            <div className="tarjeta tarjeta-acento">
              <p className="texto-suave">Generaste en total</p>
              <p className="cifra">{formatearPrecio(generado)}</p>
              <p className="texto-suave">para cubrir los gastos de tus viajes</p>
            </div>
          </>
        )}

        <ul className="tarjeta datos">
          <li><span>Correo</span> <span>{user.email}</span></li>
          <li><span>Verificación</span> <span>Correo UCC</span></li>
          <li><span>Pagos</span> <span>Efectivo o transferencia</span></li>
        </ul>

        <label className="tarjeta interruptor" htmlFor="modoOscuro">
          <span className="boton-icono"><Moon size={18} aria-hidden="true" /> Modo oscuro</span>
          <input type="checkbox" id="modoOscuro" checked={tema === "oscuro"} onChange={e => setTema(e.target.checked ? "oscuro" : "claro")} />
        </label>

        <button className="boton boton-borde boton-icono" type="button" onClick={cerrarSesion}><LogOut size={18} aria-hidden="true" /> Cerrar sesión</button>
        <button className="boton boton-peligro" type="button" onClick={() => setConfirmando(true)}>Reiniciar demo (borra todos los datos)</button>
      </section>

      <Dialogo
        abierto={confirmando}
        titulo="¿Reiniciar la demo?"
        texto="Se borran las cuentas creadas, los viajes publicados, las reservas, los avisos y los chats."
        textoAceptar="Sí, borrar todo"
        peligro
        onAceptar={reiniciarDemo}
        onCancelar={() => setConfirmando(false)}
      />
    </main>
  );
}
