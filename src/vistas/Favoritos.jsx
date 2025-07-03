import { Heart } from "lucide-react";
import CardPropiedad from "../componentes/CardPropiedad";
import PageTitle from "../componentes/PageTitle"

export default function Favoritos() {
  const propiedadesfavoritas = JSON.parse(localStorage.getItem("favoritos") || "[]")

  return (
    <div className="resultados-container">
      <div className="resultados-section">
      <PageTitle title="Tus Favoritas" subtitle="Revisa tu lista de guardados" iconComponent={<Heart size={32} />} />
        <div className="destacadas-grid">
          { propiedadesfavoritas.length > 0 
            ? propiedadesfavoritas.map(p => <CardPropiedad key={p.id} propiedad={p} />)
            : <div className="no-resultados">
                <p>No se encontraron propiedades en favoritos.</p>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

