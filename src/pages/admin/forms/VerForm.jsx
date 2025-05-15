import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerForm = () => {
    const { id } = useParams();
    const [formulario, setFormulario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormulario = async () => {
            try {
                let res = await fetch(
                    `http://localhost:8000/formulario/listar_por_norma?norma=${encodeURIComponent(
                        id
                    )}`
                );
                const data = await res.json();
                setFormulario(data);
            } catch (error) {
                console.error("Error al cargar el formulario:", error);
            }
        };

        fetchFormulario();
    }, [id]);

    if (!formulario) {
        return <p className="text-center mt-10">Cargando formulario...</p>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-2">{formulario.titulo}</h1>
            <h2 className="text-lg font-medium text-gray-700 mb-6">
                Norma: {formulario.norma}
            </h2>

            <ul className="space-y-4">
                {formulario.preguntas.map((pregunta, i) => (
                    <li key={i} className="p-4 bg-gray-100 rounded">
                        <strong>Pregunta {i + 1}:</strong> {pregunta}
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
