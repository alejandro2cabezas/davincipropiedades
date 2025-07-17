import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import CardPropiedad from "../componentes/CardPropiedad";
import PageTitle from "../componentes/PageTitle";

export default function Favoritos({usuarioLogeado}) {
  const [propiedadesfavoritas, setPropiedadesfavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavoritos = async () => {
    if (!usuarioLogeado.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/favoritos/${usuarioLogeado.id}`, {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});
      if (!response.ok) throw new Error("Error en favoritos");
      const favoritos = await response.json();
      setPropiedadesfavoritas(favoritos);
    } catch (err) {
      console.error("Error en favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavoritos() }, [usuarioLogeado.id]);

  if (loading) {
    return (
      <div className="resultados-container">
        <div className="resultados-section">
          <PageTitle title="Tus Favoritas" subtitle="Revisa tu lista de guardados" iconComponent={<Heart size={32} />} />
          <div className="loading">Cargando favoritos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="resultados-container">
      <div className="resultados-section">
        <PageTitle title="Tus Favoritas" subtitle="Revisa tu lista de guardados" iconComponent={<Heart size={32} />} />
        <div className="destacadas-grid">
          {propiedadesfavoritas.length > 0 ? (
            propiedadesfavoritas.map((p) => <CardPropiedad key={p.id} propiedad={p} noMostrarFavorito /> )
          ) : (
            <div className="no-resultados">
              <p>No se encontraron propiedades en favoritos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
