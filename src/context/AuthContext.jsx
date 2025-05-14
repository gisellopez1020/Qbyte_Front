import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");

    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (userData, userRol) => {
    setUsuario(userData);
    setRol(userRol);
    sessionStorage.setItem("usuario", JSON.stringify(userData));
    sessionStorage.setItem("rol", userRol);
    navigate("/index");
  };

  const logout = () => {
    setUsuario(null);
    setRol(null);
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ usuario, rol, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
