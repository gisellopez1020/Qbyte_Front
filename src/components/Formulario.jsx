import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Formulario = () => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [formulario, setFormulario] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [auditorId, setAuditorId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerAuditorId = async () => {
      if (usuario && usuario.email) {
        try {
          console.log("Buscando auditor con email:", usuario.email);
          const res = await fetch(
            `http://localhost:8000/auditor_interno/listar_auditores_internos`
          );
          const auditores = await res.json();

          const auditor = auditores.find(
            (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
          );

          if (auditor && auditor._id) {
            console.log("Auditor encontrado:", auditor);
            setAuditorId(auditor._id);
          } else {
            console.error("No se encontró un auditor con ese email");
          }
        } catch (error) {
          console.error("Error al obtener el ID del auditor:", error);
        }
      }
    };

    obtenerAuditorId();
  }, [usuario]);

  useEffect(() => {
    const obtenerFormulario = async () => {
      try {
        console.log("Obteniendo formulario para norma:", id);
        let res = await fetch(
          `http://localhost:8000/formulario/listar_por_nombre?nombre=${encodeURIComponent(
            id
          )}`
        );

        if (!res.ok) {
          console.log(
            "No se encontró por norma, buscando en todos los formularios"
          );
          const resAll = await fetch(
            "http://localhost:8000/formulario/listar_formularios/"
          );

          const allForms = await resAll.json();
          console.log("Todos los formularios:", allForms);

          const formFound = allForms.find(
            (f) => f.nombre && f.nombre.includes(id)
          );

          if (formFound) {
            console.log(
              "Formulario encontrado en la lista completa:",
              formFound
            );
            setFormulario(formFound);

            if (formFound.preguntas && Array.isArray(formFound.preguntas)) {
              initializeRespuestas(formFound.preguntas);
            }
            return;
          }
        } else {
          const data = await res.json();
          console.log("Datos recibidos del API:", data);

          setFormulario(data);

          // Inicializar las respuestas
          if (data && data.preguntas && Array.isArray(data.preguntas)) {
            initializeRespuestas(data.preguntas);
          }
        }
      } catch (error) {
        console.error("Error al obtener el formulario:", error);
        setMensaje({
          tipo: "error",
          texto: "Error al cargar el formulario",
        });
      }
    };

    // Función auxiliar para inicializar respuestas
    const initializeRespuestas = (preguntas) => {
      const respuestasIniciales = preguntas.map((pregunta) => {
        const textoPregunta =
          typeof pregunta === "string"
            ? pregunta
            : pregunta && typeof pregunta === "object" && pregunta.input
            ? pregunta.input
            : String(pregunta);

        return {
          pregunta: textoPregunta,
          respuesta: "",
          evidencia: "",
        };
      });

      setRespuestas(respuestasIniciales);
    };

    if (id) obtenerFormulario();
  }, [id]);

  const handleChange = (index, campo, valor) => {
    setRespuestas((prevRespuestas) => {
      const nuevasRespuestas = [...prevRespuestas];
      if (nuevasRespuestas[index]) {
        nuevasRespuestas[index] = {
          ...nuevasRespuestas[index],
          [campo]: valor,
        };
      }
      return nuevasRespuestas;
    });
  };

  const enviarRespuestas = async (e) => {
    e.preventDefault();

    // Verificación de respuestas completas
    const respuestasIncompletas = respuestas.some(
      (r) => !r.respuesta || !r.evidencia
    );

    if (respuestasIncompletas) {
      setMensaje({
        tipo: "error",
        texto: "Por favor complete todas las respuestas y evidencias",
      });
      return;
    }

    // Verificación de ID del auditor
    if (!auditorId) {
      setMensaje({
        tipo: "error",
        texto:
          "No se pudo identificar el auditor. Por favor, intente nuevamente.",
      });
      return;
    }

    // Verificación de ID del formulario
    if (!formulario || !formulario._id) {
      setMensaje({
        tipo: "error",
        texto:
          "No se pudo identificar el formulario. Por favor, recargue la página.",
      });
      return;
    }

    const payload = {
      titulo:
        formulario?.nombre ||
        formulario?.descripcion ||
        "Formulario de evaluación",
      respuestas: respuestas,
      auditorInterno: auditorId,
      idFormulario: formulario._id,
    };

    console.log("Datos a enviar:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(
        "http://localhost:8000/respuesta/crear_respuesta",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        setMensaje({
          tipo: "error",
          texto: Array.isArray(errorData.detail)
            ? errorData.detail.join(", ")
            : errorData.detail || `Error al enviar formulario (${res.status})`,
        });
      } else {
        const result = await res.json();
        console.log("Respuesta exitosa:", result);
        setMensaje({
          tipo: "exito",
          texto: "Formulario enviado con éxito.",
        });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setMensaje({
        tipo: "error",
        texto: "No se pudo conectar con el servidor.",
      });
    }
  };

  // Si no hay datos de formulario, se muestra un mensaje de carga
  if (!formulario) {
    return <div className="text-center p-5">Cargando formulario...</div>;
  }

  // Si no hay preguntas o no es un array
  if (
    !formulario.preguntas ||
    !Array.isArray(formulario.preguntas) ||
    formulario.preguntas.length === 0
  ) {
    return (
      <div className="p-5 text-center text-red-600">
        Error: No se encontraron preguntas en el formulario
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto py-8 bg-gray-50">
      <div className="bg-slate-200 mx-auto rounded-2xl shadow-sm flex-1 p-4 max-h-[80vh] max-w-[70vw] overflow-y-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {formulario.nombre ||
            formulario.descripcion ||
            "Formulario de evaluación"}
        </h1>

        {/* Mensaje de éxito o error */}
        {mensaje && (
          <div
            className={`max-w-xl mx-auto mb-6 p-4 rounded shadow-md text-white ${
              mensaje.tipo === "exito" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div className="text-center font-semibold">{mensaje.texto}</div>
            {mensaje.tipo === "exito" && (
              <div className="text-center mt-3">
                <button
                  className="bg-white text-green-600 px-4 py-1 rounded hover:bg-gray-100 font-medium"
                  onClick={() => {
                    const reportData = {
                      formularioId: formulario._id,
                      formularioTitulo:
                        formulario?.titulo ||
                        formulario?.nombre ||
                        "Formulario de evaluación",
                      nombre: id,
                      fechaEnvio: new Date().toISOString(),
                      respuestas: respuestas,
                    };
                    localStorage.setItem(
                      "lastSubmittedFormData",
                      JSON.stringify(reportData)
                    );
                    navigate("/reports");
                  }}
                >
                  Ver reporte
                </button>
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={enviarRespuestas}
          className="space-y-6 max-w-3xl mx-auto"
        >
          {formulario.preguntas.map((pregunta, i) => {
            let preguntaTexto = "";

            if (typeof pregunta === "string") {
              preguntaTexto = pregunta;
            } else if (pregunta && typeof pregunta === "object") {
              preguntaTexto = pregunta.input || "Pregunta sin texto";
            } else {
              preguntaTexto = String(pregunta);
            }

            return (
              <div key={i} className="bg-white p-4 rounded shadow-md">
                <div className="font-medium text-lg text-gray-700 mb-2">
                  {i + 1}. {preguntaTexto}
                </div>
                <select
                  className="w-full border rounded p-2"
                  value={respuestas[i]?.respuesta || ""}
                  onChange={(e) => handleChange(i, "respuesta", e.target.value)}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Cumple">Cumple</option>
                  <option value="No cumple">No cumple</option>
                  <option value="Medianamente cumple">
                    Medianamente cumple
                  </option>
                </select>
                <div className="mt-2">
                  <label className="text-sm text-gray-600">
                    Subir evidencia:
                  </label>
                  <input
                    type="url"
                    className="w-full border rounded p-2"
                    placeholder="Link del repositorio"
                    value={respuestas[i]?.evidencia || ""}
                    onChange={(e) =>
                      handleChange(i, "evidencia", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            );
          })}

          <button
            type="submit"
            className="flex items-center gap-2 
                    bg-gradient-to-r from-[#2067af] to-blue-950
                    hover:from-[#1b5186] hover:to-blue-900
                    transition-all duration-200 ease-in-out text-white px-4 py-2
                    rounded-lg active:scale-95 active:shadow-md hover:scale-105"
          >
            Enviar formulario
          </button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;
