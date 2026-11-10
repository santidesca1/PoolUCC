import { Component } from "react";

// Red de seguridad: si algún componente falla al dibujarse, en vez de dejar la pantalla en
// blanco mostramos un mensaje con una salida. Tiene que ser una clase porque React todavía
// no ofrece esta función con hooks (es de los pocos casos donde se sigue usando una clase).
export default class ErrorBoundary extends Component {
  state = { hayError: false };

  // React llama a esto cuando algo de adentro falla: lo que devuelve se mezcla con el state
  static getDerivedStateFromError() {
    return { hayError: true };
  }

  componentDidCatch(error, info) {
    console.error("PoolUCC falló al dibujar la pantalla:", error, info.componentStack);
  }

  // Borra los datos guardados de la app (menos el tema) por si estaban rotos, y arranca de cero
  reiniciar = () => {
    try {
      Object.keys(localStorage)
        .filter(clave => clave.startsWith("poolucc-") && clave !== "poolucc-tema")
        .forEach(clave => localStorage.removeItem(clave));
      sessionStorage.clear();
    } catch {
      // Almacenamiento bloqueado: igual recargamos
    }
    window.location.assign("/");
  };

  render() {
    if (!this.state.hayError) return this.props.children;

    return (
      <main className="estrecho">
        <div className="contenido">
          <div className="tarjeta texto-centrado">
            <h1>Algo salió mal</h1>
            <p className="texto-suave">
              No pudimos mostrar esta pantalla. Puede ser que los datos guardados en tu navegador
              estén dañados. Si reiniciás la app se borran y vuelve a empezar con los datos de ejemplo.
            </p>
            <button className="boton" type="button" onClick={this.reiniciar}>Reiniciar la app</button>
          </div>
        </div>
      </main>
    );
  }
}
