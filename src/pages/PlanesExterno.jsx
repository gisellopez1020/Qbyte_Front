import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Save,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  ChevronUp,
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
  const [nombresAuditoresInternos, setNombresAuditoresInternos] = useState({});

  const toggleExpandido = (id) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const actualizarComentario = (plan_id, texto) => {
    setComentarios((prev) => ({ ...prev, [plan_id]: texto }));
  };

  const actualizarComentarioYEstado = async (plan_id, estado) => {
    const comentario = comentarios[plan_id]?.trim();
    if (!comentario) {
      setMensaje({
        texto: "Debe agregar un comentario antes de evaluar",
        tipo: "error",
      });
      return setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    }

    setProcesando(true);
    try {
      const res = await fetch(
        "http://localhost:8000/plan_de_accion/actualizar_comentario_estado",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: plan_id, comentario, estado }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar estado");

      setPlanes((prev) =>
        prev.map((plan) =>
          plan._id === plan_id ? { ...plan, estado, comentario } : plan
        )
      );
      setMensaje({
        texto: `Plan actualizado correctamente`,
        tipo: "exito",
      });
    } catch (err) {
      console.error(err);
      setMensaje({ texto: "Error: " + err.message, tipo: "error" });
    } finally {
      setProcesando(false);
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    }
  };

  useEffect(() => {
    const obtenerAuditorYPlanes = async () => {
      if (!usuario?.email) return;

      try {
        const res = await fetch(
          "http://localhost:8000/auditor_externo/listar_auditores_externos"
        );
        const auditores = await res.json();

        const auditor = auditores.find(
          (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
        );
        if (!auditor) return;

        setAuditorExternoId(auditor._id);

        const res2 = await fetch(
          "http://localhost:8000/auditor_interno/listar_auditores_internos"
        );
        const data = await res2.json();
        const diccionario = {};
        data.forEach((a) => {
          diccionario[a._id] = a.nombre;
        });
        setNombresAuditoresInternos(diccionario);

        const planesData = await Promise.all(
          auditor.planesAsignados.map((id) =>
            fetch(
              `http://localhost:8000/plan_de_accion/listar_plan_por_id?plan_id=${id}`
            )
              .then((res) => res.json())
              .catch(() => [])
          )
        );
        const todos = planesData.flat();
        setPlanes(todos);

        const inicial = {};
        todos.forEach((p) => {
          inicial[p._id] = p.comentario || "";
        });
        setComentarios(inicial);
      } catch (e) {
        console.error(e);
        setMensaje({ texto: "Error al cargar datos", tipo: "error" });
      } finally {
        setCargando(false);
      }
    };

    obtenerAuditorYPlanes();
  }, [usuario]);

  const renderPlanes = (planesLista, color) => (
    <div className="bg-gradient-to-r bg-slate-300 rounded-2xl shadow-sm flex-1 p-4 max-h-[500px] overflow-y-auto space-y-4">
      {planesLista.map((plan) => (
        <div key={plan._id} className="border rounded ">
          <div
            className="p-3 bg-white flex justify-between  items-center cursor-pointer"
            onClick={() => toggleExpandido(plan._id)}
          >
            <div>
              <p className="font-semibold">{plan.objetivo || "Sin objetivo"}</p>
              <p className="text-sm text-gray-600">
                De: {nombresAuditoresInternos[plan.auditor_interno] || "N/A"}
              </p>
              <p className={`text-sm font-medium text-${color}-600`}>
                Estado: {plan.estado || "Pendiente"}
              </p>
            </div>
            {expandidos[plan._id] ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandidos[plan._id] && (
            <div className="p-4">
              {plan.etapas?.map((etapa, i) => (
                <div key={i} className="mb-2 p-2 bg-gray-50 border rounded">
                  <p>
                    <strong>Meta:</strong> {etapa.meta}
                  </p>
                  <p>
                    <strong>Responsable:</strong> {etapa.responsable}
                  </p>
                  {etapa.indicadores?.length > 0 && (
                    <ul className="list-disc ml-6">
                      {etapa.indicadores.map((ind, idx) => (
                        <li key={idx}>{ind}</li>
                      ))}
                    </ul>
                  )}
                  {etapa.evidencia && (
                    <p>
                      <em>Evidencia:</em> {etapa.evidencia}
                    </p>
                  )}
                </div>
              ))}

              <textarea
                className="w-full mt-2 border rounded p-2"
                rows={3}
                placeholder="Escribe tu comentario..."
                value={comentarios[plan._id] || ""}
                onChange={(e) => actualizarComentario(plan._id, e.target.value)}
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() =>
                    actualizarComentarioYEstado(plan._id, "Evaluado")
                  }
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Aprobar
                </button>
                <button
                  onClick={() =>
                    actualizarComentarioYEstado(plan._id, "Rechazado")
                  }
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const planesPendientes = planes.filter(
    (p) => !p.estado || p.estado === "pendiente"
  );
  const planesEvaluados = planes.filter((p) => p.estado === "Evaluado");
  const planesRechazados = planes.filter((p) => p.estado === "Rechazado");

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
        <ClipboardList className="mr-2" /> Planes de Acción Asignados
      </h1>

      {mensaje.texto && (
        <div
          className={`mb-4 p-4 rounded ${
            mensaje.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje.tipo === "error" ? (
            <AlertCircle className="mr-2 inline" />
          ) : (
            <Save className="mr-2 inline" />
          )}
          {mensaje.texto}
        </div>
      )}

      {cargando ? (
        <div className="text-center py-8">
          <div className="animate-spin h-12 w-12 border-b-3 border-blue-700 rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid  grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <h2 className="text-xl font-bold text-yellow-600 mb-2">
              Pendientes
            </h2>
            {renderPlanes(planesPendientes, "yellow")}
          </div>

          <div>
            <h2 className="text-xl font-bold text-green-600 mb-2">Evaluados</h2>
            {renderPlanes(planesEvaluados, "green")}
          </div>

          <div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Rechazados</h2>
            {renderPlanes(planesRechazados, "red")}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanesAuditorExterno;
