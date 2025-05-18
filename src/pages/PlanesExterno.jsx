import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Save,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PlanesAuditorExterno = () => {
  const [planes, setPlanes] = useState([]);
  const [expandidos, setExpandidos] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const { usuario } = useAuth();

  const [auditorExternoId, setAuditorExternoId] = useState("");
  const [auditorExternoNombre, setAuditorExternoNombre] = useState("");

  useEffect(() => {
    const obtenerAuditorYPlanes = async () => {
      if (!usuario?.email) return;

      try {
        const res = await fetch("http://localhost:8000/auditor_externo/listar_auditores_externos");
        const auditores = await res.json();

        const auditor = auditores.find(
          (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
        );
        
        if (!auditor) {
          setMensaje({ texto: "No se encontró el auditor externo", tipo: "error" });
          setCargando(false);
          return;
        }

        setAuditorExternoId(auditor._id);
        setAuditorExternoNombre(auditor.nombre);

 
        try {
          console.log("Obteniendo planes para auditor externo ID:", auditor._id);
          
          const resPlanes = await fetch(
            `http://localhost:8000/plan_de_accion/listar_plan_por_auditor_interno?auditor_id=${auditor._id}`
          );
          
          if (!resPlanes.ok) {
            console.error(`Error HTTP: ${resPlanes.status}`);
            throw new Error(`Error HTTP: ${resPlanes.status}`);
          }
          
          const planesData = await resPlanes.json();
          console.log("Planes obtenidos:", planesData);
          
          if (!Array.isArray(planesData)) {
            console.log("La respuesta no es un array, convirtiendo:", planesData);
            const planesArray = Array.isArray(planesData) ? planesData : 
                               planesData && typeof planesData === 'object' ? [planesData] : [];
            setPlanes(planesArray);
            
            const comentariosIniciales = {};
            planesArray.forEach((plan) => {
              if (plan && plan._id) {
                comentariosIniciales[plan._id] = plan.comentario || "";
              }
            });
            setComentarios(comentariosIniciales);
          } else {
            setPlanes(planesData);
            
            const comentariosIniciales = {};
            planesData.forEach((plan) => {
              if (plan && plan._id) {
                comentariosIniciales[plan._id] = plan.comentario || "";
              }
            });
            setComentarios(comentariosIniciales);
          }
        } catch (planesError) {
          console.error("Error al obtener planes:", planesError);
          setMensaje({ texto: "Error al obtener planes: " + planesError.message, tipo: "error" });
          setPlanes([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setMensaje({ texto: "Error al conectar con el servidor", tipo: "error" });
      } finally {
        setCargando(false);
      }
    };

    obtenerAuditorYPlanes();
  }, [usuario]);

  const toggleExpandido = (id) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const actualizarComentario = (planId, texto) => {
    setComentarios((prev) => ({ ...prev, [planId]: texto }));
  };

  const guardarComentario = async (planId) => {
    const comentario = comentarios[planId]?.trim();
    if (!comentario) {
      setMensaje({ texto: "El comentario no puede estar vacío", tipo: "error" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
      return;
    }

    setProcesando(true);
    try {
      const res = await fetch("http://localhost:8000/plan_de_accion/agregar_comentario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId, comentario }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error al enviar comentario");
      }

      setMensaje({ texto: "Comentario enviado correctamente", tipo: "exito" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    } catch (err) {
      console.error("Error al guardar comentario:", err);
      setMensaje({ texto: `Error: ${err.message}`, tipo: "error" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    } finally {
      setProcesando(false);
    }
  };

  const enviarPlanAlAuditorInterno = async (planId) => {
    setProcesando(true);
    try {

      const auditorInternoId = planes.find(p => p._id === planId)?.auditor_interno;
      
      if (!auditorInternoId) {
        throw new Error("No se pudo encontrar el ID del auditor interno para este plan");
      }
      
      console.log("Enviando plan", planId, "al auditor interno", auditorInternoId);
      
      const res = await fetch(`http://localhost:8000/plan_de_accion/enviar_a_auditorExterno?auditorI_id=${auditorInternoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          plan_id: planId 
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error al enviar plan");
      }

      setPlanes((prev) => prev.filter((plan) => plan._id !== planId));
      setMensaje({ texto: "Plan enviado al auditor interno y eliminado de tu lista", tipo: "exito" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    } catch (err) {
      console.error("Error al enviar plan:", err);
      setMensaje({ texto: `Error: ${err.message}`, tipo: "error" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    } finally {
      setProcesando(false);
    }
  };

  const actualizarComentarioYEstado = async (planId, estado) => {
    const comentario = comentarios[planId]?.trim();
    if (!comentario) {
      setMensaje({ texto: "Debe agregar un comentario antes de evaluar", tipo: "error" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
      return;
    }

    setProcesando(true);
    try {
      console.log("Actualizando plan", planId, "con estado", estado, "y comentario", comentario);
      
      const res = await fetch("http://localhost:8000/plan_de_accion/actualizar_comentario_estado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: planId,
          comentario: comentario,
          estado: estado
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error al actualizar estado");
      }

      setPlanes((prev) => 
        prev.map((plan) => 
          plan._id === planId ? {...plan, estado: estado, comentario: comentario} : plan
        )
      );

      setMensaje({ texto: `Plan ${estado === "Evaluado" ? "evaluado" : "actualizado"} correctamente`, tipo: "exito" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setMensaje({ texto: `Error: ${err.message}`, tipo: "error" });
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
        <ClipboardList className="mr-2" /> Planes de Acción Asignados
      </h1>

      {mensaje.texto && (
        <div
          className={`mb-4 p-4 rounded flex items-center ${
            mensaje.tipo === "exito" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje.tipo === "error" ? (
            <AlertCircle className="mr-2" size={20} />
          ) : (
            <Save className="mr-2" size={20} />
          )}
          {mensaje.texto}
        </div>
      )}

      {cargando ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : planes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded border">
          <p className="text-gray-600">No hay planes de acción asignados a revisar.</p>
          <p className="text-sm text-gray-500 mt-2">Los planes aparecerán aquí cuando un auditor interno te asigne planes para revisar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {planes.map((plan) => (
            <div key={plan._id} className="border rounded bg-white shadow-sm">
              <div
                className="p-4 flex justify-between cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={() => toggleExpandido(plan._id)}
              >
                <div>
                  <h2 className="font-medium text-lg">{plan.objetivo || "Sin objetivo definido"}</h2>
                  <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                    <p>De: {plan.auditor_interno_nombre || "Auditor Interno"}</p>
                    <p>Estado: <span className={`font-medium ${
                      plan.estado === "Evaluado" ? "text-green-600" : 
                      plan.estado === "Rechazado" ? "text-red-600" : "text-yellow-600"
                    }`}>{plan.estado || "Pendiente"}</span></p>
                  </div>
                </div>
                {expandidos[plan._id] ? <ChevronUp /> : <ChevronDown />}
              </div>

              {expandidos[plan._id] && (
                <div className="p-4 border-t">
                  {plan.etapas && plan.etapas.length > 0 ? (
                    <>
                      <h3 className="font-semibold mb-2">Etapas</h3>
                      {plan.etapas.map((etapa, idx) => (
                        <div key={idx} className="mb-4 p-3 bg-gray-50 rounded border">
                          <p className="font-medium">
                            Meta {idx + 1}: {etapa.meta || "Sin definir"}
                          </p>
                          {etapa.responsable && (
                            <p className="text-sm text-gray-700">Responsable: {etapa.responsable}</p>
                          )}
                          {etapa.indicadores && etapa.indicadores.length > 0 && (
                            <>
                              <p className="text-sm font-medium mt-2">Indicadores:</p>
                              <ul className="list-disc ml-5 text-sm text-gray-700">
                                {etapa.indicadores.map((ind, i) => (
                                  <li key={i}>{ind}</li>
                                ))}
                              </ul>
                            </>
                          )}
                          {etapa.evidencia && (
                            <p className="text-sm mt-2 italic">Evidencia: {etapa.evidencia}</p>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-yellow-600 mb-4 flex items-center">
                      <AlertCircle className="mr-2" size={16} />
                      No hay etapas definidas en este plan
                    </p>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tu comentario:
                    </label>
                    <textarea
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                      rows="3"
                      placeholder="Escribe tu evaluación del plan..."
                      value={comentarios[plan._id] || ""}
                      onChange={(e) => actualizarComentario(plan._id, e.target.value)}
                    ></textarea>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => guardarComentario(plan._id)}
                        disabled={procesando}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                      >
                        <Save className="mr-1" size={16} /> Guardar comentario
                      </button>
                      
                      <button
                        onClick={() => actualizarComentarioYEstado(plan._id, "Evaluado")}
                        disabled={procesando}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
                      >
                        <Save className="mr-1" size={16} /> Aprobar plan
                      </button>
                      
                      <button
                        onClick={() => actualizarComentarioYEstado(plan._id, "Rechazado")}
                        disabled={procesando}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
                      >
                        <AlertCircle className="mr-1" size={16} /> Rechazar plan
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => enviarPlanAlAuditorInterno(plan._id)}
                      disabled={procesando}
                      className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50 flex items-center"
                    >
                      <MessageSquare className="mr-1" size={16} /> Enviar plan al auditor interno
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Nota: Esto eliminará el plan de tu lista una vez enviado.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanesAuditorExterno;