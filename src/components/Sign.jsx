import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { createUserRole, AUTHORIZED_EMAILS } from "../roleUtils";
import { FaArrowLeft } from "react-icons/fa6";

function Sign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      
      // Asignar rol al usuario según su correo
      const role = await createUserRole(userId, email);
      
      // Mensaje de éxito según el rol asignado
      if (role === "admin") {
        setSuccess("¡Cuenta de administrador creada exitosamente!");
      } else if (role === "auditor") {
        setSuccess("¡Cuenta de auditor creada exitosamente!");
      } else {
        setSuccess("¡Cuenta creada exitosamente!");
      }
      
      // Redirigir después de unos segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Error al registrarse: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el correo está en la lista de correos autorizados
  const checkEmailAuthorization = () => {
    if (!email) return null;
    
    if (AUTHORIZED_EMAILS.admin.includes(email)) {
      return "admin";
    } else if (AUTHORIZED_EMAILS.auditor.includes(email)) {
      return "auditor";
    }
    
    return "user";
  };

  const potentialRole = checkEmailAuthorization();

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      <img
        src="https://images.unsplash.com/photo-1530533609496-06430e875bbf?fm=jpg&q=100&w=1920"
        alt="Fondo espacial"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <Link to="/" className="absolute m-10 z-50 top-[1%] left-[2%]">
        <FaArrowLeft className="text-3xl xl:text-4xl text-white rounded-full" />
      </Link>

      <div className="relative z-10 bg-white bg-opacity-10 rounded-xl shadow-xl p-6 max-w-xs w-full min-h-[400px] backdrop-blur-md border border-white/20">
        <h2
          className="text-center text-3xl italic tracking-wide font-bold text-white mb-5"
        >
          Sign Up
        </h2>

        <form onSubmit={handleSignUp}>
          <div className="mb-4 relative">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            />
            <i className="absolute right-3 top-2 text-white">📧</i>
          </div>

          {email && potentialRole !== "user" && (
            <div className="mb-4 p-2 bg-blue-600 bg-opacity-30 rounded-lg text-white text-sm">
              Este correo será registrado como: <strong>{potentialRole === "admin" ? "Administrador" : "Auditor"}</strong>
            </div>
          )}

          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            />
            <i className="absolute right-3 top-2 text-white">🔐</i>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d3065] hover:bg-[#1b4a8f] text-white p-2 rounded-lg font-semibold transition-colors duration-300 disabled:bg-gray-600"
          >
            {loading ? "Procesando..." : "Crear cuenta"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm mt-3 text-center">{success}</p>
        )}

        <p className="text-center text-white text-sm mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="underline text-white hover:text-blue-300"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Sign;