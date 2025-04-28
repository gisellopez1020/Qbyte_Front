import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { getUserRole } from "../roleUtils";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      
      // Obtener el rol del usuario
      const role = await getUserRole(userId);
      
      // Redirigir según el rol
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "auditor") {
        navigate("/auditor/dashboard");
      } else {
        navigate("/dashboard"); // Usuario normal
      }
    } catch (err) {
      setError("Error al iniciar sesión: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="relative z-10 bg-white bg-opacity-10 rounded-xl shadow-xl p-6 max-w-xs w-full min-h-[420px] backdrop-blur-md border border-white/20">
        <h2 className="text-center text-3xl italic tracking-wide font-bold text-white mb-5">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className="absolute right-3 top-2 text-white">👤</i>
          </div>

          <div className="mb-4 relative">
            <input
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="absolute right-3 top-2 text-white">🔒</i>
          </div>

          <div className="mb-2 text-white text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Términos y condiciones
            </label>
          </div>

          <div className="mb-4 text-right">
            <a href="#" className="text-white text-sm hover:underline">
              ¿Has olvidado tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#133D87] hover:bg-[#2b5399] text-white p-2 rounded-lg font-semibold transition-colors duration-300 disabled:bg-gray-600"
          >
            {loading ? "Procesando..." : "Iniciar Sesión"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
        )}

        <p className="text-center text-white text-sm mt-4">
          ¿No tienes una cuenta?{" "}
          <Link to="/Sign" className="underline text-white hover:text-blue-300">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;