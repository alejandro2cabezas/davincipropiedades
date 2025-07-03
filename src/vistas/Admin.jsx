import { useState } from "react";
import PageTitle from "../componentes/PageTitle"
import { PersonStanding } from "lucide-react";

export default function Admin({ usuarioLogeado }) {
  const [propiedadesObj, setPropiedadesObj] = useState(localStorage.getItem("propiedades") || "");
  const [usuariosObj, setUsuariosObj] = useState(localStorage.getItem("usuarios") || "");

  const guardarObjetos = () => {
    const propiedades = JSON.parse(propiedadesObj);
    const usuarios = JSON.parse(usuariosObj);
    localStorage.setItem("propiedades", JSON.stringify(propiedades));
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Objetos Actualizados")
  };
  
  const eliminarUsuarios = () => {
    localStorage.removeItem("usuarios");
    setUsuariosObj("")
  };

  const eliminarPropiedades = () => {
    localStorage.removeItem("propiedades");
    localStorage.removeItem("favoritos");
    setPropiedadesObj("")
  };

  return (
    <div className="admin-panel-container">
      <PageTitle containerClasses="mt-5 pt-5" title="Panel administrador" subtitle="Modifique los datos de las propiedades de una manera granular" iconComponent={<PersonStanding size={32} />} />
      <h2 className="mb-2 mt-2 text-center">Usuarios</h2>
      <textarea value={usuariosObj} onChange={(e) => setUsuariosObj(e.target.value)} className="admin-textarea" />
      <h2 className="mb-2 mt-2 text-center">Propiedades</h2>
      <textarea value={propiedadesObj} onChange={(e) => setPropiedadesObj(e.target.value)} className="admin-textarea"/>
      <button onClick={guardarObjetos} className="guardar-objeto-button">Guardar objetos (actualizar base de datos)</button>
      <button onClick={eliminarUsuarios} className="guardar-objeto-button red">ELIMINAR TODOS LOS USUARIOS</button>
      <button onClick={eliminarPropiedades} className="guardar-objeto-button red">ELIMINAR TODAS LAS PROPIEDADES</button>
      <p className="mb-5 text-center">Tenga en cuenta que esta accion es lo mismo que modificar una base de datos. <br/> Puede modificar un objeto erroneamente y ROMPER TODA LA APLIACION.<br/> Usela bajo su propia responsabilidad</p>
    </div>
  );
}
