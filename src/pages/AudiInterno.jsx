import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcRules } from "react-icons/fc";
import { SiGoogleforms } from "react-icons/si";

const AudiInterno = () => {
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
    <div className="mx-auto mt-8 py-8 h-auto">
      <h1 className="text-3xl text-gray-800 font-bold flex items-center justify-center mb-12">
        <SiGoogleforms className="text-primary mr-2" />
        Formularios
      </h1>

      <div className="flex flex-wrap p-2 xl:p-2 relative items-center justify-center gap-5 xl:gap-10 h-auto">
        {formularios.map((form) => (
          <div
            key={form._id}
            className="bg-white bg-opacity-10 rounded-xl shadow-xl p-6 max-w-sm w-full min-h-[320px] cursor-pointer hover:scale-105 transition-transform duration-300 backdrop-blur-md border border-primary flex flex-col justify-between items-center"
            onClick={() =>
              navigate(`/forms/${encodeURIComponent(form.nombre)}`)
            }
          >
            <FcRules className="text-7xl mb-4" />
            <h2 className="text-black font-semibold text-xl text-center mb-2">
              {form.nombre}
            </h2>
            <p className="text-sm text-gray-700 text-center line-clamp-3">
              {form.descripcion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudiInterno;
