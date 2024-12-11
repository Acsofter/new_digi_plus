import { BadgeHelp, Gauge, House, MonitorCog, Shield } from "lucide-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { removeAuthToken, setAuthToken } from "../services/auth.header";
import { isUserAuthenticated, login } from "../services/auth.services";
import { apiRequest } from "../services/user.services";
export const AuthContext = createContext<any | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// ... existing code ...

// // Establecer la cookie con el token
// document.cookie = `token=${getAuthToken()}; path=/;`;

// // Cambiar la forma en que se construye el socketUrl
// const socketUrl = `${import.meta.env.VITE_WS_URL}/ws/company/`;

// // ... existing code ...

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [formLogin, setFormLogin] = useState({ username: "", password: "" });
  const [menuSidebar] = useState([
    { name: "Inicio", icon: <House size={24} />, path: "/home" },
    { name: "Estadisticas", icon: <Gauge size={24} />, path: "/dashboard" },
    {
      name: "Administración",
      icon: <Shield size={24} />,
      path: "/admin",
    },
    { name: "Ajustes", icon: <MonitorCog size={24} />, path: "/settings" },
    { name: "Ayuda", icon: <BadgeHelp size={24} />, path: "/help" },
  ]);

  const handleChangesLoginForm = (changes: { [key: string]: string }) => {
    const updatedForm = { ...formLogin, ...changes };
    setFormLogin(updatedForm);
  };

  const fetchCompany = async () => {
    try {
      const response = await apiRequest<Company>("get", `/company/`);
      if (response) {
        setCompany(response as Company);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login(formLogin);
      if (!response) return;
      const { user } = response;
      if (user?.token) {
        setAuthToken(user.token);
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setAuthenticated(false);
    window.location.href = "/login";
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await isUserAuthenticated();
      if (response && typeof response === "object" && "user" in response) {
        setUser(response.user as User);
        setAuthenticated(true);
        return true;
      } else {
        setAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const _ = async () => {
      const is_valid_auth = await checkAuth();
      if (is_valid_auth) {
        fetchCompany();
      }
    };
    _();
  }, []);

  const contextValue = {
    company,
    user,
    login: handleLogin,
    logout: handleLogout,
    authenticated,
    loading,
    handleChangesLoginForm,
    formLogin,
    menuSidebar,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }
  return context;
};
