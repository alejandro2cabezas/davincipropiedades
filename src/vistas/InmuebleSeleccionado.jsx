import { Heart, MapPin, Bed, Bath, Home, ArrowLeft, Phone, Mail, Share2, MessageCircle, Dessert } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function InmuebleSeleccionado() {
  const [propiedad, setPropiedad] = useState(null);
  const [isFavorito, setIsFavorito] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const propiedades = JSON.parse(localStorage.getItem("propiedades") || "[]");
    const propiedadEncontrada = propiedades.find(p => p.id === parseInt(id));
    
    if (propiedadEncontrada) {
      setPropiedad(propiedadEncontrada);
      const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
      const esFavorito = favoritos.some(fav => fav.id === propiedadEncontrada.id);
      setIsFavorito(esFavorito);
    }
  }, []);

  const toggleFavorito = () => {
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

  const volver = () => {
    window.history.back();
  };

  if (!propiedad) {
    return (
      <div className="inmueble-not-found">
        <h2>Propiedad no encontrada</h2>
        <button onClick={volver} className="btn-volver">
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="inmueble-container">
      <div className="inmueble-content">
        <div className="inmueble-image-section">
          <div className="inmueble-main-image">
            <img src={propiedad.imagen} alt={propiedad.titulo} />
            {propiedad.destacada && <div className="badge-destacada">Destacada</div>}
            <button onClick={toggleFavorito} className="btn-favorito heart-abs-icon">
              <Heart size={24} fill={isFavorito ? "#ff4757" : "none"}  color={isFavorito ? "#ff4757" : "#666"} />
            </button>
          </div>
        </div>

        <div className="inmueble-info-section">
          <div className="inmueble-basic-info">
            <h1 className="inmueble-title">{propiedad.titulo}</h1>
            <div className="inmueble-location">
              <MapPin size={18} />
              <span>{propiedad.ubicacion}</span>
            </div>
            <div className="inmueble-price">${propiedad.precio.toLocaleString()}</div>
          </div>

          <div className="inmueble-details">
            <h3 className="details-title">Características</h3>
            <div className="details-grid">
              <div className="detail-item">
                <Bed size={20} />
                <span>{propiedad.habitaciones} Habitaciones</span>
              </div>
              <div className="detail-item">
                <Bath size={20} />
                <span>{propiedad.baños} Baños</span>
              </div>
              <div className="detail-item">
                <Home size={20} />
                <span>{propiedad.tipo}</span>
              </div>
              {propiedad.superficie && (
                <div className="detail-item">
                  <span className="superficie-icon">m²</span>
                  <span>{propiedad.superficie} m²</span>
                </div>
              )}
            </div>
          </div>
          
          {propiedad.descripcion && (
            <div className="inmueble-description">
              <h3 className="description-title">Descripción</h3>
              <p className="description-text">{propiedad.descripcion}</p>
            </div>
          )}

          <div className="inmueble-contact">
            <h3 className="contact-title">Contacto</h3>
            <div className="contact-buttons">
              <button className="contact-btn primary">
                <Phone size={18} />
                Llamar
              </button>
              <button className="contact-btn secondary">
                <MessageCircle size={18} />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}