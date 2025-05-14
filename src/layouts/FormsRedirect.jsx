import { useAuth } from "../context/AuthContext";
import FormsInterno from "../pages/AudiInterno";
import Admin from "../pages/Admin";

const FormsRedirect = () => {
  const { usuario, rol } = useAuth();

  if (!usuario) return null;

  if (rol === "auditor_interno") {
    return <FormsInterno />;
  } else {
    return <Admin />;
  }
};

export default FormsRedirect;
