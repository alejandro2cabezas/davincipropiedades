import { Link } from "react-router-dom";

const PaginaNoEncontrada = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem", minHeight: "50vh", justifyContent: "center", marginBottom: "200px" }}>
      <h1 style={{marginTop: "200px"}}>404 - Página no encontrada</h1>
      <p>La ruta que estás buscando no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default PaginaNoEncontrada;
