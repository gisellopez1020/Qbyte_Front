import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  Send
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Plan = () => {
  const [planes, setPlanes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [expandidos, setExpandidos] = useState({});
  const [modoEvidencias, setModoEvidencias] = useState({});
  const [evidenciasEditadas, setEvidenciasEditadas] = useState({});
  const [auditorNombre, setAuditorNombre] = useState("");
  const [auditorId, setAuditorId] = useState("");
  const { usuario } = useAuth();
  const [objetivo, setObjetivo] = useState("");
  const [etapas, setEtapas] = useState([
    { meta: "", evidencia: "Aun no ha cargado evidencia para esta meta" },
  ]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [isopen, setIsopen] = useState(false);
  const [auditoresExternos, setAuditoresExternos] = useState([]);
  const [auditorExternoSeleccionado, setAuditorExternoSeleccionado] = useState("");
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [cargandoAuditores, setCargandoAuditores] = useState(false);
  const [enviandoPlan, setEnviandoPlan] = useState(false);

  useEffect(() => {
    const obtenerAuditorNombre = async () => {
      if (usuario && usuario.email) {
        try {
          console.log("Buscando auditor con email:", usuario.email);
          const res = await fetch(
            "http://localhost:8000/auditor_externo/listar_auditores_externos"
          );
          const auditores = await res.json();

          const auditor = auditores.find(
            (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
          );

          if (auditor && auditor.nombre) {
            setAuditorNombre(auditor.nombre);
          } else {
            console.error("No se encontró un auditor con ese email");
          }
        } catch (error) {
          console.error("Error al obtener el nombre del auditor:", error);
        }
      }
    };

    obtenerAuditorNombre();
  }, [usuario]);

  useEffect(() => {
    const obtenerAuditorId = async () => {
      if (usuario && usuario.email) {
        try {
          console.log("Buscando auditor con email:", usuario.email);
          const res = await fetch(
            "http://localhost:8000/auditor_externo/listar_auditores_externos"
          );
          const auditores = await res.json();

          const auditor = auditores.find(
            (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
          );

          if (auditor && auditor._id) {
            setAuditorId(auditor._id);
            cargarPlanes(auditor._id);
          }
        } catch (error) {
          console.error("Error al obtener el ID del auditor:", error);
        }
      }
    };

    obtenerAuditorId();
  }, [usuario]);

  useEffect(() => {
    const obtenerAuditorNombre = async () => {
      if (usuario && usuario.email) {
        try {
          console.log("Buscando auditor con email:", usuario.email);
          const res = await fetch(
            "http://localhost:8000/auditor_interno/listar_auditores_internos"
          );
          const auditores = await res.json();

          const auditor = auditores.find(
            (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
          );

          if (auditor && auditor.nombre) {
            setAuditorNombre(auditor.nombre);
          } else {
            console.error("No se encontró un auditor con ese email");
          }
        } catch (error) {
          console.error("Error al obtener el nombre del auditor:", error);
        }
      }
    };

    obtenerAuditorNombre();
  }, [usuario]);

  useEffect(() => {
    const obtenerAuditorId = async () => {
      if (usuario && usuario.email) {
        try {
          console.log("Buscando auditor con email:", usuario.email);
          const res = await fetch(
            "http://localhost:8000/auditor_interno/listar_auditores_internos"
          );
          const auditores = await res.json();

          const auditor = auditores.find(
            (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
          );

          if (auditor && auditor._id) {
            setAuditorId(auditor._id);
            cargarPlanes(auditor._id);
          }
        } catch (error) {
          console.error("Error al obtener el ID del auditor:", error);
        }
      }
    };

    obtenerAuditorId();
  }, [usuario]);

  // Función para obtener la lista de auditores externos
  const obtenerAuditoresExternos = async () => {
    setCargandoAuditores(true);
    try {
      const respuesta = await fetch(
        "http://localhost:8000/auditor_externo/listar_auditores_externos"
      );
      if (respuesta.ok) {
        const auditores = await respuesta.json();
        setAuditoresExternos(auditores);
      } else {
        console.error("Error al obtener auditores externos");
        setMensaje({ texto: "Error al obtener la lista de auditores externos", tipo: "error" });
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
    } finally {
      setCargandoAuditores(false);
    }
  };

  // Función para abrir el modal de auditores externos
  const abrirModalAuditoresExternos = (planId) => {
    setPlanSeleccionado(planId);
    setAuditorExternoSeleccionado("");
    obtenerAuditoresExternos();
    setIsopen(true);
  };

  // Función para enviar el plan al auditor externo seleccionado
  const enviarPlanAuditorExterno = async () => {
    if (!auditorExternoSeleccionado || !planSeleccionado) {
      setMensaje({ texto: "Debe seleccionar un auditor externo", tipo: "error" });
      return;
    }

    setEnviandoPlan(true);
    try {
      const respuesta = await fetch(
        "http://localhost:8000/plan_de_accion/enviar_plan_auditor_externo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_id: planSeleccionado,
            auditor_externo_id: auditorExternoSeleccionado
          })
        }
      );

      if (respuesta.ok) {
        setMensaje({ texto: "Plan enviado exitosamente al auditor externo", tipo: "exito" });
        setIsopen(false);
        cargarPlanes(auditorId); // Recargar planes después de enviar
      } else {
        const error = await respuesta.json();
        setMensaje({ texto: `Error: ${error.detail}`, tipo: "error" });
      }
    } catch (error) {
      console.error("Error al enviar plan:", error);
      setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
    } finally {
      setEnviandoPlan(false);
    }
  };

  const toggleModoEvidencias = (planId, etapas) => {
    setModoEvidencias((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));

    if (!modoEvidencias[planId]) {
      const evidenciasIniciales = {};
      etapas.forEach((etapa, i) => {
        evidenciasIniciales[i] = etapa.evidencia || "";
      });
      setEvidenciasEditadas((prev) => ({
        ...prev,
        [planId]: evidenciasIniciales,
      }));
    }
  };

  const actualizarEvidencia = (planId, indiceEtapa, valor) => {
    setEvidenciasEditadas((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [indiceEtapa]: valor,
      },
    }));
  };

  const enviarEvidencias = async (planId) => {
    const evidencias = Object.entries(evidenciasEditadas[planId] || {}).map(
      ([indice, evidencia]) => ({
        indice_etapa: parseInt(indice),
        evidencia,
      })
    );

    try {
      const respuesta = await fetch(
        "http://localhost:8000/plan_de_accion/añadir_evidencias",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_id: planId,
            evidencias,
          }),
        }
      );

      if (respuesta.ok) {
        setMensaje({
          texto: "Evidencias guardadas exitosamente",
          tipo: "exito",
        });
        cargarPlanes(auditorId);
        setModoEvidencias((prev) => ({ ...prev, [planId]: false }));
      } else {
        const error = await respuesta.json();
        setMensaje({ texto: `Error: ${error.detail}`, tipo: "error" });
      }
    } catch (error) {
      console.error("Error al enviar evidencias:", error);
      setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
    }
  };

  const cargarPlanes = async (auditorId) => {
    setCargando(true);
    try {
      const respuesta = await fetch(
        `http://localhost:8000/plan_de_accion/listar_plan_por_auditor_interno?auditorI_id=${auditorId}`
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
    if (!usuario || !auditorId) {
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
      auditor_interno: auditorId,
      comentario: "No se han realizado comentarios",
      estado: "pendiente",
    };

    setCargando(true);
    try {
      const respuesta = await fetch(
        "http://localhost:8000/plan_de_accion/guardar_plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoPlan),
        }
      );

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
        cargarPlanes(auditorId);
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
            {auditorNombre}
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
                          {modoEvidencias[plan._id] ? (
                            <textarea
                              value={
                                evidenciasEditadas[plan._id]?.[idx] ??
                                etapa.evidencia ??
                                ""
                              }
                              onChange={(e) =>
                                actualizarEvidencia(
                                  plan._id,
                                  idx,
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md mt-1"
                              rows="2"
                            />
                          ) : (
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
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-3">
                      <p className="font-medium text-gray-700">Comentario:</p>
                      <p className="text-gray-600">{plan.comentario}</p>
                    </div>

                    {modoEvidencias[plan._id] && (
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => enviarEvidencias(plan._id)}
                          className="bg-primary hover:bg-blue-800 text-white py-2 px-6 rounded-md"
                        >
                          Enviar Evidencias
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between mt-5">
                      <button 
                        className="bg-primary hover:bg-blue-800 text-white py-2 px-6 rounded-md flex items-center" 
                        onClick={() => abrirModalAuditoresExternos(plan._id)}
                      >
                        <Send size={18} className="mr-2" />
                        Enviar a Auditor Externo
                      </button>

                      <button
                        onClick={() =>
                          toggleModoEvidencias(plan._id, plan.etapas)
                        }
                        className={`text-sm font-medium ${
                          modoEvidencias[plan._id]
                            ? "text-red-600 hover:text-red-800"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
                      >
                        {modoEvidencias[plan._id]
                          ? "Cancelar"
                          : "Añadir Evidencias"}
                      </button>
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

      {/* Modal de Auditores Externos */}
      {isopen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Seleccionar Auditor Externo
              </h3>
              <button
                onClick={() => setIsopen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {cargandoAuditores ? (
              <div className="py-4 text-center text-gray-600">
                Cargando auditores externos...
              </div>
            ) : auditoresExternos.length > 0 ? (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Auditores disponibles:
                </label>
                <select
                  value={auditorExternoSeleccionado}
                  onChange={(e) => setAuditorExternoSeleccionado(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione un auditor externo</option>
                  {auditoresExternos.map((auditor) => (
                    <option key={auditor._id} value={auditor._id}>
                      {auditor.nombre}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="py-4 text-center text-gray-600">
                No hay auditores externos disponibles
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setIsopen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={!auditorExternoSeleccionado || enviandoPlan}
                onClick={enviarPlanAuditorExterno}
              >
                {enviandoPlan ? "Enviando..." : "Enviar Plan"}
                {!enviandoPlan && <Send size={16} className="ml-2" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plan;