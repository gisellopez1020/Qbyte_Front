import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/formulario/listar_por_nombre?nombre=${encodeURIComponent(
            id
          )}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData?.detail || "No se pudo cargar el formulario"
          );
        }

        const data = await res.json();
        setFormulario(data);
      } catch (error) {
        console.error("Error al cargar el formulario:", error);
        setMensaje({
          tipo: "error",
          texto: "Error al cargar el formulario. Intenta nuevamente.",
        });
      }
    };

    if (id) fetchFormulario();
  }, [id]);

  if (!formulario) {
    return (
      <div className="text-center mt-10 text-gray-600">
        {mensaje ? mensaje.texto : "Cargando formulario..."}
      </div>
    );
  }

  const obtenerTextoPregunta = (pregunta) => {
    if (typeof pregunta === "string") return pregunta;
    if (pregunta && typeof pregunta === "object" && pregunta.input)
      return pregunta.input;
    return JSON.stringify(pregunta);
  };

  return (
    <div className="p-6 mt-8 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <div
        className="bg-gradient-to-r bg-sky-800/30 rounded-2xl
          shadow-sm flex-1 p-8 max-h-[80vh] overflow-y-auto space-y-6"
      >
        <h1 className="text-2xl font-bold mb-2">
          {formulario.nombre || formulario.titulo || "Formulario"}
        </h1>
        <h2 className="text-lg font-medium text-gray-700 mb-6">
          Tipo: {formulario.tipo || "No especificada"}
        </h2>

        <ul className="space-y-4">
          {formulario.preguntas?.map((pregunta, i) => (
            <li key={i} className="p-4 bg-gray-100 rounded">
              <strong>Pregunta {i + 1}:</strong>{" "}
              {obtenerTextoPregunta(pregunta)}
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 
                    bg-gradient-to-r from-[#2067af] to-blue-950
                    hover:from-[#1b5186] hover:to-blue-900
                    transition-all duration-200 ease-in-out text-white px-4 py-2
                    rounded-lg active:scale-95 active:shadow-md hover:scale-105"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default VerForm;
