import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sidebarMenu } from "../config/sidebarConfig";
import { RiLogoutBoxLine, RiCloseFill } from "react-icons/ri";
import { IoIosMenu } from "react-icons/io";

const Sidebar = ({ rol }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { usuario, logout } = useAuth();
  const menuItems = sidebarMenu[rol] || [];

  return (
    <>
      <div className="flex">
        <div
          className={`bg-primary relative transition-all duration-300 z-50 
          ${collapsed ? "w-20" : "w-64"}
        `}
        >
          {/* Perfil */}
          <div className="flex flex-col items-center justify-center p-4 gap-2 h-[30vh] relative">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute top-4 bg-primary-900 p-1 rounded-full text-white text-xl"
            >
              {collapsed ? <IoIosMenu /> : <RiCloseFill />}
            </button>
            <img
              src="profile.png"
              className={`${
                collapsed ? "w-12 h-12" : "w-16 h-16"
              } object-cover bg-white rounded-full ring-2 ring-gray-300`}
            />
            {!collapsed && (
              <h1 className="text-lg text-white font-bold text-center break-words">
                {usuario?.email}
              </h1>
            )}
          </div>

          {/* Nav */}
          <div className="bg-secondary p-4 rounded-tr-[50px] h-[70vh] overflow-y-auto flex flex-col justify-between gap-8">
            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-4 text-white py-2 px-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:bg-[#5E88BD]"
                >
                  <item.icon className="text-xl" />
                  {!collapsed && item.label}
                </Link>
              ))}
            </nav>

            <nav className="flex flex-col gap-6">
              <button
                onClick={logout}
                className="flex items-center gap-4 text-white py-2 px-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:bg-[#5E88BD]"
              >
                <RiLogoutBoxLine className="text-xl" />
                {!collapsed && "Cerrar Sesión"}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
