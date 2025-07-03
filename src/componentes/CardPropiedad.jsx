import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CardPropiedad({ propiedad }) {
  const [isFavorito, setIsFavorito] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
    const esFavorito = favoritos.some(fav => fav.id === propiedad.id);
    setIsFavorito(esFavorito);
  }, [propiedad.id]);

  const toggleFavorito = (e) => {
    e.stopPropagation();
    
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
    
    if (isFavorito) {
      const nuevosFavoritos = favoritos.filter(fav => fav.id !== propiedad.id);
      localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
      setIsFavorito(false);
    } else {
      const nuevosFavoritos = [...favoritos, propiedad];
      localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
      setIsFavorito(true);
    }
  };

  const irAPublicacion = (id) => {
    navigate("/propiedad/"+id)
  };

  return (
    <div className="propiedad-card" onClick={() => irAPublicacion(propiedad.id)}>
      <div className="propiedad-image">
        <img src={propiedad.imagen} alt={propiedad.titulo} />
        <Heart className={`heart-icon ${isFavorito ? 'favorito' : ''}`}
          onClick={toggleFavorito} fill={isFavorito ? "#ff4757" : "none"} />
      </div>
      <div className="propiedad-info">
        <h3 className="propiedad-title">{propiedad.titulo}</h3>
        <p className="propiedad-location">{propiedad.ubicacion}</p>
        <div className="propiedad-details">
          <span>{propiedad.habitaciones} hab</span>
          <span>{propiedad.baños} baños</span>
          <span>{propiedad.tipo}</span>
        </div>
        <div className="propiedad-price">${propiedad.precio.toLocaleString()}</div>
      </div>
    </div>
  );
}