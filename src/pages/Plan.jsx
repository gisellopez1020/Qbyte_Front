import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Plan = () => {
  const [planes, setPlanes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [expandidos, setExpandidos] = useState({});
  const { usuario } = useAuth();
  const [objetivo, setObjetivo] = useState("");
  const [etapas, setEtapas] = useState([
    { meta: "", evidencia: "Aun no ha cargado evidencia para esta meta" },
  ]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    if (usuario && usuario._id) {
      cargarPlanes(usuario._id);
    }
  }, [usuario]);

  const cargarPlanes = async (auditorId) => {
    setCargando(true);
    try {
      const respuesta = await fetch(
        `http://0.0.0.0:8000/listar_plan_por_auditor_interno?auditorI_id=${auditorId}`
      );
      const datos = await respuesta.json();
      setPlanes(datos);
    } catch (error) {
      console.error("Error al cargar planes:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async () => {
    if (!usuario || !usuario._id) {
      setMensaje({
        texto: "No se pudo identificar al auditor interno actual",
        tipo: "error",
      });
      return;
    }

    if (etapas.some((etapa) => !etapa.meta)) {
      setMensaje({
        texto: "Todas las metas deben tener contenido",
        tipo: "error",
      });
      return;
    }

    const nuevoPlan = {
      objetivo,
      etapas,
      auditor_interno: usuario._id,
      comentario: "No se han realizado comentarios",
      estado: "pendiente",
    };

    setCargando(true);
    try {
      const respuesta = await fetch("http://0.0.0.0:8000/guardar_plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoPlan),
      });

      if (respuesta.ok) {
        setMensaje({
          texto: "Plan de acción creado exitosamente",
          tipo: "exito",
        });
        // Resetear formulario
        setObjetivo("");
        setEtapas([
          { meta: "", evidencia: "Aun no ha cargado evidencia para esta meta" },
        ]);
        setMostrarFormulario(false);
        // Recargar planes
        cargarPlanes(usuario._id);
      } else {
        const error = await respuesta.json();
        setMensaje({ texto: `Error: ${error.detail}`, tipo: "error" });
      }
    } catch (error) {
      setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const agregarEtapa = () => {
    setEtapas([
      ...etapas,
      { meta: "", evidencia: "Aun no ha cargado evidencia para esta meta" },
    ]);
  };

  const eliminarEtapa = (index) => {
    if (etapas.length > 1) {
      const nuevasEtapas = [...etapas];
      nuevasEtapas.splice(index, 1);
      setEtapas(nuevasEtapas);
    }
  };

  const actualizarEtapa = (index, campo, valor) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[index] = { ...nuevasEtapas[index], [campo]: valor };
    setEtapas(nuevasEtapas);
  };

  const toggleExpandido = (id) => {
    setExpandidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ClipboardList className="mr-2" />
          Plan de Acción
        </h1>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          {mostrarFormulario ? "Cancelar" : "Nuevo Plan"}
          {!mostrarFormulario && <Plus className="ml-1" size={18} />}
        </button>
      </div>

      {/* Mensajes de notificación */}
      {mensaje.texto && (
        <div
          className={`p-4 mb-4 rounded-md ${
            mensaje.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Información del auditor logueado */}
      {usuario && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            <span className="font-medium">Auditor Interno:</span>{" "}
            {usuario.usuario}
          </p>
        </div>
      )}

      {/* Formulario para Crear Plan */}
      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            Crear Nuevo Plan de Acción
          </h2>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Objetivo del Plan
              </label>
              <textarea
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required
                placeholder="Describa el objetivo principal del plan de acción"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Etapas y Metas
              </label>
              {etapas.map((etapa, index) => (
                <div
                  key={index}
                  className="mb-3 p-4 border border-gray-200 rounded-md bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Etapa {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => eliminarEtapa(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={etapas.length <= 1}
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-600 text-sm mb-1">
                      Meta
                    </label>
                    <textarea
                      value={etapa.meta}
                      onChange={(e) =>
                        actualizarEtapa(index, "meta", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="2"
                      required
                      placeholder="Describa la meta a alcanzar"
                    ></textarea>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={agregarEtapa}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} className="mr-1" /> Agregar otra etapa
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={cargando}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md flex items-center"
              >
                {cargando ? "Guardando..." : "Guardar Plan"}
                {!cargando && <CheckCircle size={18} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Planes */}
      <div>
        {cargando ? (
          <div className="text-center py-8">Cargando planes...</div>
        ) : planes.length > 0 ? (
          <div className="space-y-4">
            {planes.map((plan) => (
              <div
                key={plan._id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <div
                  className="bg-gray-50 p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpandido(plan._id)}
                >
                  <div>
                    <h3 className="font-medium text-lg">{plan.objetivo}</h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          plan.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : plan.estado === "aprobado"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {plan.estado.charAt(0).toUpperCase() +
                          plan.estado.slice(1)}
                      </span>
                    </div>
                  </div>
                  {expandidos[plan._id] ? <ChevronUp /> : <ChevronDown />}
                </div>

                {expandidos[plan._id] && (
                  <div className="p-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Etapas:</h4>
                    {plan.etapas.map((etapa, idx) => (
                      <div key={idx} className="mb-3 p-3 bg-gray-50 rounded">
                        <p className="font-medium">Meta {idx + 1}:</p>
                        <p className="text-gray-700">{etapa.meta}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-600">
                            Evidencia:
                          </p>
                          <p className="text-sm text-gray-600">
                            {etapa.evidencia ===
                            "Aun no ha cargado evidencia para esta meta" ? (
                              <span className="italic text-gray-500">
                                {etapa.evidencia}
                              </span>
                            ) : (
                              etapa.evidencia
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-3">
                      <p className="font-medium text-gray-700">Comentario:</p>
                      <p className="text-gray-600">{plan.comentario}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : usuario ? (
          <div className="text-center py-8 text-gray-600">
            No hay planes de acción registrados. Cree uno nuevo.
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            Para ver sus planes de acción, debe iniciar sesión como auditor
            interno.
          </div>
        )}
      </div>
    </div>
  );
};

export default Plan;
