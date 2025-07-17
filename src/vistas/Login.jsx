import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [formData, setFormData] = useState({email: "", password: "", confirmPassword: "", nombre: "", apellido: "", telefono: ""});
  const [error, setError] = useState({});
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (error[name]) setError(prev => ({...prev, [name]: ''}));
  };

  const validarFormulario = () => {
    const nuevoserror = {};
    
    if (!formData.email.trim()) {
      nuevoserror.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevoserror.email = 'El email no es válido';
    };
    
    if (!formData.password.trim()) {
      nuevoserror.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      nuevoserror.password = 'La contraseña debe tener al menos 6 caracteres';
    };
    
    if (!isLoggedIn && formData.password !== formData.confirmPassword) nuevoserror.confirmPassword = 'Las contraseñas no coinciden';
    
    return nuevoserror;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    const errorValidacion = validarFormulario();
    if (Object.keys(errorValidacion).length > 0) {
      setError(errorValidacion);
      setCargando(false);
      return;
    }

    try {
      if (isLoggedIn) {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST", headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: formData.email, password: formData.password}),
        });

        const data = await response.json();

        if (data.usuario) {
          localStorage.setItem("usuarioLogeado", JSON.stringify(data.usuario));
          navigate("/");
          setTimeout(() => window.location.reload(), 100);
        } else {
          setError({ general: data.error });
        }
      } else {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST", headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: formData.email, password: formData.password, nombre: formData.nombre, apellido: formData.apellido, telefono: formData.telefono}),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("usuarioLogeado", JSON.stringify(data.usuario));
          navigate("/");
          setTimeout(() => window.location.reload(), 100);
        } else {
          setError({ general: data.error });
        }
      }
    } catch (error) {
      setError({ general: "Error al procesar la solicitud" });
    }

    setCargando(false);
  };

  const toggleMode = () => {
    setIsLoggedIn(!isLoggedIn);
    setFormData({email: "", password: "", confirmPassword: "", nombre: "", apellido: "", telefono: ""});
    setError({});
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">{isLoggedIn ? 'Iniciar Sesión' : 'Registrarse'}</h1>
            <p className="login-subtitle">{isLoggedIn ? 'Accede a tu cuenta para gestionar tus propiedades' : 'Crea una cuenta para publicar tus propiedades'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error.general && <div className="error-message general-error">{error.general}</div>}

            {!isLoggedIn && <>
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre}
                  onChange={handleInputChange} className="form-input" placeholder="Tu nombre" />
              </div>

              <div className="form-group">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input type="text" id="apellido" name="apellido" value={formData.apellido}
                  onChange={handleInputChange} className="form-input" placeholder="Tu apellido" />
              </div>

              <div className="form-group">
                <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
                <input type="tel" id="telefono" name="telefono" value={formData.telefono}
                  onChange={handleInputChange} className="form-input" placeholder="Tu teléfono" />
              </div>
            </>}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" name="email" value={formData.email}
                onChange={handleInputChange} className={`form-input ${error.email ? 'error' : ''}`} placeholder="tu@email.com" />
              {error.email && <span className="error-message">{error.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input type="password" id="password" name="password" value={formData.password}
                onChange={handleInputChange} className={`form-input ${error.password ? 'error' : ''}`} placeholder="••••••••" />
              {error.password && <span className="error-message">{error.password}</span>}
            </div>

            {!isLoggedIn && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleInputChange} className={`form-input ${error.confirmPassword ? 'error' : ''}`} placeholder="••••••••" />
                {error.confirmPassword && <span className="error-message">{error.confirmPassword}</span>}
              </div>
            )}

            <button type="submit" className="login-button" disabled={cargando}>{cargando ? 'Procesando...' : (isLoggedIn ? 'Iniciar Sesión' : 'Registrarse')}</button>
          </form>

          <div className="login-footer">
            <p className="toggle-text">
              {isLoggedIn ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button type="button" onClick={toggleMode} className="toggle-button">{isLoggedIn ? 'Regístrate' : 'Inicia Sesión'}</button>
            </p>

            <Link to="/" className="back-home">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </div>
  );
}