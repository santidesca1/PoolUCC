import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { usuariosIniciales } from "../data/datos";
import { sacarIniciales } from "../utils/formato";
import { leerGuardado, guardar, borrarGuardado } from "../utils/almacenamiento";

const CLAVE_USUARIOS = "poolucc-usuarios";
const CLAVE_SESION = "poolucc-sesion";
const DOMINIO = "@ucc.edu.ar";

// Si lo guardado no es una lista (está roto o lo editaron), se vuelve a las cuentas de ejemplo
function leerUsuarios() {
  const guardados = leerGuardado(CLAVE_USUARIOS, null);
  return Array.isArray(guardados) ? guardados : usuariosIniciales;
}

function leerSesion() {
  const guardada = leerGuardado(CLAVE_SESION, null, true);
  return typeof guardada === "string" ? guardada : null;
}

// Mismo patrón que el ejercicio de login de clase, pero con varias cuentas y registro.
// Demo: las contraseñas se guardan tal cual en el navegador.
export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(leerUsuarios);
  // La sesión se guarda en sessionStorage (una por pestaña, vista en clase) y las cuentas en
  // localStorage (compartidas). Así se pueden tener dos cuentas abiertas a la vez, una en cada
  // pestaña, para mostrar el circuito pasajero-conductor. Al cerrar la pestaña hay que volver a entrar.
  const [emailSesion, setEmailSesion] = useState(leerSesion);

  useEffect(() => {
    guardar(CLAVE_USUARIOS, usuarios);
  }, [usuarios]);

  // Si otra pestaña crea una cuenta o reinicia la demo, esta se entera
  useEffect(() => {
    const alCambiarOtraPestana = e => {
      if (e.key === CLAVE_USUARIOS) setUsuarios(leerUsuarios());
    };
    window.addEventListener("storage", alCambiarOtraPestana);
    return () => window.removeEventListener("storage", alCambiarOtraPestana);
  }, []);

  useEffect(() => {
    if (emailSesion === null) {
      borrarGuardado(CLAVE_SESION, true);
    } else {
      guardar(CLAVE_SESION, emailSesion, true);
    }
  }, [emailSesion]);

  const user = usuarios.find(u => u.email === emailSesion) || null;

  const login = (email, password) => {
    const correo = email.trim().toLowerCase();
    if (!correo.endsWith(DOMINIO)) {
      throw new Error("Usá tu correo de la UCC (termina en @ucc.edu.ar).");
    }
    const encontrado = usuarios.find(u => u.email === correo);
    if (!encontrado || encontrado.password !== password) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    setEmailSesion(correo);
  };

  const registrar = ({ nombre, email, carrera, password, password2 }) => {
    const correo = email.trim().toLowerCase();
    if (nombre.trim() === "") {
      throw new Error("Escribí tu nombre y apellido.");
    }
    if (!correo.endsWith(DOMINIO) || correo.length === DOMINIO.length) {
      throw new Error("Usá tu correo de la UCC (termina en @ucc.edu.ar).");
    }
    if (usuarios.some(u => u.email === correo)) {
      throw new Error("Ese correo ya tiene una cuenta. Iniciá sesión.");
    }
    if (password.length < 4) {
      throw new Error("La contraseña tiene que tener al menos 4 caracteres.");
    }
    if (password !== password2) {
      throw new Error("Las contraseñas no coinciden.");
    }
    const nuevo = {
      nombre: nombre.trim().split(" ").filter(p => p !== "").join(" "),
      email: correo,
      password,
      carrera,
      iniciales: sacarIniciales(nombre)
    };
    setUsuarios([...usuarios, nuevo]);
    setEmailSesion(correo);
  };

  const logout = () => setEmailSesion(null);

  // Para "Reiniciar demo": vuelve a las cuentas de prueba y cierra la sesión
  const reiniciarCuentas = () => {
    setUsuarios(usuariosIniciales);
    setEmailSesion(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, registrar, logout, reiniciarCuentas }}>
      {children}
    </AuthContext.Provider>
  );
}
