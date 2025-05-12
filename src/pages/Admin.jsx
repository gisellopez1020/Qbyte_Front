// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";


const Admin = () => {
  const [formularios, setFormularios] = useState([]);
  const navigate = useNavigate();

  const obtenerFormularios = async () => {
    const snapshot = await getDocs(collection(db, "formularios"));
    const datos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFormularios(datos);
  };

  const eliminarFormulario = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este formulario?")) {
      await deleteDoc(doc(db, "formularios", id));
      setFormularios((prev) => prev.filter((form) => form.id !== id));
    }
  };

  useEffect(() => {
    obtenerFormularios();
  }, []);

  return (
    <div className="p-4 flex flex-wrap justify-center gap-6 h-screen overflow-auto">
      {formularios.map((form) => (
        <div
          key={form.id}
          className="bg-white shadow-xl p-6 rounded-xl w-80 flex flex-col items-center"
        >
          <img src={form.imagen || "form-default.png"} className="w-24 mb-3" />
          <h2 className="text-xl font-bold text-center mb-2">{form.titulo}</h2>
          <p className="text-gray-600 text-sm text-center mb-4">{form.descripcion}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/forms/${form.id}`)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Ver
            </button>
            <button
              onClick={() => eliminarFormulario(form.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      {formularios.length === 0 && (
        <p className="text-gray-500 mt-10">No hay formularios disponibles.</p>
      )}
    </div>
  );
};

export default Admin;
