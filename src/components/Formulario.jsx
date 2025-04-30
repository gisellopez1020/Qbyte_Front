import { useParams } from "react-router-dom";
import { formularios } from "../config/formConfig";

const Formulario = () => {
  const { id } = useParams();
  const formulario = formularios.find((f) => f.id === id);

  if (!formulario) return <p>Formulario no encontrado</p>;

  return (
    <div className="p-5 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {formulario.nombre}
      </h1>
      <form className="space-y-6 max-w-3xl mx-auto">
        {formulario.preguntas.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow-md">
            <p className="font-medium text-lg text-gray-700 mb-2">
              {p.pregunta}
            </p>
            {p.tipo === "abierta" ? (
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Escriba su respuesta..."
              />
            ) : (
              <select className="w-full border rounded p-2">
                <option value="">Seleccione una opción</option>
                <option value="cumple">Cumple</option>
                <option value="no_cumple">No cumple</option>
                <option value="parcialmente_cumple">Parcialmente cumple</option>
              </select>
            )}
            <div className="mt-2">
              <label className="text-sm text-gray-600">Subir evidencia:</label>
              <input
                type="url"
                className="w-full border rounded p-2"
                placeholder="Link del repositorio"
              />
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-900"
        >
          Enviar formulario
        </button>
      </form>
    </div>
  );
};

export default Formulario;
