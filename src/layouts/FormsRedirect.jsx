import { useAuth } from "../context/AuthContext";
import FormsInterno from "../pages/AudiInterno";
import Admin from "../pages/Admin";

const FormsRedirect = () => {
  const { usuario, rol } = useAuth();

  if (!usuario) return null;

  if (rol === "admin") {
    return <Admin />;
  } else {
    return <FormsInterno />;
  }
};

export default FormsRedirect;
