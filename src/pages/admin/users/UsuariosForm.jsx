import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebaseConfig";

const UsuariosForm = ({ onUsuarioCreado }) => {
    const [nuevoUsuario, setNuevoUsuario] = useState({
        name: "",
        email: "",
        rol: "auditor_interno",
        compania: "",
    });

    const handleChange = (e) => {
        setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cred = await createUserWithEmailAndPassword(
                auth,
                nuevoUsuario.email,
                "123456"
            );

            const usuarioAGuardar = {
                name: nuevoUsuario.name,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol,
                uid: cred.user.uid,
                ...(nuevoUsuario.rol === "auditor_interno" && {
                    compania: nuevoUsuario.compania,
                }),
            };

            await addDoc(collection(db, "usuarios"), usuarioAGuardar);

            setNuevoUsuario({
                name: "",
                email: "",
                rol: "auditor_interno",
                compania: "",
            });

            if (onUsuarioCreado) onUsuarioCreado(); // para refrescar lista
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6 space-y-4">
            <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={nuevoUsuario.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Correo"
                value={nuevoUsuario.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <select
                name="rol"
                value={nuevoUsuario.rol}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            >
                <option value="auditor_interno">Auditor Interno</option>
                <option value="auditor_externo">Auditor Externo</option>
                <option value="admin">Administrador</option>
            </select>
            {nuevoUsuario.rol === "auditor_interno" && (
                <input
                    type="text"
                    name="compania"
                    placeholder="Compañía"
                    value={nuevoUsuario.compania}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            )}
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Guardar Usuario
            </button>
        </form>
    );
};

export default UsuariosForm;
