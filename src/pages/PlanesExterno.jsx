import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  MessageSquare,
  Save
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PlanesAuditorExterno = () => {
  const [planes, setPlanes] = useState([]);
  const [expandidos, setExpandidos] = useState({});
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [comentarios, setComentarios] = useState({});
  const [auditorNombre, setAuditorNombre] = useState("");
  const [auditorId, setAuditorId] = useState("");
  const { usuario } = useAuth();
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // Nuevo estado para ingresar el ID del auditor interno
  const [auditorIIdInput, setAuditorIIdInput] = useState("");

  useEffect(() => {
    const obtenerDatosAuditor = async () => {
      if (usuario && usuario.email) {
        try {
          const res = await fetch(
            "http://localhost:8000/auditor_externo/listar_auditores_externos"
          );
          const auditores = await res.json();

          const auditor = auditores.find(
            (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
          );

          if (auditor) {
            setAuditorNombre(auditor.nombre);
            setAuditorId(auditor._id);
            // NO llamar cargarPlanes aquí para que el auditor externo ingrese el ID manualmente
            setCargando(false);
          } else {
            console.error("No se encontró un auditor externo con ese email");
            setMensaje({
              texto: "No se encontró información de auditor externo. Verifique sus credenciales.",
              tipo: "error"
            });
            setCargando(false);
          }
        } catch (error) {
          console.error("Error al obtener información del auditor externo:", error);
          setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
          setCargando(false);
        }
      } else {
        setCargando(false);
      }
    };

    obtenerDatosAuditor();
  }, [usuario]);

  const cargarPlanes = async (auditorI_id) => {
    setCargando(true);
    try {
      const respuesta = await fetch(
        `http://localhost:8000/plan_de_accion/listar_auditores_internos?auditorI_id=${auditorI_id}`
      );
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setPlanes(datos);

        // Inicializar comentarios con los valores actuales
        const comentariosIniciales = {};
        datos.forEach(plan => {
          comentariosIniciales[plan._id] = plan.comentario || "";
        });
        setComentarios(comentariosIniciales);
      } else {
        console.error("Error al cargar planes");
        setMensaje({ texto: "No se pudieron cargar los planes de acción", tipo: "error" });
      }
    } catch (error) {
      console.error("Error al cargar planes:", error);
      setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  // Nueva función para manejar la búsqueda con el ID ingresado
  const manejarBuscarPlanes = () => {
    if (!auditorIIdInput.trim()) {
      setMensaje({ texto: "Por favor ingrese el número de solicitud (ID)", tipo: "error" });
      return;
    }
    cargarPlanes(auditorIIdInput.trim());
  };

  const toggleExpandido = (id) => {
    setExpandidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const actualizarComentario = (planId, comentario) => {
    setComentarios(prev => ({
      ...prev,
      [planId]: comentario
    }));
  };

  const guardarComentario = async (planId) => {
    if (!comentarios[planId]?.trim()) {
      setMensaje({ texto: "El comentario no puede estar vacío", tipo: "error" });
      return;
    }

    setEnviandoComentario(true);
    try {
      const respuesta = await fetch(
        "http://localhost:8000/plan_de_accion/agregar_comentario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_id: planId,
            comentario: comentarios[planId]
          }),
        }
      );

      if (respuesta.ok) {
        setMensaje({
          texto: "Comentario guardado exitosamente",
          tipo: "exito",
        });
        cargarPlanes(auditorId); // Recargar planes para ver cambios
      } else {
        const error = await respuesta.json();
        setMensaje({ texto: `Error: ${error.detail}`, tipo: "error" });
      }
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
    } finally {
      setEnviandoComentario(false);
    }
  };

  const cambiarEstadoPlan = async (planId, nuevoEstado) => {
    try {
      const respuesta = await fetch(
        "http://localhost:8000/plan_de_accion/cambiar_estado",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_id: planId,
            estado: nuevoEstado
          }),
        }
      );

      if (respuesta.ok) {
        setMensaje({
          texto: `Plan ${nuevoEstado === "aprobado" ? "aprobado" : "rechazado"} exitosamente`,
          tipo: "exito",
        });
        cargarPlanes(auditorId); // Recargar planes
      } else {
        const error = await respuesta.json();
        setMensaje({ texto: `Error: ${error.detail}`, tipo: "error" });
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ClipboardList className="mr-2" />
          Planes de Acción Asignados
        </h1>
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
      {usuario && auditorNombre && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            <span className="font-medium">Auditor Externo:</span>{" "}
            {auditorNombre}
          </p>
        </div>
      )}

      {/* Nuevo input para ingresar auditor interno ID */}
      <div className="mb-6 p-4 border rounded">
        <label htmlFor="auditorIId" className="block font-medium mb-2">
          Ingrese número de solicitud (ID del auditor interno):
        </label>
        <input
          id="auditorIId"
          type="text"
          value={auditorIIdInput}
          onChange={(e) => setAuditorIIdInput(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={manejarBuscarPlanes}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Buscar planes
        </button>
      </div>

      {/* Lista de Planes */}
      <div>
        {cargando ? (
          <div className="text-center py-8">Cargando planes asignados...</div>
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
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">
                      {plan.auditor_interno_nombre ? `De: ${plan.auditor_interno_nombre}` : ""}
                    </span>
                    {expandidos[plan._id] ? <ChevronUp /> : <ChevronDown />}
                  </div>
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
                            Indicadores:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {etapa.indicadores.map((ind, i) => (
                              <li key={i}>{ind}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-600">
                            Responsable:
                          </p>
                          <p className="text-gray-700">{etapa.responsable}</p>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4">
                      <label
                        htmlFor={`comentario-${plan._id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Comentario:
                      </label>
                      <textarea
                        id={`comentario-${plan._id}`}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={comentarios[plan._id] || ""}
                        onChange={(e) =>
                          actualizarComentario(plan._id, e.target.value)
                        }
                      ></textarea>

                      <button
                        onClick={() => guardarComentario(plan._id)}
                        disabled={enviandoComentario}
                        className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Guardar Comentario
                      </button>
                    </div>

                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => cambiarEstadoPlan(plan._id, "aprobado")}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center"
                      >
                        <CheckCircle className="mr-1" /> Aprobar
                      </button>
                      <button
                        onClick={() => cambiarEstadoPlan(plan._id, "rechazado")}
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 flex items-center"
                      >
                        <XCircle className="mr-1" /> Rechazar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No hay planes de acción asignados para este auditor interno.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanesAuditorExterno;
