import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Login from "./pages/auth/Login";
import Sign from "./pages/auth/Sign";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Plan from "./pages/Plan";
import FormsRedirect from "./layouts/FormsRedirect";
import Reports from "./pages/Reports";
import SidebarLayout from "./layouts/SidebarLayout";
import Formulario from "./components/Formulario";
import { useAuth } from "./context/AuthContext";


function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="text-center text-primary mt-20">Cargando...</div>;
  }
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <AboutUs />
              <Services />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />

        {/* Rutas protegidas */}
        <Route path="/" element={<SidebarLayout />}>
          <Route path="index" element={<Index />} />
          <Route path="forms" element={<FormsRedirect />} />      
          <Route path="forms/:id" element={<Formulario />} />
          <Route path="plan-action" element={<Plan />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
