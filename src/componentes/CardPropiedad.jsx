import { Heart } from "lucide-react"; //Importa el componente de icono 'Heart' de la librería 'lucide-react'Este icono se utiliza comúnmente para funcionalidades como "favoritos" o "me gusta.
import { useState, useEffect } from "react"; // Importa los Hooks 'useState' y 'useEffect' de React 'useState' permite añadir estado a los componentes funcionales.
import { useLocation, useNavigate } from "react-router-dom";// Importa el Hook 'useNavigate' de 'react-router-dom' Este Hook se utiliza para la navegación programática dentro de la aplicación,permitiendo redirigir al usuario a diferentes rutas.
// Recibe un objeto 'propiedad' como prop, que contiene toda la información del inmueble a mostrar.
export default function CardPropiedad({ propiedad, noMostrarFavorito }) {
  const [isFavorito, setIsFavorito] = useState(false);
  const navigate = useNavigate();
  const location = useLocation()

  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado") || "{}");

  useEffect(() => { verificarFavorito(); }, [propiedad.id, usuario.id]);

  const verificarFavorito = async () => {
    if (location.pathname == "/favoritos") return;
    if (!usuario.id) return;
    
    try {
      const response = await fetch(`http://localhost:3000/favoritos/${usuario.id}`);
      if (response.ok) {
        const favoritos = await response.json();
        const esFavorito = favoritos.some(fav => fav.id === propiedad.id);
        setIsFavorito(esFavorito);
      }
    } catch (error) {
      console.error('Error al verificar favorito:', error);
    }
  };

  const toggleFavorito = async (e) => {
    e.stopPropagation();

    try {
      const response = await fetch("http://localhost:3000/favoritos", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({usuario_id: usuario.id, propiedad_id: propiedad.id}),
      });

      if (response.ok) {
        const result = await response.json();
        setIsFavorito(result.action === "added");
      }
    } catch (error) {
      console.error("Error al manejar favorito:", error);
    }
  };

  const irAPublicacion = (id) => { navigate("/propiedad/"+id) };

  return (
    <div className="propiedad-card" onClick={() => irAPublicacion(propiedad.id)}>
      <div className="propiedad-image">
        <img src={propiedad.url_imagen} alt={propiedad.titulo} />
        {!noMostrarFavorito && <Heart className={`heart-icon ${isFavorito ? 'favorito' : ''}`} onClick={toggleFavorito} fill={isFavorito ? "#ff4757" : "none"} />}
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