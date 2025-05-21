import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcRules } from "react-icons/fc";
import { SiGoogleforms } from "react-icons/si";
import { useTranslation } from "react-i18next";

const AudiInterno = () => {
  const [formularios, setFormularios] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const res = await fetch(
          "https://acmeapplication.onrender.com/formulario/listar_formularios"
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
    <div className="mx-auto py-8">
      <div className="bg-slate-200 mx-auto rounded-2xl shadow-sm flex-1 p-4 max-h-[80vh] max-w-[70vw] overflow-y-auto space-y-6">
        <h1 className="text-3xl text-gray-800 font-bold flex items-center justify-center mb-12">
          <SiGoogleforms className="text-primary mr-2" />
          {t("forms.title")}
        </h1>

        <div className="flex flex-wrap justify-center gap-6 w-full">
          {formularios.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-xl shadow-xl p-5
             max-w-xs w-full min-h-[200px] cursor-pointer hover:scale-105 
             transition-transform duration-300 backdrop-blur-md border
              border-primary flex flex-col justify-center items-center"
              onClick={() =>
                navigate(`/forms/${encodeURIComponent(form.nombre)}`)
              }
            >
              <FcRules className="text-7xl mb-4" />
              <h2 className="text-black font-semibold text-xl text-center mb-2 line-clamp-3">
                {form.nombre}
              </h2>
              <p className="text-sm text-gray-700 text-center line-clamp-3">
                {form.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudiInterno;
