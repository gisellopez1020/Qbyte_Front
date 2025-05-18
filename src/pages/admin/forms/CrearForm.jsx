import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearForm = () => {
    const [titulo, setTitulo] = useState("");
    const [norma, setNorma] = useState("");
    const [preguntas, setPreguntas] = useState([""]);
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();

    const agregarPregunta = () => {
        setPreguntas([...preguntas, ""]);
    };

    const actualizarPregunta = (index, valor) => {
        const nuevas = [...preguntas];
        nuevas[index] = valor;
        setPreguntas(nuevas);
    };

    const eliminarPregunta = (index) => {
        setPreguntas(preguntas.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo || !norma || preguntas.some((p) => p.trim() === "")) {
            setMensaje({
                tipo: "error",
                texto: "Completa todos los campos y preguntas antes de enviar.",
            });
            return;
        }

        const payload = { titulo, norma, preguntas };

        try {
            const res = await fetch("http://localhost:8000/formulario/crear_formulario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Error al crear el formulario");
            }

            setMensaje({ tipo: "exito", texto: "Formulario creado exitosamente." });
            setTimeout(() => navigate("/forms"), 2000);
        } catch (err) {
            setMensaje({ tipo: "error", texto: err.message });
        }
    };

    return (
        <div className="h-screen overflow-y-auto px-4 py-6 bg-gray-100">
            <div className="relative py-11 min-h-[700px] max-w-[1200px] mx-auto rounded-3xl bg-sky-900/30 px-4">
                <h1 className="text-2xl font-bold mb-6 text-center text-white">Crear nuevo formulario</h1>

                {mensaje && (
                    <div className={`max-w-xl mx-auto mb-6 p-4 rounded shadow-md text-white ${mensaje.tipo === "exito" ? "bg-green-500" : "bg-red-500"}`}>
                        <div className="text-center font-semibold">{mensaje.texto}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                    <div className="bg-white p-4 rounded shadow-md">
                        <label className="block font-medium text-gray-700 mb-1">Título del formulario:</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="bg-white p-4 rounded shadow-md">
                        <label className="block font-medium text-gray-700 mb-1">Norma:</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={norma}
                            onChange={(e) => setNorma(e.target.value)}
                            required
                        />
                    </div>

                    {preguntas.map((pregunta, i) => (
                        <div key={i} className="bg-white p-4 rounded shadow-md">
                            <label className="block font-medium text-gray-700 mb-1">
                                Pregunta {i + 1}:
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded p-2 mb-2"
                                value={pregunta}
                                onChange={(e) => actualizarPregunta(i, e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => eliminarPregunta(i)}
                                className="text-red-600 text-sm hover:underline"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    <div className="flex gap-x-4 mt-4 justify-center flex-wrap">
                        <button
                            type="button"
                            onClick={agregarPregunta}
                            className="bg-gradient-to-r from-[#2067af] to-blue-950
                            hover:from-[#1b5186] hover:to-blue-900
                            transition-all duration-200 ease-in-out text-white px-4 py-2
                            rounded-lg active:scale-95 active:shadow-inner hover:scale-105"
                        >
                            Agregar Pregunta
                        </button>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#2067af] to-blue-950
                            hover:from-[#1b5186] hover:to-blue-900
                            transition-all duration-200 ease-in-out text-white px-4 py-2
                            rounded-lg active:scale-95 active:shadow-inner hover:scale-105"
                        >
                            Guardar formulario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearForm;
