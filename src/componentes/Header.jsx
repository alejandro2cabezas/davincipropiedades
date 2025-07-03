import {Link} from "react-router-dom";

export default function Header({usuarioLogeado}) {
  const toggleMenu = () => {};

  return (
    <header className="header">
      <Link className="logo" to="/">Davinci Propiedades</Link>

      <nav className="navigation">
        <ul>
          { !usuarioLogeado 
            ? <Link to="/login">Iniciar Sesion</Link>
            : <>
              {usuarioLogeado.role === "admin" && <Link to="/admin">Admin Panel</Link>}
              <Link to="/resultados">Buscar Propiedades</Link>
              <Link to="/favoritos">Favoritas</Link>
              <Link to="/publicar">Crear Publicacion</Link>
              <Link to="/mis-publicaciones">Mis Propiedades</Link>
              <div onClick={() => localStorage.removeItem('usuarioLogeado')} className="d-flex">
                <Link to="/login">Cerrar Sesion</Link>
              </div>
            </>
          }
        </ul>
      </nav>

      <div className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}
