import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import RutaProtegida from './componentes/RutaProtegida';
import Login from './vistas/Login';
import ResultadosBusqueda from './vistas/ResultadosBusqueda';
import InmuebleSeleccionado from './vistas/InmuebleSeleccionado';
import PublicarInmueble from './vistas/PublicarInmueble';
import Favoritos from './vistas/Favoritos';
import PublicacionesUsuario from './vistas/PublicacionesUsuario';
import PaginaPrincipal from './vistas/PaginaPrincipal';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Admin from "./vistas/Admin";

function AppContent() {
  const [usuarioLogeado, setUsuarioLoggeado] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    if (usuarioLogeado) {
      try {
        setUsuarioLoggeado(usuarioLogeado);
      } catch {
        localStorage.removeItem('usuarioLogeado');
      };
    };
  }, []);

  const estaEnLogin = location.pathname === "/login";

  return (
    <>
      {!estaEnLogin && <Header usuarioLogeado={usuarioLogeado} />}

      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resultados" element={<ResultadosBusqueda />} />
        <Route path="/propiedad/:id" element={<InmuebleSeleccionado />} />
        {/* rutas protegidas */}
        <Route path="/favoritos" element={<RutaProtegida usuarioLogeado={usuarioLogeado}><Favoritos /></RutaProtegida>} />
        <Route path="/mis-publicaciones" element={<RutaProtegida usuarioLogeado={usuarioLogeado}><PublicacionesUsuario usuarioLogeado={usuarioLogeado} /></RutaProtegida>} />
        <Route path="/publicar" element={<RutaProtegida usuarioLogeado={usuarioLogeado}><PublicarInmueble usuarioLogeado={usuarioLogeado} /></RutaProtegida>} />
        <Route path="/admin" element={<RutaProtegida admin usuarioLogeado={usuarioLogeado}><Admin usuarioLogeado={usuarioLogeado} /></RutaProtegida>} />
      </Routes>

      {!estaEnLogin && <Footer usuarioLogeado={usuarioLogeado} />}
    </>
  );
}

export default AppContent;