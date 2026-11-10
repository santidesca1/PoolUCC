// Si ya hay sesión iniciada, no tiene sentido mostrar el login
if (obtenerUsuario() !== null) {
  window.location.href = "index.html";
}

/**
 * Valida que el correo sea de la UCC, guarda el usuario y entra a la app.
 * @method ingresar
 * @return {boolean} false, para que el formulario no recargue la página
 */
function ingresar() {
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const carrera = document.getElementById("carrera").value;
  const error = document.getElementById("error");
  const dominio = "@ucc.edu.ar";

  // El correo tiene que terminar en @ucc.edu.ar y tener algo antes de la @
  const final = email.slice(email.length - dominio.length);
  if (final !== dominio || email.length === dominio.length) {
    error.textContent = "Usá tu correo de la UCC (termina en @ucc.edu.ar).";
    return false;
  }

  if (nombre === "") {
    error.textContent = "Escribí tu nombre.";
    return false;
  }

  // Iniciales: primera letra de las dos primeras palabras del nombre
  // (el filter saca las palabras vacías si hay dos espacios seguidos)
  const palabras = nombre.split(" ").filter(p => p !== "");
  let iniciales = palabras[0][0];
  if (palabras.length > 1) {
    iniciales += palabras[1][0];
  }

  const usuario = {
    nombre: limpiarTexto(palabras.join(" ")),
    email: email,
    carrera: carrera,
    iniciales: iniciales.toUpperCase()
  };
  localStorage.setItem("usuario", JSON.stringify(usuario));
  window.location.href = "index.html";
  return false;
}
