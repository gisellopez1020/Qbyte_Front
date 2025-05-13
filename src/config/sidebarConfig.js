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
    { label: "Plan de acción", path: "/plan-action", icon: RiWalletLine },
  ],
  auditor_interno: [
    { label: "Inicio", path: "/index", icon: RiHome3Line },
    { label: "Formularios", path: "/forms", icon: RiFileCopyLine },
    { label: "Reportes", path: "/reports", icon: RiPieChartLine },
    { label: "Plan de acción", path: "/plan-action", icon: RiWalletLine },
  ],
  auditor_externo: [
    { label: "Inicio", path: "/index", icon: RiHome3Line },
    { label: "Reportes", path: "/reports", icon: RiPieChartLine },
    { label: "Formularios", path: "/forms", icon: RiFileCopyLine },
    { label: "Plan de acción", path: "/plan-action", icon: RiWalletLine }
  ],
};
