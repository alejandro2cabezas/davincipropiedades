import CardPropiedad from "../componentes/CardPropiedad";
import { Building } from "lucide-react";
import PageTitle from "../componentes/PageTitle"
import { useState, useEffect } from "react";

export default function PublicacionesUsuario({usuarioLogeado}) {
  const [propiedadesDelUsuario, setPropiedadesDelUsuario] = useState([]);

  const fetchPropiedadesUsuario = async () => {
    if (usuarioLogeado) {
      try {
        const response = await fetch(`http://localhost:3000/propiedades/usuario/${usuarioLogeado.id}`, {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});
        if (response.ok) {
          const propiedades = await response.json();
          setPropiedadesDelUsuario(propiedades);
        } else {
          console.error('Error al obtener propiedades del usuario');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    }
  };

  useEffect(() => { fetchPropiedadesUsuario() }, [usuarioLogeado]);

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

