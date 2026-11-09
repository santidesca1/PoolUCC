import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Pie from "../components/Pie";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = e => {
    e.preventDefault();
    try {
      login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <main className="estrecho">
        <header className="hero hero-centrado">
          <p className="logo logo-login">Pool<span>UCC</span></p>
          <h1>Viajá con tus compañeros</h1>
          <p>Solo para estudiantes con correo de la UCC</p>
        </header>

        <form className="contenido" onSubmit={handleSubmit}>
          <div className="tarjeta">
            <div className="campo">
              <label htmlFor="email">Correo institucional</label>
              <input type="email" id="email" placeholder="tunombre@ucc.edu.ar" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="campo">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="mensaje-error">{error}</p>}
            <button className="boton" type="submit">Ingresar</button>
            <p className="texto-suave texto-centrado">
              ¿No tenés cuenta? <Link className="volver" to="/registro">Creá una</Link>
            </p>
          </div>

          <div className="tarjeta tarjeta-acento">
            <h2>Cuentas de prueba</h2>
            <p className="texto-suave"><strong>demo@ucc.edu.ar</strong> · conductor con viajes publicados</p>
            <p className="texto-suave"><strong>alumno@ucc.edu.ar</strong> · pasajero</p>
            <p className="texto-suave">Contraseña de las dos: <strong>demo</strong></p>
          </div>
        </form>
      </main>
      <Pie />
    </>
  );
}
