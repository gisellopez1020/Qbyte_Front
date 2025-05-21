import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { FaArrowLeft } from "react-icons/fa6";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

function Sign() {
  const [name, setName] = useState("");
  const [rol, setRol] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [compania, setCompania] = useState("");
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: "es", label: "Español" },
    { code: "gb", label: "English", langCode: "en" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
  ];

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  setError("");
  setSuccess("");
  setIsLoading(true);

  if (password.length < 7) {
    setError("La contraseña debe tener al menos 7 caracteres.");
    setIsLoading(false);
    return;
  }

  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    setError("La contraseña debe contener al menos un carácter especial.");
    setIsLoading(false);
    return;
  }

    try {
      if (rol === "admin") {
        const codeRef = doc(db, "adminCodes", "adminAccess");
        const codeSnap = await getDoc(codeRef);

        if (
          !codeSnap.exists() ||
          String(codeSnap.data().codigo) !== adminCode.trim()
        ) {
          setError("Código de administrador incorrecto.");
          return;
        }
      }

      if (rol === "auditor_externo") {
        const externoPayload = {
          nombre: name,
          usuario: email,
          contraseña: password,
        };

        const res = await fetch(
          "http://localhost:8000/auditor_externo/crear_auditor_externo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(externoPayload),
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const errorMessage =
            errorData?.detail || "Error al registrar auditor externo.";
          setError(errorMessage);
          return;
        }
      }

      if (rol === "auditor_interno") {
        const internoPayload = {
          nombre: name,
          compañia: compania,
          usuario: email,
          contraseña: password,
        };

        const res = await fetch(
          "http://localhost:8000/auditor_interno/crear_auditor_interno",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(internoPayload),
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const errorMessage =
            errorData?.detail || "Error al registrar auditor interno.";
          setError(errorMessage);
          return;
        }
      }

      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credencial.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        name: name,
        email: email,
        rol: rol,
        ...(rol === "auditor_interno" && { compania: compania }),
      });

      setSuccess("¡Registro exitoso!");
      login({ name, email, uid: user.uid, rol });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("El correo electrónico ya está en uso.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (err.code === "auth/invalid-email") {
        setError("El formato del correo electrónico no es válido.");
      } else {
        setError("Error al registrarse: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      <img
        src="https://cdn.pixabay.com/photo/2017/06/14/01/43/background-2400765_1280.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <Link to="/" className="absolute m-10 z-50 top-[1%] left-[2%]">
        <FaArrowLeft className="text-3xl xl:text-4xl text-white rounded-full" />
      </Link>
      <div className="absolute m-10 z-50 top-[1%] right-[2%]">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className={`p-2 rounded-full`}
        >
          <MdLanguage
            className={`text-white hover:text-sky-950 text-4xl transition-colors duration-300`}
          />
        </button>

        {showLangMenu && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
            <ul className="py-1 text-sm text-gray-700">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() =>
                      handleChangeLanguage(lang.langCode || lang.code)
                    }
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                  >
                    <span className={`fi fi-${lang.code} mr-2`}></span>{" "}
                    {lang.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="relative z-10 bg-white bg-opacity-5 shadow-white rounded-xl p-6 max-w-xs w-full min-h-[420px] backdrop-blur-md border border-sky-800">
        <h2 className="text-center text-3xl italic tracking-wide font-bold text-white mb-5">
          {t("sign_up.title")}
        </h2>

        <form onSubmit={handleSignUp}>
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder={t("sign_up.user")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            />
            <i className="absolute right-3 top-2 text-white">👤</i>
          </div>
          <div className="mb-4 relative">
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 appearance-none"
            >
              <option value="">{t("sign_up.rols.select")}</option>
              <option value="auditor_interno" className="text-black">
                {t("sign_up.rols.r1")}
              </option>
              <option value="auditor_externo" className="text-black">
                {t("sign_up.rols.r2")}
              </option>
              <option value="admin" className="text-black">
                {t("sign_up.rols.r3")}
              </option>
            </select>
            <i className="absolute right-3 top-2 text-white pointer-events-none">
              🔏
            </i>
          </div>

          {rol === "auditor_interno" && (
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder={t("sign_up.company")}
                value={compania}
                onChange={(e) => setCompania(e.target.value)}
                required
                className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
              />
              <i className="absolute right-3 top-2 text-white">🏢</i>
            </div>
          )}

          {rol === "admin" && (
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder={t("sign_up.code")}
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
              />
              <i className="absolute right-3 top-2 text-white">🔐</i>
            </div>
          )}

          <div className="mb-4 relative">
            <input
              type="email"
              placeholder={t("sign_up.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            />
            <i className="absolute right-3 top-2 text-white">📧</i>
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("sign_up.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-2 px-8 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            />
            <i className="absolute right-3 top-2 text-white">🔐</i>
            {showPassword ? (
              <RiEyeOffFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 left-2 text-[#161236] hover:cursor-pointer"
              />
            ) : (
              <RiEyeFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 left-2 text-[#161236] hover:cursor-pointer"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full text-white p-2 rounded-lg font-semibold
             bg-gradient-to-r from-sky-800 to-sky-950
             hover:from-sky-700 hover:to-sky-900
             active:scale-95 active:from-sky-900 active:to-sky-950
             transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:shadow-inner"
          >
            {t("sign_up.button")}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-3 font-semibold text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm mt-3 text-center">{success}</p>
        )}

        <p className="text-center text-white text-sm mt-4">
          {t("sign_up.p1")}{" "}
          <Link
            to="/login"
            className="underline text-white hover:text-blue-300"
          >
            {t("sign_up.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Sign;
