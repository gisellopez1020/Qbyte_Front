import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { getUserRole } from "../roleUtils";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const role = await getUserRole(currentUser.uid);
          setUserData({
            uid: currentUser.uid,
            email: currentUser.email,
            role: role
          });
        }
      } catch (err) {
        setError("Error al obtener datos del usuario: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      setError("Error al cerrar sesión: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white">
      {/* Encabezado */}
      <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaUser className="text-2xl mr-2 text-green-400" />
          <h1 className="text-xl font-bold">Panel de Usuario</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto p-6">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Bienvenido a tu dashboard</h2>
          
          {error && (
            <div className="bg-red-500 bg-opacity-30 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {userData && (
            <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg">
              <p className="mb-2">
                <span className="font-semibold">Email:</span> {userData.email}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Rol:</span>{" "}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  userData.role === 'admin' ? 'bg-red-600' : 
                  userData.role === 'auditor' ? 'bg-yellow-600' : 'bg-green-600'
                }`}>
                  {userData.role}
                </span>
              </p>
              <p className="text-gray-300 mt-4">
                Este es el panel de usuario estándar. Aquí podrás ver y gestionar tus datos personales.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Mis Datos</h3>
              <p className="text-gray-300">
                Aquí puedes ver y actualizar tu información personal.
              </p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Gestionar Datos
              </button>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Mis Servicios</h3>
              <p className="text-gray-300">
                Revisa los servicios que tienes contratados.
              </p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Ver Servicios
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;