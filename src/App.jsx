import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Sign from "./components/Sign";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import Footer from "./components/Footer";
import Index from "./pages/Index";

import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./components/Dashboard"; // Componente para usuarios normales
//import AdminDashboard from "./components/admin/AdminDashboard"; // Componente para administradores
//import AuditorDashboard from "./components/auditor/AuditorDashboard"; // Componente para auditores
import ProtectedRoute from "./components/protectedRoute"; // Componente para proteger rutas

function App() {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/Sign" ||
    location.pathname === "/index";

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20">Cargando...</div>;
  }
    location.pathname === "/login" || 
    location.pathname === "/Sign" || 
    location.pathname.includes("/admin") ||
    location.pathname.includes("/auditor") ||
    location.pathname === "/dashboard";

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <AboutUs />
              <Services />
              <Footer />
            </>
          }
        />
        <Route
          path="/index"
          element={
            isAuthenticated ? (
              <>
                <Sidebar />
                <Index />
              </>
            ) : (
              <>
                <Login />
              </>
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        
        {/* Ruta protegida para usuarios normales */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta protegida para administradores */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta protegida para auditores */}
        <Route 
          path="/auditor/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["auditor"]}>
              <AuditorDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      {!hideHeader && <Footer />}
    </>
  );
}

export default App;