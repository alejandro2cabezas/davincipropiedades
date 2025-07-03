import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [formData, setFormData] = useState({email: '', password: '', confirmPassword: ''});
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
    };

    try {
      if (isLoggedIn) {
        // Lógica de login
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuarios.find(u => u.email === formData.email && u.password === formData.password);
        
        if (usuario) {
          localStorage.setItem('usuarioLogeado', JSON.stringify(usuario));
          navigate('/');
          setTimeout(() => window.location.reload(), 100)
        } else {
          setError({ general: 'Email o contraseña incorrectos' });
        };

      } else {
        // Lógica de registro
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        
        if (usuarios.find(u => u.email === formData.email)) {
          setError({ email: 'Este email ya está registrado' });
          setCargando(false);
          return;
        };
        const nuevoUsuario = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          role: usuarios.length === 0 ? 'admin' : 'usuario', // Primer usuario es admin
          createdAt: new Date().toISOString()
        };
        
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioLogeado', JSON.stringify(nuevoUsuario));
        
        navigate('/');
      }
    } catch {
      setError({general: 'Error al procesar la solicitud'});
    }
    
    setCargando(false);
  };

  const toggleMode = () => {
    setIsLoggedIn(!isLoggedIn);
    setFormData({email: '', password: '', confirmPassword: ''});
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