// services/usuarioService.js
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export const eliminarUsuario = async (usuario) => {
  try {
    // 1. Eliminar de Firestore
    await deleteDoc(doc(db, "usuarios", usuario.id));

    // 2. Eliminar del backend dependiendo del rol
    let endpoint = "";
    if (usuario.rol === "auditor_interno") {
      endpoint = "/eliminar_auditor_interno";
    } else if (usuario.rol === "auditor_externo") {
      endpoint = "/eliminar_auditor_externo";
    }

    if (endpoint) {
      const res = await fetch(
        `https://acmeapplication.onrender.com${endpoint}?id=${usuario.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error eliminando del backend");
      }
    }

    return true;
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    throw error;
  }
};
