import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearForm = () => {
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!archivo) {
            setMensaje({
                tipo: "error",
                texto: "Por favor selecciona un archivo PDF.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", archivo);

        try {
            const res = await fetch("http://localhost:8000/rag/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Error al subir el archivo");
            }

            setMensaje({ tipo: "exito", texto: data.message || "Archivo subido exitosamente." });
        } catch (err) {
            setMensaje({ tipo: "error", texto: err.message });
        }
    };

    const generarFormulario = async () => {
        try {
            const res = await fetch("http://localhost:8000/rag/generar_formulario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: "" }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Error al generar el formulario");
            }

            // Aquí puedes guardar el formulario en estado, redirigir, o mostrarlo:
            console.log("Formulario generado:", data);
            setMensaje({ tipo: "exito", texto: "Formulario generado correctamente." });
            navigate("/forms");
        } catch (err) {
            setMensaje({ tipo: "error", texto: err.message });
        }
    };

    return (
        <div className="relative py-11 mx-auto">
            <div className="max-h-[500px] overflow-y-auto h-screen mx-auto max-w-[1200px] px-4 py-4 bg-sky-900/30 rounded-3xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-black">Subir Documento</h1>

                {mensaje && (
                    <div className={`max-w-xl mx-auto mb-6 p-4 rounded shadow-md text-white ${mensaje.tipo === "exito" ? "bg-green-500" : "bg-red-500"}`}>
                        <div className="text-center font-semibold">{mensaje.texto}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                    <div className="bg-white p-4 rounded shadow-md">
                        <label className="block font-medium text-gray-700 mb-2">Selecciona un archivo PDF:</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            className="w-full border rounded p-2"
                            onChange={(e) => setArchivo(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#2067af] to-blue-950
                            hover:from-[#1b5186] hover:to-blue-900
                            transition-all duration-200 ease-in-out text-white px-6 py-2
                            rounded-lg active:scale-95 active:shadow-inner hover:scale-105"
                        >
                            Subir Documento
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={generarFormulario}
                            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                        >
                            Generar Formulario
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearForm;
