import { Navigate } from "react-router-dom";

const RutaProtegida = ({children, usuarioLogeado, admin}) => {
  if (admin && usuarioLogeado.role !== "admin") return <Navigate to="/" replace />;
  if (!usuarioLogeado) return <Navigate to="/login" replace />;
  return children;
};

export default RutaProtegida;
