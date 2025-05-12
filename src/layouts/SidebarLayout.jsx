import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const SidebarLayout = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!usuario) return <Navigate to="/login" />;

  return (
    <div className="grid grid-cols-[80px_1fr] min-h-screen">
      <Sidebar rol={usuario.rol} />
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
