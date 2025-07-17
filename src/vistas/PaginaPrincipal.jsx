import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CardPropiedad from '../componentes/CardPropiedad';

const PaginaPrincipal = () => {
  const [busqueda, setBusqueda] = useState("");
  const [propiedades, setPropiedades] = useState([]);
  const navigate = useNavigate();

  const getDestacadas = async () => {
    const res = await fetch("http://localhost:3000/propiedades/destacadas", {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});
    const data = await res.json();
    setPropiedades(data)
  };

  useEffect(() => { getDestacadas() }, [])

  const buscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) navigate(`/resultados?q=${encodeURIComponent(busqueda.trim())}`);
  };

  return (
    <div className="hero-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Encontrá tu hogar</h1>
          <p className="hero-subtitle">Las mejores propiedades en las mejores ubicaciones</p>

          <form className="search-bar" onSubmit={buscar}>
            <input type="text" placeholder="Buscar por ubicación, tipo de propiedad..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="search-input" />
            <Link to="/resultados" className="search-button">Buscar Propiedades</Link>
          </form>
        </div>
      </section>

      <section className="destacadas-section">
        {propiedades.length > 0 && <div className="destacadas-container">
            <h2 className="destacadas-title">Propiedades Destacadas</h2>
            {propiedades.length == 0 && <p className="text-center">Sin Destacadas para listar</p> }
            <div className="destacadas-grid">{ propiedades.map(propiedad => <CardPropiedad key={propiedad.id} propiedad={propiedad} />) }</div>
          </div>
        }
      </section>
    </div>
  );
};

export default PaginaPrincipal;
