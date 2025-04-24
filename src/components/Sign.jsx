import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseConfig";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("¡Cuenta creada exitosamente!");
    } catch (err) {
      setError("Error al registrarse: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      {/* Imagen de fondo en HD */}
      <img
        src="https://images.unsplash.com/photo-1530533609496-06430e875bbf?fm=jpg&q=100&w=1920"
        alt="Fondo espacial"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Formulario */}
      <div className="relative z-10 bg-white bg-opacity-10 rounded-xl shadow-xl p-6 max-w-xs w-full min-h-[400px] backdrop-blur-md border border-white/20">
        <h2 className="text-center text-3xl italic tracking-wide font-bold text-white mb-5" tyle={{
        WebkitTextStroke: "1px #ffffff"
      }}>Regístrate</h2>
        
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
            className="w-full bg-[#0d3065] hover:bg-[#1b4a8f] text-white p-2 rounded-lg font-semibold transition-colors duration-300"
          >
            Crear cuenta
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-3 text-center">{success}</p>}

        <p className="text-center text-white text-sm mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="underline text-white hover:text-blue-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
