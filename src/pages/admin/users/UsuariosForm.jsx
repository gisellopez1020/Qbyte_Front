// src/components/admin/UsuariosForm.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const DEFAULT_PASSWORD = "123456";

const UsuariosForm = ({ onUsuarioCreado }) => {
    const [name, setName] = useState("");
    const [rol, setRol] = useState("auditor_interno");
    const [adminCode, setAdminCode] = useState("");
    const [email, setEmail] = useState("");
    const [compania, setCompania] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validar código si es admin
            if (rol === "admin") {
                const codeRef = doc(db, "adminCodes", "adminAccess");
                const codeSnap = await getDoc(codeRef);
                if (!codeSnap.exists() || String(codeSnap.data().codigo) !== adminCode.trim()) {
                    Swal.fire({
                        icon: "error",
                        title: "Código incorrecto",
                        text: "Código de administrador incorrecto.",
                    });
                    return;
                }
            }

            // Crear usuario en Auth con password por defecto
            const cred = await createUserWithEmailAndPassword(auth, email, DEFAULT_PASSWORD);

            // Guardar en Firestore
            const userData = {
                name,
                email,
                rol,
                uid: cred.user.uid,
                ...(rol === "auditor_interno" && { compania }),
            };
            await setDoc(doc(db, "usuarios", cred.user.uid), userData);

            if (rol === "auditor_externo") {
                const externoPayload = {
                    nombre: name,
                    usuario: email,
                    contraseña: DEFAULT_PASSWORD,
                };
                const res = await fetch(
                    "http://localhost:8000/auditor_externo/crear_auditor_externo",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(externoPayload),
                    }
                );
                if (!res.ok) {
                    throw new Error("Error al registrar auditor externo en el backend");
                }
            }

            if (rol === "auditor_interno") {
                const internoPayload = {
                    nombre: name,
                    compañia: compania,
                    usuario: email,
                    contraseña: DEFAULT_PASSWORD,
                };
                const res = await fetch(
                    "http://localhost:8000/auditor_interno/crear_auditor_interno",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(internoPayload),
                    }
                );
                if (!res.ok) {
                    throw new Error("Error al registrar auditor interno en el backend");
                }
            }

            Swal.fire({
                icon: "success",
                title: "Usuario creado",
                text: `Usuario creado exitosamente. Contraseña por defecto: "${DEFAULT_PASSWORD}"`,
            });

            // Reset campos
            setName("");
            setRol("auditor_interno");
            setAdminCode("");
            setEmail("");
            setCompania("");

            // Notificar al componente padre que refresque la lista
            if (onUsuarioCreado) onUsuarioCreado();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al crear usuario: " + err.message,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6 space-y-4">
            <input
                className="w-full p-2 border rounded"
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <select
                className="w-full p-2 border rounded"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
            >
                <option value="auditor_interno">Auditor Interno</option>
                <option value="auditor_externo">Auditor Externo</option>
                <option value="admin">Administrador</option>
            </select>

            {rol === "admin" && (
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    placeholder="Código Admin"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                />
            )}

            {rol === "auditor_interno" && (
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    placeholder="Compañía"
                    value={compania}
                    onChange={(e) => setCompania(e.target.value)}
                    required
                />
            )}

            <input
                className="w-full p-2 border rounded"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <p className="text-sm text-gray-600">
                Se asignará la contraseña por defecto: <strong>{DEFAULT_PASSWORD}</strong>.
                El usuario deberá cambiarla más tarde desde su perfil.
            </p>

            <button
                type="submit"
                className="w-full items-center gap-2 
          bg-gradient-to-r from-[#2067af] to-blue-950
          hover:from-[#1b5186] hover:to-blue-900
          transition-all duration-200 ease-in-out text-white px-4 py-2
          rounded-lg active:scale-65 active:shadow-md hover:scale-105"
            >
                Crear Usuario
            </button>
        </form>
    );
};

export default UsuariosForm;
