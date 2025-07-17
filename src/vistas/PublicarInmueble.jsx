import { useState } from "react";
import { Home, MapPin, DollarSign, Bed, Bath, Camera, Check, X, KeyboardIcon, Database } from "lucide-react";
import PageTitle from "../componentes/PageTitle";
import { useNavigate } from "react-router-dom";

const propiedadVacia = { titulo: "", precio: "", ubicacion: "", tipo: "", habitaciones: "", descripcion: "", superficie: "", baños: "", imagen: "", destacada: false };

export default function PublicarInmueble({usuarioLogeado}) {
  const [formData, setFormData] = useState(propiedadVacia);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const navigate = useNavigate()

  const tiposPropiedad = ["Casa", "Departamento", "PH", "Local", "Oficina", "Terreno"];
  const ubicaciones = ["San Isidro", "Palermo", "Belgrano", "Recoleta", "Puerto Madero", "Villa Crespo", "Caballito", "Barracas"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
    if (errors[name]) setErrors(prev => ({...prev, [name]: ""}));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = "El título es requerido";
    if (!formData.precio || formData.precio <= 0) newErrors.precio = "El precio debe ser mayor a 0";
    if (!formData.ubicacion.trim()) newErrors.ubicacion = "La ubicación es requerida";
    if (!formData.tipo) newErrors.tipo = "Selecciona un tipo de propiedad";
    if (!formData.habitaciones || formData.habitaciones <= 0) newErrors.habitaciones = "Las habitaciones deben ser mayor a 0";
    if (!formData.baños || formData.baños <= 0) newErrors.baños = "Los baños deben ser mayor a 0";

    if (!formData.imagen.trim()) {
      newErrors.imagen = "La URL de la imagen es requerida";
    } else if (!isValidUrl(formData.imagen)) {
      newErrors.imagen = "La URL de la imagen no es válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const propiedadData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        superficie: parseInt(formData.superficie) || null,
        habitaciones: parseInt(formData.habitaciones),
        banos: parseInt(formData.baños),
        tipo: formData.tipo,
        ubicacion: formData.ubicacion,
        url_imagen: formData.imagen,
        usuario_id: usuarioLogeado.id,
        destacada: formData.destacada,
      };

      const response = await fetch("http://localhost:3000/propiedades", {method: "POST", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}`}, body: JSON.stringify(propiedadData)});

      if (!response.ok) console.error("Error al crear la propiedad");

      const result = await response.json();

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData(propiedadVacia);

      setTimeout(() => {
        setSubmitSuccess(false);
        navigate(`/propiedad/${result.id}`);
      }, 1200);
    } catch (error) {
      console.error("Error al crear", error);
      setIsSubmitting(false);
      alert("Error al publicar la propiedad");
    }
  };

  const resetForm = () => {
    setFormData(propiedadVacia);
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="publicar-container">
      <div className="publicar-wrapper">
        <PageTitle  containerClasses="mt-5" title="Publica tu Inmueble" subtitle="Ingresa cuantos datos quieras para mejorar la venta" iconComponent={<Home size={32} />} />

        {submitSuccess && (
          <div className="success-message">
            <Check size={20} />
            ¡Propiedad publicada exitosamente!
          </div>
        )}

        <div className="form-container">
          <div className="form-content">
            
            <div className="form-section">
              <h2 className="section-title">Información Básica</h2>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Título de la propiedad *</label>
                  <input type="text" name="titulo" value={formData.titulo}
                    onChange={handleInputChange} placeholder="Ej: Casa moderna con jardín" className={`form-input ${errors.titulo ? 'error' : ''}`}/>
                  {errors.titulo && <span className="error-message">{errors.titulo}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Precio (USD) *</label>
                  <div className="input-with-icon">
                    <DollarSign className="input-icon" size={20} />
                    <input type="number" name="precio"
                      value={formData.precio} onChange={handleInputChange}
                      placeholder="120000" className={`form-input with-icon ${errors.precio ? 'error' : ''}`} />
                  </div>
                  {errors.precio && <span className="error-message">{errors.precio}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de propiedad *</label>
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} className={`form-select ${errors.tipo ? 'error' : ''}`}>
                    <option value="">Selecciona un tipo</option>
                    {tiposPropiedad.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                  </select>
                  {errors.tipo && <span className="error-message">{errors.tipo}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Ubicación</h2>
              
              <div className="form-group">
                <label className="form-label">Ubicación *</label>
                <div className="input-with-icon">
                  <MapPin className="input-icon" size={20} />
                  <select name="ubicacion" value={formData.ubicacion}
                    onChange={handleInputChange} className={`form-select with-icon ${errors.ubicacion ? 'error' : ''}`} >
                    <option value="">Selecciona una ubicación</option>
                    {ubicaciones.map(ubicacion => <option key={ubicacion} value={ubicacion}>{ubicacion}</option>)}
                  </select>
                </div>
                {errors.ubicacion && <span className="error-message">{errors.ubicacion}</span>}
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Características</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Habitaciones *</label>
                  <div className="input-with-icon">
                    <Bed className="input-icon" size={20} />
                    <input type="number" name="habitaciones" value={formData.habitaciones} onChange={handleInputChange} placeholder="3"min="1"
                      className={`form-input with-icon ${errors.habitaciones ? 'error' : ''}`}
                    />
                  </div>
                  {errors.habitaciones && <span className="error-message">{errors.habitaciones}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Baños *</label>
                  <div className="input-with-icon">
                    <Bath className="input-icon" size={20} />
                    <input type="number" name="baños"
                      value={formData.baños} onChange={handleInputChange} placeholder="2"
                      min="1" className={`form-input with-icon ${errors.baños ? 'error' : ''}`}
                    />
                  </div>
                  {errors.baños && <span className="error-message">{errors.baños}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Superficie (mt2)</label>
                  <div className="input-with-icon">
                    <Database className="input-icon" size={20} />
                    <input type="number" name="superficie"
                      value={formData.superficie} onChange={handleInputChange} placeholder="2"
                      min="1" className={`form-input with-icon ${errors.superficie ? 'error' : ''}`}
                    />
                  </div>
                  {errors.superficie && <span className="error-message">{errors.superficie}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Descripcion</label>
                  <div className="input-with-icon">
                    <KeyboardIcon className="input-icon" size={20} />
                    <input type="text" name="descripcion"
                      value={formData.descripcion} onChange={handleInputChange} placeholder="2"
                      min="1" className={`form-input with-icon ${errors.descripcion ? 'error' : ''}`}
                    />
                  </div>
                  {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Imagen</h2>
              
              <div className="form-group">
                <label className="form-label">URL de la imagen *</label>
                <div className="input-with-icon">
                  <Camera className="input-icon" size={20} />
                  <input type="url" name="imagen" value={formData.imagen}
                    onChange={handleInputChange} placeholder="https://ejemplo.com/imagen.jpg"
                    className={`form-input with-icon ${errors.imagen ? 'error' : ''}`}
                  />
                </div>
                {errors.imagen && <span className="error-message">{errors.imagen}</span>}
                
                {formData.imagen && isValidUrl(formData.imagen) && (
                  <div className="image-preview">
                    <p className="preview-label">Vista previa:</p>
                    <img src={formData.imagen}
                      alt="Vista previa" className="preview-image"
                      onError={(e) => { e.target.style.display = 'none';}} />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Opciones Adicionales</h2>
              
              <div className="checkbox-group">
                <input type="checkbox" name="destacada"
                  id="destacada" checked={formData.destacada}
                  onChange={handleInputChange} className="form-checkbox" />
                <label htmlFor="destacada" className="checkbox-label">Marcar como propiedad destacada</label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Publicar Inmueble
                  </>
                )}
              </button>
              
              <button type="button" onClick={resetForm} className="btn-secondary">
                <X size={20} />
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}