import React from "react";
import { useNavigate } from "react-router-dom";
import { formularios } from "../config/formConfig";

const Forms = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap p-3 xl:p-0 relative items-center justify-center gap-5 xl:gap-10 overflow-y-auto h-screen">
      {formularios.map((form) => (
        <div
          key={form.id}
          className="bg-white bg-opacity-10 rounded-xl shadow-xl p-6 max-w-xs w-full min-h-[200px] cursor-pointer backdrop-blur-md border border-primary flex flex-col items-center"
          onClick={() => navigate(`/forms/${form.id}`)}
        >
          <img src={form.imagen} className="w-32 mb-3" />
          <h2 className="text-black font-semibold text-xl text-center">
            {form.nombre}
          </h2>
          <p className="text-sm text-gray-700 text-center">
            {form.descripcion}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Forms;
