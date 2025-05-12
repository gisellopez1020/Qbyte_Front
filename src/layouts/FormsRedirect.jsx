import { useAuth } from "../context/AuthContext";
import FormsInterno from "../pages/AudiInterno";
import FormsExterno from "../pages/AudiExterno";
import Admin from "../pages/Admin";

const FormsRedirect = () => {
  const { usuario } = useAuth();

  if (!usuario) return null;

  if (usuario.rol === "auditor_externo") {
    return <FormsExterno />;
  } else if (usuario.rol === "auditor_interno"){
    return <FormsInterno />;
  }
  else {
    return <Admin/>;
  }
};

export default FormsRedirect;
