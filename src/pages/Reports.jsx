import React, { useEffect, useState, useRef } from "react";
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
import { FaChartPie, FaDownload, FaCertificate } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { GiStarsStack } from "react-icons/gi";

const Certificate = React.forwardRef(({ reportData, totalPoints }, ref) => {
  const { usuario } = useAuth();
  const [auditorNombre, setAuditorNombre] = useState("");
  const [auditorEmpresa, setAuditorEmpresa] = useState("");
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const obtenerAuditorNombre = async () => {
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
    obtenerAuditorNombre();
  });

  useEffect(() => {
    const obtenerAuditorEmpresa = async () => {
      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datosUsuario = docSnap.data();
          setAuditorEmpresa(datosUsuario.compania);
        } else {
          console.log("No se encontró el documento del usuario.");
          return null;
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        return null;
      }
    };
    obtenerAuditorEmpresa();
  });

  return (
    <div
      ref={ref}
      className="bg-white w-full p-8 border-8 border-double border-primary"
      style={{
        fontFamily: "serif",
        width: "800px",
        height: "650px",
        position: "relative",
        background: "linear-gradient(to bottom right, #ffffff, #f0f8ff)",
      }}
    >
      <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
        <FaCertificate className="text-9xl text-primary" />
      </div>

      <div className="text-center">
        <h1
          className="text-4xl font-bold text-primary mb-4"
          style={{ fontFamily: "serif" }}
        >
          CERTIFICADO
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-10">
          DE CUMPLIMIENTO
        </h2>

        <p className="text-lg mb-8">Se certifica que:</p>

        <p className="text-3xl font-bold mb-10 border-b-2 pb-2 border-gray-300 inline-block">
          {auditorNombre || usuario?.email}
        </p>

        <p className="text-xl mb-5 font-bold">
          {usuario?.rol} de la empresa {auditorEmpresa}
        </p>

        <p className="text-lg mb-8 px-16">
          Ha cumplido satisfactoriamente con los requisitos especificados en la
          norma:
        </p>

        <p className="text-2xl font-bold mb-10 text-primary">
          {reportData?.norma ||
            reportData?.formularioTitulo ||
            "Evaluación de cumplimiento normativo"}
        </p>

        <p className="text-lg">
          Con una puntuación de <strong>{totalPoints}</strong> de 100 puntos
          posibles
        </p>

        <div className="mt-10 flex justify-between items-end">
          <div className="text-center">
            <p className="text-2xl text-shadow-sm font-bold relative text-[#161236] p-1">
              QByte
              <span className="text-primary text-4xl">.</span>
              <GiStarsStack className="text-primary absolute bottom-1 left-11" />
            </p>
            <div className="border-t-2 border-gray-500 pt-1 px-10">
              Firma del evaluador
            </div>
          </div>

          <div className="text-center">
            <div className="border-t-2 border-gray-500 pt-1 px-10">
              Fecha: {currentDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const Reports = () => {
  const { usuario } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [totalesData, setTotalesData] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef(null);

  const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

  const extractTotalesData = (content) => {
    if (!content) return null;

    try {
      let data = content;
      if (typeof content === "string") {
        try {
          data = JSON.parse(content);
        } catch (e) {
          const totalesMatch = content.match(/"totales"\s*:\s*({[^}]*})/);
          if (totalesMatch && totalesMatch[1]) {
            try {
              const totalesStr = totalesMatch[1].replace(/'/g, '"');
              data = JSON.parse(`{"totales":${totalesStr}}`);
            } catch (innerError) {
              console.error(
                "Error al analizar los totales extraídos",
                innerError
              );
              return null;
            }
          } else {
            console.error("No se encontró ningún objeto totales en la cadena");
            return null;
          }
        }
      }

      if (data && data.totales) {
        const { bueno, regular, malo } = data.totales;
        if (
          bueno !== undefined ||
          regular !== undefined ||
          malo !== undefined
        ) {
          // Datos para el gráfico circular
          return [
            { name: "Bueno", value: bueno || 0, color: COLORS[0] },
            { name: "Regular", value: regular || 0, color: COLORS[1] },
            { name: "Malo", value: malo || 0, color: COLORS[2] },
          ].filter((item) => item.value > 0);
        }
      }

      return null;
    } catch (error) {
      console.error("Error extracting totales data:", error);
      return null;
    }
  };

  // Función para determinar el estado de certificación
  const getCertificationStatus = (totalPoints) => {
    if (totalPoints >= 70) {
      return {
        message: `Felicitaciones, te certificaste en la norma ${
          reportData?.norma || reportData?.formularioTitulo || ""
        }`,
        className: "bg-green-100 text-green-800 border-green-300",
        icon: "🏆",
        certified: true,
      };
    } else if (totalPoints >= 50) {
      return {
        message: "Sigue intentando, estás cerca de lograrlo",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: "💪",
        certified: false,
      };
    } else {
      return {
        message:
          "Lo siento, no cumples con los puntos suficientes para certificarte",
        className: "bg-red-100 text-red-800 border-red-300",
        icon: "❌",
        certified: false,
      };
    }
  };

  // Función para generar y descargar el PDF
  const generatePDF = async () => {
    if (!certificateRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 297;
      const pageHeight = 210;
      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
      }

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`certificado_${reportData?.nombre || "normativo"}.pdf`);
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert(
        "Hubo un error al generar el certificado PDF. Por favor intenta de nuevo."
      );
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
    setShowCertificate(false);

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

  // Calcular puntuación total
  const getTotalPoints = () => {
    return totalesData
      ? totalesData.reduce((sum, item) => sum + item.value, 0)
      : 0;
  };

  return (
    <div className="p-5 min-h-screen bg-gray-50">
      <div className="bg-slate-200 mx-auto rounded-2xl shadow-sm flex-1 p-4 max-h-[80vh] max-w-[70vw] overflow-y-auto space-y-6">
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
                    : "flex items-center gap-2 bg-gradient-to-r from-[#2067af] to-blue-950 hover:from-[#1b5186] hover:to-blue-900 text-white rounded-lg active:scale-95 active:shadow-md hover:scale-105"
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
                    <div className="flex flex-col justify-center mt-2">
                      <div className="text-sm font-medium">
                        Puntuación total: {getTotalPoints()} de 100 puntos
                        posibles.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="prose max-w-none">
                {totalesData && totalesData.length > 0 && (
                  <div
                    className={`p-4 mb-6 rounded-lg border ${
                      getCertificationStatus(getTotalPoints()).className
                    }`}
                  >
                    <p className="text-lg font-bold flex items-center">
                      <span className="text-2xl mr-2">
                        {getCertificationStatus(getTotalPoints()).icon}
                      </span>
                      {getCertificationStatus(getTotalPoints()).message}
                    </p>

                    {/* Botón de certificado para descargar solo si está certificado */}
                    {getCertificationStatus(getTotalPoints()).certified && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setShowCertificate(!showCertificate)}
                          className="flex items-center gap-2 
                    bg-gradient-to-r from-[#2067af] to-blue-950
                    hover:from-[#1b5186] hover:to-blue-900
                    transition-all duration-200 ease-in-out text-white px-4 py-2
                    rounded-lg active:scale-95 active:shadow-md hover:scale-105"
                        >
                          <FaCertificate /> Ver certificado
                        </button>

                        <button
                          onClick={generatePDF}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          <FaDownload /> Descargar certificado
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Mostrar el certificado si está habilitado */}
                {showCertificate &&
                  getCertificationStatus(getTotalPoints()).certified && (
                    <div className="mb-6 p-4 border rounded-lg overflow-auto flex justify-center">
                      <Certificate
                        ref={certificateRef}
                        reportData={reportData || selectedReport?.formData}
                        totalPoints={getTotalPoints()}
                      />
                    </div>
                  )}
              </div>

              {!selectedReport && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setReporte(null);
                      setShowCertificate(false);
                    }}
                    className="flex items-center gap-2 
                    bg-gradient-to-r from-[#2067af] to-blue-950
                    hover:from-[#1b5186] hover:to-blue-900
                    transition-all duration-200 ease-in-out text-white px-4 py-2
                    rounded-lg active:scale-95 active:shadow-md hover:scale-105"
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
                      setShowCertificate(false);
                    }}
                    className="flex items-center gap-2 
                    bg-gradient-to-r from-[#2067af] to-blue-950
                    hover:from-[#1b5186] hover:to-blue-900
                    transition-all duration-200 ease-in-out text-white px-4 py-2
                    rounded-lg active:scale-95 active:shadow-md hover:scale-105"
                  >
                    Volver a la lista
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Elemento oculto para generar el PDF */}
        <div className="hidden">
          {getTotalPoints() >= 70 && (
            <Certificate
              ref={certificateRef}
              reportData={reportData || selectedReport?.formData}
              totalPoints={getTotalPoints()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
