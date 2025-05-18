import React from "react";


const UserTable = ({
    usuarios,
    cambiarRol,
    eliminarUsuario,
    companiaEditando,
    setCompaniaEditando,
    actualizarCompania,
}) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-300">
            <table className="w-full text-sm text-left">
                <thead className="bg-gradient-to-r from-[#1f5d9b] to-blue-950 text-white text-center">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Nombre</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Rol</th>
                        <th className="px-4 py-3 font-semibold">Compañía</th>
                        <th className="px-4 py-3 font-semibold text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr
                            key={usuario.id}
                            className="odd:bg-white even:bg-gray-50 hover:bg-gray-200 transition text-center"
                        >
                            <td className="px-4 py-3 border border-gray-200">{usuario.name}</td>

                            <td className="px-4 py-3 border border-gray-200">{usuario.email}</td>

                            <td className="px-4 py-3 border border-gray-200">
                                <select
                                    value={usuario.rol}
                                    onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="auditor_externo">Auditor Externo</option>
                                    <option value="auditor_interno">Auditor Interno</option>
                                </select>
                            </td>

                            <td className="px-4 py-3 border border-gray-200">
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
                                                className="border px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                placeholder="Compañía"
                                            />
                                            <button
                                                onClick={() =>
                                                    actualizarCompania(usuario.id, companiaEditando[usuario.id])
                                                }
                                                className="flex items-center gap-2 
                                                bg-gradient-to-r from-[#2067af] to-blue-950
                                                hover:from-[#1b5186] hover:to-blue-900
                                                transition-all duration-200 ease-in-out text-white px-4 py-2
                                                rounded-lg active:scale-95 active:shadow-md hover:scale-105"
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
                                                className="ml-2 text-blue-600 hover:underline text-sm"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <span className="text-gray-400 italic">No aplica</span>
                                )}
                            </td>

                            <td className="px-4 py-3 border border-gray-200 text-center">
                                <button
                                    onClick={() => eliminarUsuario(usuario.id)}
                                    className="flex items-center gap-2 
                                    bg-gradient-to-r from-red-700 to-red-800
                                    hover:from-red-600 hover:to-red-700
                                    transition-all duration-200 ease-in-out text-white px-4 py-2
                                    rounded-lg active:scale-95 active:shadow-md hover:scale-105"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}

                    {usuarios.length === 0 && (
                        <tr>
                            <td colSpan="5" className="p-6 text-center text-gray-600 bg-gray-100 border-t border-gray-300">
                                No hay usuarios registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
