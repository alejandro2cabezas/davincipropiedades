import CardPropiedad from "../componentes/CardPropiedad";
import { Building } from "lucide-react";
import PageTitle from "../componentes/PageTitle"
import { useState, useEffect } from "react";

export default function PublicacionesUsuario({usuarioLogeado}) {
  const [propiedadesDelUsuario, setPropiedadesDelUsuario] = useState([]);

  useEffect(() => {
    // primer accion del componente: traer propiedades y matchear por id usuario
    const propiedades = JSON.parse(localStorage.getItem("propiedades") || "[]");
    if (usuarioLogeado) {
      // filtrar propiedades que pertenecen al usuario logueado
      const propiedadesUsuario = propiedades.filter(p => p.userId === usuarioLogeado.id);
      setPropiedadesDelUsuario(propiedadesUsuario);
    }
  }, []);

  return (
    <div className="resultados-container">
      <div className="resultados-section">
      <PageTitle title="Mis Publicaciones" subtitle="Esta es la lista de tus propiedades publicadas" iconComponent={<Building size={32} />} />
        
        <div className="destacadas-grid">
          { propiedadesDelUsuario.length > 0 
            ? propiedadesDelUsuario.map(p => <CardPropiedad key={p.id} propiedad={p} />)
            : <div className="no-resultados">
                <p>No se encontraron propiedades publicadas.</p>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

