import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcRules } from "react-icons/fc";
import { SiGoogleforms } from "react-icons/si";

const AudiInterno = () => {
  const [formularios, setFormularios] = useState([]);
  const navigate = useNavigate();

  // Simulación del ID del auditor interno (puedes reemplazarlo con localStorage o contexto)
  const auditorInternoId = "665feab0b1a65e8f6a6c5c27"; // <-- Reemplázalo con el ID real

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
    <div className="mx-auto py-8 flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl text-gray-800 font-bold flex items-center justify-center mb-4">
        <SiGoogleforms className="text-primary mr-2" />
        Formularios
      </h1>

      {/* Bloque para copiar código */}
      <div className="mb-6 text-center">
        <p className="text-gray-700 mb-2">
          Comparte este código con el auditor externo para que pueda ver tus planes:
        </p>
        <div className="flex gap-3 items-center justify-center">
          <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
            {auditorInternoId}
          </code>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => {
              navigator.clipboard.writeText(auditorInternoId);
              alert("Código copiado al portapapeles");
            }}
          >
            Copiar
          </button>
        </div>
      </div>

      {/* Tarjetas de formularios */}
      <div className="flex flex-wrap p-3 xl:p-0 relative items-center justify-center gap-5 xl:gap-10 overflow-y-auto h-auto">
        {formularios.map((form) => (
          <div
            key={form.norma}
            className="bg-white bg-opacity-10 rounded-xl shadow-xl p-6 max-w-xs w-full min-h-[200px] cursor-pointer backdrop-blur-md border border-primary flex flex-col justify-center items-center"
            onClick={() => navigate(`/forms/${encodeURIComponent(form.norma)}`)}
          >
            <FcRules className="text-7xl" />
            <h2 className="text-black font-semibold text-xl text-center">
              {form.norma}
            </h2>
            <p className="text-sm text-gray-700 text-center">{form.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudiInterno;
