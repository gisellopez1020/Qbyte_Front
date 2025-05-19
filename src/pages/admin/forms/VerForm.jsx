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
                    throw new Error(errorData?.detail || "No se pudo cargar el formulario");
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
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-2">
                {formulario.nombre || formulario.titulo || "Formulario"}
            </h1>
            <h2 className="text-lg font-medium text-gray-700 mb-6">
                Tipo: {formulario.tipo || "No especificada"}
            </h2>

            <ul className="space-y-4">
                {formulario.preguntas?.map((pregunta, i) => (
                    <li key={i} className="p-4 bg-gray-100 rounded">
                        <strong>Pregunta {i + 1}:</strong> {obtenerTextoPregunta(pregunta)}
                    </li>
                ))}
            </ul>

            <button
                onClick={() => navigate(-1)}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Volver
            </button>
        </div>
    );
};

export default VerForm;
