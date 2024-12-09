import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { authenticated, loading } = useAuth();

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

/**
 * AppRoutes
 *
 * This component is the main router of the application. It defines all the routes of the application.
 * It uses the PrivateRoute component to protect routes from unauthenticated users.
 * If the user is not authenticated, it redirects to the login page.
 * @example
 * <AppRoutes />
 */
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private routes */}
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <TransactionsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/budget"
          element={
            <PrivateRoute>
              <BudgetPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <PrivateRoute>
              <GoalsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <CategoriesPage />
            </PrivateRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
