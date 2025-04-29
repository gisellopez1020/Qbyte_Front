import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const SidebarLayout = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!usuario) return <Navigate to="/login" />;

  return (
    <div className="flex">
      <Sidebar rol={usuario.rol} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
