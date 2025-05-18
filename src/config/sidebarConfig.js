import {
  RiHome3Line,
  RiFileCopyLine,
  RiWalletLine,
  RiPieChartLine,
} from "react-icons/ri";

export const sidebarMenu = {
  admin: [
    { label: "Inicio", path: "/index", icon: RiHome3Line },
    { label: "Formularios", path: "/forms", icon: RiFileCopyLine },
    { label: "Crear Formulario", path: "/crear-form", icon: RiPieChartLine },
    { label: "Usuarios", path: "/usuarios", icon: RiPieChartLine },
  ],
  auditor_interno: [
    { label: "Inicio", path: "/index", icon: RiHome3Line },
    { label: "Formularios", path: "/forms", icon: RiFileCopyLine },
    { label: "Reportes", path: "/reports", icon: RiPieChartLine },
    { label: "Plan de acción", path: "/plan-action", icon: RiWalletLine },
  ],
  auditor_externo: [
    { label: "Inicio", path: "/index", icon: RiHome3Line },
    { label: "Plan de acción", path: "/PlanesExterno", icon: RiWalletLine },
  ],
};
