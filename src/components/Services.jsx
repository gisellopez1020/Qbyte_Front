import React from "react";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { GiCycle } from "react-icons/gi";
import { FcComboChart } from "react-icons/fc";
import { FaUsersCog } from "react-icons/fa";
import { TbWorldCog } from "react-icons/tb";
import { PiWarningFill } from "react-icons/pi";

const Services = () => {
  return (
    <section id="services" className="p-8 xl:p-20 bg-[#fffefe]">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black text-[#161236] text-shadow-sm tracking-wide text-center">
          Revolucionamos la Evaluación de Calidad
        </h1>
        <p className="text-xl text-gray-500 text-center">
          Elevamos tus auditorías con automatización y enfoque estratégico para
          cumplir las normas y estándares.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <HiClipboardDocumentList className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            Evaluaciones Inteligentes de Cumplimiento
          </p>
          <p className="font-semibold text-[#161236]">
            Autoevaluaciones y Auditorías Guiadas
          </p>
          <p>
            Realiza diagnósticos detallados de cumplimiento con estándares como
            ISO 9001, mediante cuestionarios estructurados, listas de
            verificación y captura de evidencias.
          </p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <GiCycle className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            Gestión de Planes de Acción (PDCA)
          </p>
          <p className="font-semibold text-[#161236]">
            Define Objetivos, Acciones y Seguimiento
          </p>
          <p>
            Transforma los hallazgos en mejoras: crea objetivos, asigna tareas y
            da seguimiento al ciclo PDCA para asegurar avances medibles en el
            cumplimiento.
          </p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <FcComboChart className="text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            Tableros Dinámicos y Reportes
          </p>
          <p className="font-semibold text-[#161236]">
            Visualiza tu Progreso en Tiempo Real
          </p>
          <p>
            Explora dashboards con métricas de cumplimiento, brechas críticas y
            reportes descargables.
          </p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <FaUsersCog className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            Gestión de Roles y Permisos
          </p>
          <p className="font-semibold text-[#161236]">
            Accesos Diferenciados por Perfil
          </p>
          <p>
            Administra fácilmente los accesos del equipo: define roles como
            gestores, auditores o evaluadores y asegura que cada quien acceda
            solo a lo que necesita.
          </p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <TbWorldCog className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            Normativas Flexibles y Multilenguaje
          </p>
          <p className="font-semibold text-[#161236]">
            Adáptate a Distintas Normas y Regiones
          </p>
          <p>
            Certifícate en diversas normativas y usa la plataforma en el idioma
            de tu preferencia.
          </p>
        </div>
        <div className="flex flex-col items-center text-center justify-center p-4 bg-white rounded-xl border-2 border-primary shadow-lg">
          <PiWarningFill className="text-primary text-5xl xl:mb-2" />
          <p className="text-xl font-bold text-[#161236]">
            Identificación de Brechas y Acciones Correctivas
          </p>
          <p className="font-semibold text-[#161236]">
            Detecta, Documenta y Soluciona
          </p>
          <p>
            Registra brechas de cumplimiento, define acciones correctivas y
            lleva el control de tu estado con historial y evidencias.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
