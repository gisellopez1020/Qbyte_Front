import React, { useState, useEffect } from "react";
import { RiCloseCircleLine, RiAddCircleLine, RiUser3Line  } from "react-icons/ri";


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
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <RiUser3Line className="text-sky-800 w-7 h-7"/>
            Gestión de Usuarios
            </h2>
            

            <button
                onClick={() => setMostrarFormulario(prev => !prev)}
                className="
                flex items-center gap-2 
                bg-gradient-to-r from-[#2067af] to-blue-950
                hover:from-[#1b5186] hover:to-blue-900
                transition-all duration-200 ease-in-out text-white px-4 py-2
                rounded-lg active:scale-95 active:shadow-md hover:scale-105
                "
            >
                {mostrarFormulario ? (
                    <>
                        <RiCloseCircleLine className="w-5 h-5" />
                        <span>Cancelar</span>
                    </>
                ) : (
                    <>
                        <RiAddCircleLine className="w-5 h-5" />
                        <span>Nuevo Usuario</span>
                    </>
                )}
            </button>
            </div>


            {mostrarFormulario && (
                <div className="mb-6 bg-white shadow-md rounded-lg p-4">
                    <UsuariosForm
                        onUsuarioCreado={() => {
                            fetchUsuarios();
                            setMostrarFormulario(false);
                        }}
                    />
                </div>
            )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
                <UsersTable
                    usuarios={usuarios}
                    cambiarRol={cambiarRol}
                    eliminarUsuario={eliminarUsuario}
                    companiaEditando={companiaEditando}
                    setCompaniaEditando={setCompaniaEditando}
                    actualizarCompania={actualizarCompania}
                />
            </div>
        </div>

        </div>
    );
};

export default UsuariosAdmin;
