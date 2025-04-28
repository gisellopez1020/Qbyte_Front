import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = () => {
      signOut(auth).catch((error) => {
        console.error("Error al cerrar sesión automáticamente:", error);
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      if (userFirebase) {
        sessionStorage.setItem("isAuthenticated", "true");
        setUsuario(userFirebase);
      } else {
        sessionStorage.removeItem("isAuthenticated");
        setUsuario(null);
      }
      setLoading(false);
    });

    const checkSession = () => {
      const isAuthenticated = sessionStorage.getItem("isAuthenticated");
      if (!isAuthenticated) {
        signOut(auth).catch((error) => {
          console.error("Error al verificar sesión:", error);
        });
      }
    };

    checkSession();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unsubscribe();
    };
  }, []);

  const login = (user) => {
    sessionStorage.setItem("isAuthenticated", "true");
    setUsuario(user);
  };

  const logout = () => {
    sessionStorage.removeItem("isAuthenticated");
    signOut(auth)
      .then(() => setUsuario(null))
      .catch((error) =>
        console.error("Error cerrando sesión manualmente:", error)
      );
  };

  const isAuthenticated = !!usuario;

  return (
    <AuthContext.Provider
      value={{ usuario, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
