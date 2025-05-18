import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  UserCog,
  FileText,
  SearchCheck,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  BarChart2,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { usuario } = useAuth();
  const rol = usuario?.rol;
  const [usuarioNombre, setUsuarioNombre] = useState("");
  const navigate = useNavigate();

  if (!usuario) return null;

  const roleColors = {
    admin: "from-sky-800 to-sky-950",
    auditor_interno: "from-cyan-600 to-cyan-900",
    auditor_externo: "from-sky-700 to-sky-950",
  };

  const iconMap = {
    admin: <UserCog size={48} className="text-white" />,
    auditor_interno: <SearchCheck size={48} className="text-white" />,
    auditor_externo: <FileText size={48} className="text-white" />,
  };

  const descriptionMap = {
    admin: {
      title: "Administrador",
      description:
        "Administra usuarios, supervisa auditores, crea y asigna plantillas y auditorías, y controla el sistema completo.",
      list: [
        "Gestionar auditores internos y externos",
        "Crear y administrar plantillas de formularios",
        "Visualizar y generar reportes globales",
        "Asignar auditorías y supervisar su progreso",
      ],
      features: [
        {
          title: "Usuarios",
          icon: <UserCog size={32} className="text-white" />,
          color: "bg-blue-600",
          desc: "Crear, editar y eliminar usuarios y roles.",
          route: "/admin/usuarios",
        },
        {
          title: "Reportes Globales",
          icon: <BarChart2 size={32} className="text-white" />,
          color: "bg-indigo-600",
          desc: "Visualizar estadísticas y reportes globales.",
          route: "/admin/reportes",
        },
        {
          title: "Planes de Auditoría",
          icon: <ClipboardList size={32} className="text-white" />,
          color: "bg-cyan-600",
          desc: "Crear, asignar y gestionar planes de auditoría.",
          route: "/admin/planes-auditoria",
        },
        {
          title: "Configuración",
          icon: <ShieldCheck size={32} className="text-white" />,
          color: "bg-sky-700",
          desc: "Ajustes generales y configuración del sistema.",
          route: "/admin/configuracion",
        },
      ],
    },
    auditor_interno: {
      title: "Auditor Interno",
      description:
        "Supervisa y documenta auditorías internas, llena formularios, y da seguimiento a los planes de acción generados.",
      list: [
        "Visualizar y actualizar su información personal",
        "Seleccionar normas y completar formularios",
        "Crear y dar seguimiento a planes de acción",
        "Revisar comentarios y observaciones de auditorías",
      ],
      features: [
        {
          title: "Información Personal",
          icon: <UserCog size={32} className="text-white" />,
          color: "bg-cyan-700",
          desc: "Ver y actualizar información personal y formularios completados.",
          route: "/auditor-interno/perfil",
        },
        {
          title: "Formularios",
          icon: <PlusCircle size={32} className="text-white" />,
          color: "bg-blue-600",
          desc: "Seleccionar norma y completar formularios de auditoría.",
          route: "/auditor-interno/formularios",
        },
        {
          title: "Planes de Acción",
          icon: <ClipboardList size={32} className="text-white" />,
          color: "bg-sky-600",
          desc: "Crear, registrar y hacer seguimiento a planes de acción.",
          route: "/auditor-interno/planes",
        },
        {
          title: "Comentarios",
          icon: <LayoutDashboard size={32} className="text-white" />,
          color: "bg-cyan-900",
          desc: "Visualizar comentarios realizados por auditores externos.",
          route: "/auditor-interno/comentarios",
        },
      ],
    },
    auditor_externo: {
      title: "Auditor Externo",
      description:
        "Revisa formularios pendientes de auditoría, evalúa evidencias, agrega comentarios, y actualiza el estado de auditoría para seguimiento interno.",
      list: [
        "Consultar formularios pendientes para auditar",
        "Evaluar evidencias y documentar comentarios",
        "Enviar observaciones para actualización en base de datos",
        "Actualizar estado de auditoría a 'Comentarios realizados'",
      ],
      features: [
        {
          title: "Formularios Pendientes",
          icon: <FileText size={32} className="text-white" />,
          color: "bg-sky-700",
          desc: "Visualizar formularios que requieren auditoría externa.",
          route: "/auditor-externo/formularios-pendientes",
        },
        {
          title: "Evaluación",
          icon: <ClipboardList size={32} className="text-white" />,
          color: "bg-indigo-700",
          desc: "Ver evidencias y escribir comentarios para cada formulario.",
          route: "/auditor-externo/evaluacion",
        },
        {
          title: "Estado Auditoría",
          icon: <BarChart2 size={32} className="text-white" />,
          color: "bg-blue-700",
          desc: "Actualizar estado para permitir seguimiento interno.",
          route: "/auditor-externo/estado-auditoria",
        },
        {
          title: "Seguimiento",
          icon: <PlusCircle size={32} className="text-white" />,
          color: "bg-cyan-800",
          desc: "Facilitar que el auditor interno revise comentarios y observaciones.",
          route: "/auditor-externo/seguimiento",
        },
      ],
    },
  };

  const current = descriptionMap[rol];

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datosUsuario = docSnap.data();
          setUsuarioNombre(datosUsuario.name);
        } else {
          console.log("No se encontró el documento del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    obtenerDatosUsuario();
  }, [usuario.uid]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
      <div
        className={`rounded-3xl shadow-lg text-white p-7 mb-8 flex items-center gap-6 bg-gradient-to-r ${roleColors[rol]}`}
      >
        {iconMap[rol]}
        <div>
          <h1 className="text-3xl font-bold">
            Bienvenido, {usuarioNombre} <span className="ml-2">👋</span>
          </h1>
          <p className="text-lg mt-1">
            Rol:{" "}
            <span className="font-semibold capitalize">{current.title}</span>
          </p>
        </div>
      </div>

      <div className="mb-8 bg-white rounded-xl shadow p-1 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Resumen de Funcionalidades
        </h2>
        <p className="text-gray-700 text-lg">{current.description}</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {current.list.map((item, idx) => (
            <li key={idx} className="text-md">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Acciones Disponibles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {current.features.map(({ title, icon, color, desc, route }, idx) => (
          <div
            key={idx}
            onClick={() => route && navigate(route)}
            className={`${color} p-6 rounded-xl shadow-lg text-white flex flex-col hover:scale-105 transition-transform duration-300 cursor-pointer`}
          >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
