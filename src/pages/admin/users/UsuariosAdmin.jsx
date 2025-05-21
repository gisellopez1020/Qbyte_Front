import React, { useState, useEffect } from "react";
import {
  RiCloseCircleLine,
  RiAddCircleLine,
  RiUser3Line,
} from "react-icons/ri";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import UsersTable from "./UsersTable";
import UsuariosForm from "./UsuariosForm";
import { useTranslation } from "react-i18next";

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { t } = useTranslation();

  const fetchUsuarios = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id, // sigue siendo útil internamente
      ...doc.data(),
    }));
    setUsuarios(data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (email, rol) => {
    try {
      // 🔹 Paso 1: Eliminar de Firestore
      const snapshot = await getDocs(collection(db, "usuarios"));
      const usuarioDoc = snapshot.docs.find((doc) => doc.data().email === email);

      if (usuarioDoc) {
        await deleteDoc(doc(db, "usuarios", usuarioDoc.id));
      }

      // 🔹 Paso 2: Eliminar de MongoDB por rol
      let endpoint = "";
      if (rol === "auditor_interno") {
        endpoint = `https://acmeapplication.onrender.com/auditor_interno/eliminar_auditor_interno?usuario=${email}`;
      } else if (rol === "auditor_externo") {
        endpoint = `https://acmeapplication.onrender.com/auditor_externo/eliminar_auditor_externo?usuario=${email}`;
      }

      if (endpoint) {
        const response = await fetch(endpoint, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error al eliminar en MongoDB");
        }
      }

      // 🔹 Paso 3: Actualizar estado local
      setUsuarios((prev) => prev.filter((u) => u.email !== email));

    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="p-3 max-w-6xl mx-auto">
      <div className="bg-slate-200 mx-auto rounded-2xl shadow-sm flex-1 p-4 max-h-[95vh] max-w-[70vw] overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <RiUser3Line className="text-sky-800 w-7 h-7" />
            {t("users.title")}
          </h2>

          <button
            onClick={() => setMostrarFormulario((prev) => !prev)}
            className="flex items-center gap-2 
                      bg-gradient-to-r from-[#2067af] to-blue-950
                      hover:from-[#1b5186] hover:to-blue-900
                      transition-all duration-200 ease-in-out text-white px-4 py-2
                      rounded-lg active:scale-95 active:shadow-md hover:scale-105"
          >
            {mostrarFormulario ? (
              <>
                <RiCloseCircleLine className="w-5 h-5" />
                <span>{t("users.cancel")}</span>
              </>
            ) : (
              <>
                <RiAddCircleLine className="w-5 h-5" />
                <span>{t("users.new")}</span>
              </>
            )}
          </button>
        </div>

        {mostrarFormulario && (
          <div className="mb-6 bg-white shadow-md rounded-lg p-4">
            <UsuariosForm
              onUsuarioCreado={() => {
                fetchUsuarios();
                setMostrarFormulario(false);
              }}
            />
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="max-h-[80vh] overflow-y-auto">
            <UsersTable usuarios={usuarios} eliminarUsuario={eliminarUsuario} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosAdmin;

