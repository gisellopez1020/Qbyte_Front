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

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
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
      </Routes>
    </>
  );
}

export default App;