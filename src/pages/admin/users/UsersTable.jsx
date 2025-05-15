// TablaUsuarios.jsx
import React from "react";

const UserTable
    = ({
        usuarios,
        cambiarRol,
        eliminarUsuario,
        companiaEditando,
        setCompaniaEditando,
        actualizarCompania,
    }) => {
        return (
            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Rol</th>
                        <th className="border px-4 py-2">Compañía</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="text-center">
                            <td className="border px-4 py-2">{usuario.name}</td>
                            <td className="border px-4 py-2">{usuario.email}</td>
                            <td className="border px-4 py-2">
                                <select
                                    value={usuario.rol}
                                    onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="auditor_externo">Auditor Externo</option>
                                    <option value="auditor_interno">Auditor Interno</option>
                                </select>
                            </td>
                            <td className="border px-4 py-2">
                                {usuario.rol === "auditor_interno" ? (
                                    companiaEditando[usuario.id] !== undefined ? (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={companiaEditando[usuario.id]}
                                                onChange={(e) =>
                                                    setCompaniaEditando(prev => ({
                                                        ...prev,
                                                        [usuario.id]: e.target.value
                                                    }))
                                                }
                                                className="border px-2 py-1 rounded w-full"
                                                placeholder="Compañía"
                                            />
                                            <button
                                                onClick={() =>
                                                    actualizarCompania(usuario.id, companiaEditando[usuario.id])
                                                }
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span>{usuario.compania || "No definida"}</span>
                                            <button
                                                onClick={() =>
                                                    setCompaniaEditando(prev => ({
                                                        ...prev,
                                                        [usuario.id]: usuario.compania || ""
                                                    }))
                                                }
                                                className="ml-2 text-blue-500 underline text-sm"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <span className="text-gray-400">No aplica</span>
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => eliminarUsuario(usuario.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {usuarios.length === 0 && (
                        <tr>
                            <td colSpan="5" className="p-4 text-gray-500 text-center">
                                No hay usuarios registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

export default UserTable
    ;
