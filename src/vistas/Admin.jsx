import { useState, useEffect } from "react";
import PageTitle from "../componentes/PageTitle";
import { PersonStanding } from "lucide-react";

export default function Admin({ usuarioLogeado }) {
  const [propiedadesObj, setPropiedadesObj] = useState("");
  const [usuariosObj, setUsuariosObj] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setLoading(true);
      //cargar usuarios
      const usuariosResponse = await fetch("http://localhost:3000/usuarios", {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});
      const usuariosData = await usuariosResponse.json();
      setUsuariosObj(JSON.stringify(usuariosData, null, 2));
      // cargar propiedades
      const propiedadesResponse = await fetch("http://localhost:3000/propiedades", {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});
      const propiedadesData = await propiedadesResponse.json();
      setPropiedadesObj(JSON.stringify(propiedadesData, null, 2));
        
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar datos de la base de datos");
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos() }, []);

  const guardarObjetos = async () => {
    try {
      setError("");

      let usuarios, propiedades;
      try {
        usuarios = JSON.parse(usuariosObj);
        propiedades = JSON.parse(propiedadesObj);
      } catch (parseError) {
        setError("Error: JSON inválido. Verifique la sintaxis.");
        return;
      }

      for (const usuario of usuarios) {
        if (usuario.id) {
          await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
            method: "PUT", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}`}, body: JSON.stringify(usuario)
          });
        } else {
          await fetch("http://localhost:3000/usuarios", {
            method: "POST", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}`}, body: JSON.stringify(usuario),
          });
        }
      }

      //actualizar propiedades
      for (const propiedad of propiedades) {
        //preparar datos para el backend
        const propiedadData = {
          id: propiedad.id,
          titulo: propiedad.titulo,
          descripcion: propiedad.descripcion,
          precio: propiedad.precio,
          superficie: propiedad.superficie,
          habitaciones: propiedad.habitaciones,
          banos: propiedad.banos,
          disponible: propiedad.disponible,
          tipo_id: propiedad.tipo_id,
          ubicacion_id: propiedad.ubicacion_id,
          fecha_publicacion: propiedad.fecha_publicacion,
          tipo: propiedad.tipo,
          ubicacion: propiedad.ciudad,
          url_imagen: propiedad.url_imagen,
          usuario_id: propiedad.usuario_id,
          destacada: propiedad.destacada,
          ciudad: propiedad.ciudad,
          provincia: propiedad.provincia,
        };

        if (propiedad.id) {
          //actualizar propiedad existente
          await fetch(`http://localhost:3000/propiedades/${propiedad.id}`, {
            method: "PUT", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}`}, body: JSON.stringify(propiedadData),
          });
        } else {
          //crear nueva propiedad
          await fetch("http://localhost:3000/propiedades", {
            method: "POST", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}`}, body: JSON.stringify(propiedadData),
          });
        }
      }

      alert("Base de datos actualizada exitosamente");
    } catch (error) {
      console.error("Error al guardar objetos:", error);
      setError("Error al actualizar la base de datos");
    }
  };

  const resetearTodo = async () => {
    if (!confirm("¿Está seguro que desea RESETEAR TODA LA BASE DE DATOS? Esta acción eliminará todos los usuarios, propiedades y datos relacionados. NO SE PUEDE DESHACER.")) return;
  
    try {
      const response = await fetch('http://localhost:3000/resetAll', {method: 'DELETE', headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});
  
      if (response.ok) {
        setUsuariosObj("[]");
        setPropiedadesObj("[]");
        alert("Toda la base de datos ha sido reseteada exitosamente");
      } else {
        setError("Error al resetear la base de datos");
      }
    } catch (error) {
      console.error("Error al resetear base de datos:", error);
      setError("Error al resetear la base de datos");
    }
  };

  const recargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      //recargar usuarios
      const usuariosResponse = await fetch("http://localhost:3000/usuarios", {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});
      const usuariosData = await usuariosResponse.json();
      setUsuariosObj(JSON.stringify(usuariosData, null, 2));
      //recargar propiedades
      const propiedadesResponse = await fetch("http://localhost:3000/propiedades", {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}});
      const propiedadesData = await propiedadesResponse.json();
      setPropiedadesObj(JSON.stringify(propiedadesData, null, 2));

      setLoading(false);
    } catch (error) {
      console.error("Error al recargar datos:", error);
      setError("Error al recargar datos");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel-container">
        <PageTitle containerClasses="mt-5 pt-5" title="Panel administrador" subtitle="Cargando datos..." iconComponent={<PersonStanding size={32} />} />
        <div className="text-center">
          <p>Cargando datos de la base de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <PageTitle containerClasses="mt-5 pt-5" title="Panel administrador" subtitle="Modifique los datos de las propiedades de una manera granular" iconComponent={<PersonStanding size={32} />} />

      {error && <div className="error-message" style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>{error}</div>}

      <div className="admin-controls" style={{ textAlign: "center", marginBottom: "20px" }} >
        <button onClick={recargarDatos} className="guardar-objeto-button" style={{ backgroundColor: "#007bff" }} >
          Recargar datos desde BD
        </button>
      </div>

      <h2 className="mb-2 mt-2 text-center">Usuarios</h2>
      <textarea value={usuariosObj} onChange={(e) => setUsuariosObj(e.target.value)} className="admin-textarea" placeholder="Cargando usuarios..." />

      <h2 className="mb-2 mt-2 text-center">Propiedades</h2>
      <textarea value={propiedadesObj} onChange={(e) => setPropiedadesObj(e.target.value)} className="admin-textarea" placeholder="Cargando propiedades..." />

      <button onClick={guardarObjetos} className="guardar-objeto-button">Guardar objetos (actualizar base de datos)</button>

      <button onClick={resetearTodo} className="guardar-objeto-button red">RESETEAR TODA LA BASE DE DATOS</button>

      <div className="admin-help mt-4">
        <div className="admin-instructions" style={{backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px", marginBottom: "20px",}}>
          <h4>Instrucciones de uso:</h4>
          <ul style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
            <li>Los datos se cargan automáticamente desde la base de datos</li>
            <li>Puede editar el JSON directamente en los campos de texto</li>
            <li>Para crear nuevos registros, agregue objetos sin ID</li>
            <li>Para actualizar registros existentes, mantenga el ID</li>
            <li>Use "Recargar datos desde BD" para descartar cambios y volver a la versión de la base de datos</li>
            <li>Valide que el JSON sea válido antes de guardar</li>
          </ul>

          <p className="mt-4  mb-5 text-center">
            Tenga en cuenta que esta acción es lo mismo que modificar una base de datos.
            <br /> Puede modificar un objeto erróneamente y ROMPER TODA LA APLICACIÓN.
            <br /> Úsela bajo su propia responsabilidad
          </p>
        </div>
      </div>
    </div>
  );
}
