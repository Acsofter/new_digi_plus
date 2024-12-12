import { LogIn } from "lucide-react";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAuthentication } from "./contexts/AuthContext";
import { Layout } from "./layouts/Layout";
import { Home } from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import { Login } from "./pages/Login";
import NotFound from "./pages/not-found";
import { Dashboard } from "./pages/Dashboard";
import { Help } from "./pages/Help";
import { Payments } from "./pages/Payments";

const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { authenticated, loading } = useAuthentication();

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-screen justify-center items-center gap-3 text-sm text-center text-gray-500 ">
        <div className="w-8 h-8 rounded-full border-4 border-r-violet-500 animate-spin  "></div>
        <p>
          Cargando... <br />
          por favor no cierres la ventana hasta que termine.
        </p>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Layout>
        <Routes>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/help"
            element={
              <PrivateRoute>
                <Help />
              </PrivateRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <Payments />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
