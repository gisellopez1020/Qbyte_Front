import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; 
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
      // Aquí puedes redirigir con useNavigate (React Router)
    } catch (err) {
      setError("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative bg-gradient-to-b from-[#133D87] via-[#ffffff] to-white">
     <div
  className="absolute inset-0 bg-center bg-no-repeat bg-black"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1530533609496-06430e875bbf?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwYXp1bHxlbnwwfHwwfHx8MA%3D%3D')",
    backgroundSize: "100% auto", 
  }}
></div>


      <div className="relative z-10 bg-white bg-opacity-10 rounded-xl shadow-xl p-6 max-w-xs w-full min-h-[420px] backdrop-blur-md border border-white/20">
        <h2 className="text-center text-3xl italic tracking-wide font-bold text-white mb-5">Acceso</h2>
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
              Acuérdate de mí
            </label>
          </div>

          <div className="mb-4 text-right">
            <a href="#" className="text-white text-sm hover:underline">¿Has olvidado tu contraseña?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#133D87] hover:bg-[#2b5399] text-white p-2 rounded-lg font-semibold transition-colors duration-300"
          >
            Acceso
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}

        <p className="text-center text-white text-sm mt-4">
  ¿No tienes una cuenta? <Link to="/Sign" className="underline text-white hover:text-blue-300">Regístrate</Link>
</p>

      </div>
    </div>
  );
}

export default Login;
