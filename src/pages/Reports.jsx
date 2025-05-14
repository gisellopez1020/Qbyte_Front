import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaChartPie } from "react-icons/fa";

const Reports = () => {
  const { usuario } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [totalesData, setTotalesData] = useState(null);

  const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

  const extractTotalesData = (content) => {
    if (!content) return null;

    try {
      // Si content es una cadena, intentamos parsearlo como JSON
      let data = content;
      if (typeof content === "string") {
        try {
          // Primero intentamos ver si toda la cadena es un JSON
          data = JSON.parse(content);
        } catch (e) {
          // Si no, buscamos si hay un objeto "totales" en la cadena usando regex
          const totalesMatch = content.match(/"totales"\s*:\s*({[^}]*})/);
          if (totalesMatch && totalesMatch[1]) {
            try {
              // Limpiamos el texto capturado y lo parseamos
              const totalesStr = totalesMatch[1].replace(/'/g, '"');
              data = JSON.parse(`{"totales":${totalesStr}}`);
            } catch (innerError) {
              console.error("Error parsing extracted totales:", innerError);
              return null;
            }
          } else {
            console.error("No totales object found in string");
            return null;
          }
        }
      }

      // Ahora que tenemos el objeto, intentamos extraer los totales
      if (data && data.totales) {
        const { bueno, regular, malo } = data.totales;
        if (
          bueno !== undefined ||
          regular !== undefined ||
          malo !== undefined
        ) {
          // Datos para el gráfico circular
          return [
            { name: "Bueno", value: bueno || 0, color: "#4CAF50" },
            { name: "Regular", value: regular || 0, color: "#FFC107" },
            { name: "Malo", value: malo || 0, color: "#F44336" },
          ].filter((item) => item.value >= 0); // Solo incluimos valores mayores que 0
        }
      }

      return null;
    } catch (error) {
      console.error("Error extracting totales data:", error);
      return null;
    }
  };

  // Cargar datos del último formulario
  useEffect(() => {
    const storedData = localStorage.getItem("lastSubmittedFormData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setReportData(parsedData);
      } catch (e) {
        console.error("Error al leer datos del formulario:", e);
      }
    }
  }, []);

  // Cargar reportes guardados desde Firebase
  useEffect(() => {
    const loadSavedReports = async () => {
      if (!usuario?.email) return;

      try {
        const q = query(
          collection(db, "reports"),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const reports = [];

        querySnapshot.forEach((doc) => {
          const reportData = doc.data();

          if (reportData.userEmail === usuario.email) {
            reports.push({
              id: doc.id,
              ...reportData,
            });
          }
        });

        setSavedReports(reports);
      } catch (error) {
        console.error("Error al cargar reportes guardados:", error);
      }
    };

    loadSavedReports();
  }, [usuario]);

  const generateReport = async () => {
    if (!reportData) {
      setError("No hay datos disponibles para generar el reporte");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = reportData;

      if (!data.respuestas || !Array.isArray(data.respuestas)) {
        throw new Error(
          "El formato de los datos no es válido. No se encontraron respuestas."
        );
      }

      const prompt = {
        prompt: data.respuestas.map((item) => ({
          pregunta: item.pregunta || "",
          respuesta: item.respuesta || "",
          evidencia: item.evidencia || "",
        })),
      };

      console.log("Enviando datos al servidor:", prompt);

      try {
        const response = await fetch(
          "http://localhost:8000/gemini/generar_reporte",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(prompt),
            // timeout
            signal: AbortSignal.timeout(30000),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Error del servidor: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();

        const reporteContent =
          typeof result === "object" && result !== null
            ? result.html ||
              result.content ||
              result.report ||
              JSON.stringify(result, null, 2)
            : result;

        // Extraer datos para el gráfico circular
        const totales = extractTotalesData(result);
        setTotalesData(totales);

        setReporte(reporteContent);

        // Guardar reporte en Firebase
        if (usuario?.email) {
          const reportDoc = {
            title: `Reporte: ${
              data.formularioTitulo || data.norma || data.titulo || "Sin título"
            }`,
            content: reporteContent,
            formData: data,
            userEmail: usuario.email,
            createdAt: new Date().toISOString(),
          };

          const docRef = await addDoc(collection(db, "reports"), reportDoc);
          console.log("Reporte guardado con ID:", docRef.id);

          setSavedReports((prev) => [{ id: docRef.id, ...reportDoc }, ...prev]);
        }
      } catch (fetchError) {
        console.error("Error de conexión:", fetchError);

        if (
          fetchError.message.includes("Failed to fetch") ||
          fetchError.message.includes("ERR_CONNECTION_REFUSED") ||
          fetchError.message.includes("ERR_ADDRESS_INVALID")
        ) {
          setError("Intentando conexión alternativa...");

          // URL alternativa
          const alternativeResponse = await fetch(
            "http://127.0.0.1:8000/gemini/generar_reporte",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(prompt),
              signal: AbortSignal.timeout(30000),
            }
          );

          if (!alternativeResponse.ok) {
            const errorText = await alternativeResponse.text();
            throw new Error(
              `Error del servidor (intento alternativo): ${alternativeResponse.status} - ${errorText}`
            );
          }

          const result = await alternativeResponse.json();
          // extraer el contenido HTML
          const reporteContent =
            typeof result === "object" && result !== null
              ? result.html ||
                result.content ||
                result.report ||
                JSON.stringify(result, null, 2)
              : result;

          const totales = extractTotalesData(result);
          setTotalesData(totales);

          setReporte(reporteContent);

          if (usuario?.email) {
            const reportDoc = {
              title: `Reporte: ${
                data.formularioTitulo ||
                data.norma ||
                data.titulo ||
                "Sin título"
              }`,
              content: result,
              formData: data,
              userEmail: usuario.email,
              createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, "reports"), reportDoc);
            console.log("Reporte guardado con ID:", docRef.id);

            // Actualizar la lista de reportes guardados
            setSavedReports((prev) => [
              { id: docRef.id, ...reportDoc },
              ...prev,
            ]);
          }
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError(`Error al generar el reporte: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Ver un reporte guardado
  const viewSavedReport = (report) => {
    setSelectedReport(report);

    const reportContent = report.content;
    if (typeof reportContent === "object" && reportContent !== null) {
      setReporte(
        reportContent.html ||
          reportContent.content ||
          reportContent.report ||
          JSON.stringify(reportContent, null, 2)
      );

      const totales = extractTotalesData(reportContent);
      setTotalesData(totales);
    } else {
      setReporte(reportContent);

      const totales = extractTotalesData(reportContent);
      setTotalesData(totales);
    }
  };

  return (
    <div className="p-5 min-h-screen bg-gray-50">
      <h1 className="text-3xl text-gray-800 font-bold mb-6 text-center flex justify-center items-center">
        <FaChartPie className="text-4xl text-primary mr-2" />
        Reportes
      </h1>

      <div className="max-w-4xl mx-auto">
        {/* Sección de reportes guardados */}
        {savedReports.length > 0 && (
          <div className="mb-8 bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Reportes guardados</h2>
            <div className="space-y-2">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-blue-50 transition 
                    ${
                      selectedReport?.id === report.id
                        ? "bg-blue-100 border-blue-400"
                        : "border-gray-200"
                    }`}
                  onClick={() => viewSavedReport(report)}
                >
                  <div className="font-medium">{report.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}{" "}
                    {new Date(report.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección de nuevo reporte */}
        {reportData && !reporte && (
          <div className="bg-white p-5 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Generar nuevo reporte
            </h2>

            <p className="mb-4">
              Haga clic en el botón para generar un reporte basado en las
              respuestas del formulario.
            </p>

            <button
              onClick={generateReport}
              disabled={loading}
              className={`px-4 py-2 rounded font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Generando..." : "Generar reporte"}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Visualización del reporte */}
        {reporte && (
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {selectedReport ? selectedReport.title : "Reporte generado"}
            </h2>

            {/* Gráfico circular para mostrar totales */}
            {totalesData && totalesData.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">
                  Resumen de resultados
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={totalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {totalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} puntos`, "Cantidad"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center mt-2">
                    <div className="text-sm font-medium">
                      Puntuación total:{" "}
                      {totalesData.reduce((sum, item) => sum + item.value, 0)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedReport && (
              <div className="mt-6">
                <button
                  onClick={() => setReporte(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium"
                >
                  Generar otro reporte
                </button>
              </div>
            )}

            {selectedReport && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setReporte(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium"
                >
                  Volver a la lista
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
