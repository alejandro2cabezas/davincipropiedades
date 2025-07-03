import { Link, useNavigate } from "react-router-dom";

export default function Footer({usuarioLogeado}) {
  return (
    <section className="footer-section">
        <div className="footer-content">
          <h2 className="footer-title">{!usuarioLogeado ? "Encontrá tu hogar" : "Gracias por confiar en nosotros"}</h2>
          <p className="footer-subtitle">{!usuarioLogeado ? "Unite a miles de usuarios que ya encontraron su hogar ideal" : "Contactanos al WhatsApp +1189774857"}</p>
          {!usuarioLogeado && <div className="footer-buttons">
            <Link className="footer-button primary" to="/login">Registrarse</Link>
            <Link className="footer-button secondary" to="/login">Iniciar Sesión</Link>
          </div>}
        </div>
    </section>
  )
}
