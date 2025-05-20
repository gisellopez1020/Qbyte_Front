import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcRules } from "react-icons/fc";

const Admin = () => {
  const [formularios, setFormularios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/formulario/listar_formularios"
        );
        const data = await res.json();
        setFormularios(data);
      } catch (error) {
        console.error("Error al obtener los formularios:", error);
      }
    };

    fetchFormularios();
  }, []);

  return (
    <div className="p-6 mt-8 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <div className="max-h-[80vh] overflow-y-auto h-screen mx-auto max-w-[70vw] px-4 py-4 bg-sky-800/30 rounded-2xl">
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {formularios.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full min-h-[200px]
             cursor-pointer backdrop-blur-md border border-primary flex flex-col justify-center items-center"
              onClick={() =>
                navigate(`/forms/admin/${encodeURIComponent(form.nombre)}`)
              }
            >
              <FcRules className="text-7xl" />
              <h2 className="text-black font-semibold text-xl text-center">
                {form.nombre}
              </h2>
              <p className="text-sm text-gray-700 text-center">
                {form.descripcion}
              </p>
            </div>
          ))}

          {formularios.length === 0 && (
            <p className="text-gray-500 mt-10">
              No hay formularios disponibles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
