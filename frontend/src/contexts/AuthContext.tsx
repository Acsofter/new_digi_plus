import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { removeAuthToken, setAuthToken } from "../services/auth.header";
import { isUserAuthenticated, login } from "../services/auth.services";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<any | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [formLogin, setFormLogin] = useState({ username: "", password: "" });
  



  const handleChangesLoginForm = (changes: { [key: string]: string }) => {
    const updatedForm = { ...formLogin, ...changes };
    setFormLogin(updatedForm);
  }

  const handleLogin = async () => {
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
      if (response && typeof response === 'object' && 'user' in response) {
        setUser(response.user as User);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const contextValue = {
    user,
    login: handleLogin,
    logout: handleLogout,
    authenticated,
    loading,
    handleChangesLoginForm,
    formLogin
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