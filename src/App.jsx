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
import PaginaNoEncontrada from "./componentes/PaginaNoEncontrada";

{/* toma del localStorage el usuario logueado*/}

function AppContent() {
  const [usuarioLogeado, setUsuarioLoggeado] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogeado");
    const usuarioLogeado = usuarioGuardado && usuarioGuardado !== "undefined" ? JSON.parse(usuarioGuardado) : {};
    if (usuarioLogeado) setUsuarioLoggeado(usuarioLogeado);
  }, []);
  
  const estaEnLogin = location.pathname === "/login";

  return (
    <>
      {!estaEnLogin && <Header usuarioLogeado={usuarioLogeado} />}

      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />  {/*element renderiza*/}
        <Route path="*" element={<PaginaNoEncontrada />} />

        <Route path="/login" element={<Login />} />
        <Route path="/resultados" element={<ResultadosBusqueda />} />
        <Route path="/propiedad/:id" element={<InmuebleSeleccionado />} />
        {/* rutas protegidas */}
        <Route path="/favoritos" element={<RutaProtegida usuarioLogeado={usuarioLogeado}><Favoritos usuarioLogeado={usuarioLogeado} /></RutaProtegida>} />
        <Route path="/mis-publicaciones" element={<RutaProtegida usuarioLogeado={usuarioLogeado}><PublicacionesUsuario usuarioLogeado={usuarioLogeado} /></RutaProtegida>} />
        <Route path="/publicar" element={<RutaProtegida usuarioLogeado={usuarioLogeado}><PublicarInmueble usuarioLogeado={usuarioLogeado} /></RutaProtegida>} />
        <Route path="/admin" element={<RutaProtegida admin usuarioLogeado={usuarioLogeado}><Admin usuarioLogeado={usuarioLogeado} /></RutaProtegida>} />
      </Routes>

      {!estaEnLogin && <Footer usuarioLogeado={usuarioLogeado} />}
    </>
  );
}

export default AppContent;