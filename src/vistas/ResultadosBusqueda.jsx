import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import CardPropiedad from "../componentes/CardPropiedad";
import PageTitle from "../componentes/PageTitle"

export default function ResultadosBusqueda() {
  const [filtros, setFiltros] = useState({tipo: "Todos", habitaciones: "Todos", precioMin: "", precioMax: "", ubicacion: "Todos"});
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([])

  useEffect(() => {
    const propiedades = JSON.parse(localStorage.getItem("propiedades") || "[]");
    setPropiedadesFiltradas(propiedades.filter(p => {
      const cumpleTipo = filtros.tipo === "Todos" || p.tipo === filtros.tipo;
      const cumpleHabitaciones = filtros.habitaciones === "Todos" || p.habitaciones === parseInt(filtros.habitaciones);
      const cumplePrecioMin = !filtros.precioMin || p.precio >= parseInt(filtros.precioMin);
      const cumplePrecioMax = !filtros.precioMax || p.precio <= parseInt(filtros.precioMax);
      const cumpleUbicacion = filtros.ubicacion === "Todos" || p.ubicacion === filtros.ubicacion;
      return cumpleTipo && cumpleHabitaciones && cumplePrecioMin && cumplePrecioMax && cumpleUbicacion;
    }))
  }, [filtros])
  
  const handleFiltroChange = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor });
  };

  const limpiarFiltros = () => {
    setFiltros({tipo: "Todos", habitaciones: "Todos", precioMin: "", precioMax: "", ubicacion: "Todos"});
  };

  return (
    <div className="resultados-container">
      <PageTitle title="Defini tu busqueda" subtitle="Encontra la publicacion que mas te favorezca" iconComponent={<Filter size={32} />} />
      <div className="filtros-section">
        <div className="filtros-grid">
          <div className="filtro-group">
            <label className="filtro-label">Tipo de Propiedad</label>
            <select className="filtro-select" value={filtros.tipo} onChange={e => handleFiltroChange('tipo', e.target.value)}>
              <option value="Todos">Todos los tipos</option>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
            </select>
          </div>

          <div className="filtro-group">
            <label className="filtro-label">Habitaciones</label>
            <select className="filtro-select" value={filtros.habitaciones} onChange={e => handleFiltroChange('habitaciones', e.target.value)}>
              <option value="Todos">Todas</option>
              <option value="1">1 habitación</option>
              <option value="2">2 habitaciones</option>
              <option value="3">3 habitaciones</option>
              <option value="4">4+ habitaciones</option>
            </select>
          </div>

          <div className="filtro-group">
            <label className="filtro-label">Precio Mínimo</label>
            <input type="number" className="filtro-input" placeholder="$0"
              value={filtros.precioMin} onChange={e => handleFiltroChange('precioMin', e.target.value)}
            />
          </div>

          <div className="filtro-group">
            <label className="filtro-label">Precio Máximo</label>
            <input type="number" className="filtro-input" placeholder="Sin límite"
              value={filtros.precioMax} onChange={e => handleFiltroChange('precioMax', e.target.value)} />
          </div>

          <div className="filtro-group">
            <button className="limpiar-filtros-btn" onClick={limpiarFiltros}>Limpiar Filtros</button>
          </div>
        </div>
      </div>

      <div className="resultados-section">
        <div className="resultados-header">
          <h2 className="resultados-title">Propiedades Encontradas ({propiedadesFiltradas.length})</h2>
        </div>
        
        <div className="destacadas-grid">
          { propiedadesFiltradas.length > 0 
            ? propiedadesFiltradas.map(p => <CardPropiedad key={p.id} propiedad={p} />)
            : <div className="no-resultados">
                <p>No se encontraron propiedades que coincidan con los filtros seleccionados.</p>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

