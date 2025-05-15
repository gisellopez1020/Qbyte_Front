import React, { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import UsersTable from "./UsersTable";
import UsuariosForm from "./UsuariosForm";

const UsuariosAdmin = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [companiaEditando, setCompaniaEditando] = useState({});

    const fetchUsuarios = async () => {
        const snapshot = await getDocs(collection(db, "usuarios"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsuarios(data);
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const cambiarRol = async (id, nuevoRol) => {
        try {
            const userRef = doc(db, "usuarios", id);
            const nuevosDatos = { rol: nuevoRol };
            if (nuevoRol !== "auditor_interno") nuevosDatos.compania = "";
            await updateDoc(userRef, nuevosDatos);
            setUsuarios((prev) =>
                prev.map((u) => (u.id === id ? { ...u, ...nuevosDatos } : u))
            );
            if (nuevoRol !== "auditor_interno") {
                setCompaniaEditando(prev => {
                    const copia = { ...prev };
                    delete copia[id];
                    return copia;
                });
            }
        } catch (error) {
            console.error("Error al cambiar el rol:", error);
        }
    };

    const eliminarUsuario = async (id) => {
        try {
            await deleteDoc(doc(db, "usuarios", id));
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    const actualizarCompania = async (id, nuevaCompania) => {
        try {
            const userRef = doc(db, "usuarios", id);
            await updateDoc(userRef, { compania: nuevaCompania });
            setUsuarios(prev =>
                prev.map(u =>
                    u.id === id ? { ...u, compania: nuevaCompania } : u
                )
            );
            setCompaniaEditando(prev => {
                const copia = { ...prev };
                delete copia[id];
                return copia;
            });
        } catch (error) {
            console.error("Error al actualizar compañía:", error);
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
                <button
                    onClick={() => setMostrarFormulario(prev => !prev)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {mostrarFormulario ? "Cancelar" : "Nuevo Usuario"}
                </button>
            </div>

            {mostrarFormulario && (
                <UsuariosForm onUsuarioCreado={fetchUsuarios} />
            )}

            <UsersTable
                usuarios={usuarios}
                cambiarRol={cambiarRol}
                eliminarUsuario={eliminarUsuario}
                companiaEditando={companiaEditando}
                setCompaniaEditando={setCompaniaEditando}
                actualizarCompania={actualizarCompania}
            />
        </div>
    );
};

export default UsuariosAdmin;
