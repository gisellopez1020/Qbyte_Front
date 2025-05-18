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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

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
  const [auditoresExternos, setAuditoresExternos] = useState([]);

  useEffect(() => {
    const obtenerAuditoresExternos = async () => {
      try {
        const respuesta = await fetch(`http://localhost:8000/auditor_externo/listar_auditores_externos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        });
        
        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        setAuditoresExternos(datos);
      } catch (error) {
        console.error("Error al obtener auditores externos:", error);
        setMensaje({ texto: "Error al obtener auditores externos", tipo: "error" });
      }
    };

    obtenerAuditoresExternos();
  }, []);

  const enviarAAuditorExterno = async (planId) => {
    if (!auditorId) {
      setMensaje({ texto: "Auditor interno no identificado", tipo: "error" });
      return;
    }

    setCargando(true);
    try {
      const url = `http://localhost:8000/plan_de_accion/enviar_a_auditorExterno`;
      const respuesta = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Añadir headers para CORS
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          plan_id: planId,
          auditorI_id: auditorId 
        }),
      });

      if (respuesta.ok) {
        setMensaje({ texto: "Plan enviado exitosamente a un auditor externo", tipo: "exito" });
        cargarPlanes(auditorId);
      } else {
        const error = await respuesta.json().catch(() => ({ detail: "Error desconocido" }));
        setMensaje({ texto: `Error: ${error.detail || 'Error al procesar la solicitud'}`, tipo: "error" });
      }
    } catch (error) {
      console.error("Error al enviar a auditor externo:", error);
      setMensaje({ texto: "Error al conectar con el servidor. Verifica que el servidor esté en ejecución.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const obtenerAuditorNombre = async () => {
      if (!usuario || !usuario.uid) return;
      
      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datosUsuario = docSnap.data();
          setAuditorNombre(datosUsuario.name);
        } else {
          console.log("No se encontró el documento del usuario.");
          return null;
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        return null;
      }
    };
    
    if (usuario) {
      obtenerAuditorNombre();
    }
  }, [usuario]);

  useEffect(() => {
    const obtenerAuditorId = async () => {
      if (usuario && usuario.email) {
        try {
          console.log("Buscando auditor con email:", usuario.email);
          const res = await fetch(
            `${API_BASE_URL}/auditor_interno/listar_auditores_internos`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Añadir headers para CORS
                "Access-Control-Allow-Origin": "*"
              },
            }
          );
          
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          
          const auditores = await res.json();

          const auditor = auditores.find(
            (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
          );

          if (auditor && auditor._id) {
            setAuditorId(auditor._id);
            cargarPlanes(auditor._id);
          } else {
            console.warn("No se encontró el auditor con email:", usuario.email);
          }
        } catch (error) {
          console.error("Error al obtener el ID del auditor:", error);
          setMensaje({ texto: "Error al obtener datos del auditor", tipo: "error" });
        }
      }
    };

    obtenerAuditorId();
  }, [usuario]);

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

    setCargando(true);
    try {
      const respuesta = await fetch(
        `http://localhost:8000/plan_de_accion/añadir_evidencias`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Añadir headers para CORS
            "Access-Control-Allow-Origin": "*"
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
        const error = await respuesta.json().catch(() => ({ detail: "Error desconocido" }));
        setMensaje({ texto: `Error: ${error.detail || 'Error al procesar la solicitud'}`, tipo: "error" });
      }
    } catch (error) {
      console.error("Error al enviar evidencias:", error);
      setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  const cargarPlanes = async (auditorId) => {
    if (!auditorId) return;
    
    setCargando(true);
    try {
      const respuesta = await fetch(
        `http://localhost:8000/plan_de_accion/listar_plan_por_auditor_interno?auditorI_id=${auditorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      
      const datos = await respuesta.json();
      setPlanes(datos);
    } catch (error) {
      console.error("Error al cargar planes:", error);
      setMensaje({ texto: "Error al cargar planes de acción", tipo: "error" });
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
        `http://localhost:8000/plan_de_accion/guardar_plan`,
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
        const error = await respuesta.json().catch(() => ({ detail: "Error desconocido" }));
        setMensaje({ texto: `Error: ${error.detail || 'Error al procesar la solicitud'}`, tipo: "error" });
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
            {auditorNombre || "Cargando..."}
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
                          disabled={cargando}
                        >
                          {cargando ? "Enviando..." : "Enviar Evidencias"}
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between mt-5">
                    <button
                      onClick={() => enviarAAuditorExterno(plan._id)}
                      className="bg-primary hover:bg-blue-800 text-white py-2 px-6 rounded-md"
                      disabled={cargando}
                    >
                      {cargando ? "Enviando..." : "Enviar a Auditor Externo"}
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
                        disabled={cargando}
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
    </div>
  );
};

export default Plan;