import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Lista de correos autorizados para roles específicos
export const AUTHORIZED_EMAILS = {
  admin: ["admin1@example.com", "admin2@example.com"],
  auditor: ["auditor1@example.com", "auditor2@example.com"]
};

// Función para crear un usuario con un rol específico
export const createUserRole = async (userId, email) => {
  try {
    let role = "user"; // Por defecto, todos son usuarios normales
    
    // Verificar si el correo está autorizado para un rol especial
    if (AUTHORIZED_EMAILS.admin.includes(email)) {
      role = "admin";
    } else if (AUTHORIZED_EMAILS.auditor.includes(email)) {
      role = "auditor";
    }

    // Guardar el rol en Firestore
    await setDoc(doc(db, "users", userId), {
      email,
      role,
      createdAt: new Date().toISOString()
    });

    return role;
  } catch (error) {
    console.error("Error al crear rol de usuario:", error);
    throw error;
  }
};

// Función para obtener el rol de un usuario
export const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return "user"; // Si no se encuentra el documento, asumimos rol de usuario normal
  } catch (error) {
    console.error("Error al obtener rol de usuario:", error);
    throw error;
  }
};

// Comprobar si el usuario tiene un rol específico
export const hasRole = async (userId, requiredRole) => {
  const role = await getUserRole(userId);
  return role === requiredRole;
};