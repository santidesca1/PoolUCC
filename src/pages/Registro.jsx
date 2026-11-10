import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";
import Pie from "../components/Pie";

const CARRERAS = ["Ingeniería Informática", "Abogacía", "Arquitectura", "Ciencias Económicas", "Medicina", "Psicología"];

export default function Registro() {
  const { registrar, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Un solo estado para todo el formulario
  const [form, setForm] = useState({ nombre: "", email: "", carrera: CARRERAS[0], password: "", password2: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/" replace />;

  const cambiar = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    try {
      registrar(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <main className="estrecho">
        <header className="hero">
          <Logo />
          <h1>Creá tu cuenta</h1>
          <p>Con tu correo de la UCC</p>
        </header>

        <form className="contenido" onSubmit={handleSubmit}>
          <div className="tarjeta">
            <div className="campo">
              <label htmlFor="nombre">Nombre y apellido</label>
              <input type="text" id="nombre" name="nombre" maxLength={40} value={form.nombre} onChange={cambiar} required />
            </div>
            <div className="campo">
              <label htmlFor="email">Correo institucional</label>
              <input type="email" id="email" name="email" placeholder="tunombre@ucc.edu.ar" value={form.email} onChange={cambiar} required />
            </div>
            <div className="campo">
              <label htmlFor="carrera">Carrera</label>
              <select id="carrera" name="carrera" value={form.carrera} onChange={cambiar}>
                {CARRERAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="fila">
              <div className="campo">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" value={form.password} onChange={cambiar} required />
              </div>
              <div className="campo">
                <label htmlFor="password2">Repetila</label>
                <input type="password" id="password2" name="password2" value={form.password2} onChange={cambiar} required />
              </div>
            </div>
            <small className="ayuda">Es una demo: la contraseña se guarda en este navegador. No uses una contraseña real.</small>
            {error && <p className="mensaje-error">{error}</p>}
            <button className="boton" type="submit">Crear cuenta</button>
            <p className="texto-suave texto-centrado">
              ¿Ya tenés cuenta? <Link className="volver" to="/login">Iniciá sesión</Link>
            </p>
          </div>
        </form>
      </main>
      <Pie />
    </>
  );
}
