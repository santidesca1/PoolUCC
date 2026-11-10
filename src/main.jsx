import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { DatosProvider } from "./providers/DatosProvider";
import { temaGuardado } from "./hooks/useTema";
import App from "./App";
import "./index.css";

// Aplica el modo oscuro antes de dibujar, si estaba elegido
if (temaGuardado() === "oscuro") {
  document.documentElement.dataset.theme = "dark";
}

// Mismo orden que el ejercicio de clase: Router > Auth > (Datos) > App.
// DatosProvider va adentro de AuthProvider porque necesita saber quién está logueado.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DatosProvider>
          <App />
        </DatosProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
