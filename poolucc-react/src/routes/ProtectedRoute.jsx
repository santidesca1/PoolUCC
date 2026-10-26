import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Igual que en el ejercicio de clase: sin sesión, va al login.
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
