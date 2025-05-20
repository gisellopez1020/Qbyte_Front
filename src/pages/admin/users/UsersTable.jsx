import React from "react";
import Swal from "sweetalert2";

const UserTable = ({ usuarios, eliminarUsuario }) => {
  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarUsuario(id);
        Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
      }
    });
  };

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
              <td className="px-4 py-3 border border-gray-200">
                {usuario.name}
              </td>

              <td className="px-4 py-3 border border-gray-200">
                {usuario.email}
              </td>

              <td className="px-4 py-3 border border-gray-200">
                <span className="capitalize">
                  {usuario.rol.replace("_", " ")}
                </span>
              </td>

              <td className="px-4 py-3 border border-gray-200">
                {usuario.rol === "auditor_interno" ? (
                  <span>{usuario.compania || "No definida"}</span>
                ) : (
                  <span className="text-gray-400 italic">No aplica</span>
                )}
              </td>

              <td className="px-4 py-3 border border-gray-200 text-center">
                <button
                  onClick={() => handleEliminar(usuario.id)}
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
              <td
                colSpan="5"
                className="p-6 text-center text-gray-600 bg-gray-100 border-t border-gray-300"
              >
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
