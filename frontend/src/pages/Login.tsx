import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuthentication } from "../contexts/AuthContext";

export const Login: React.FC = () => {
  const { formLogin, handleChangesLoginForm, login, loading, authenticated } =
    useAuthentication();

  if (authenticated) {
    return <Navigate to="/home" />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-full  flex flex-col md:flex-row h-full ">
        {/* Left side */}
        <motion.div
          className="hidden md:flex h-full md:w-4/5 bg-indigo-600 text-white items-center  p-10 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl font-bold mb-4"
            >
              Bienvenido,
              <br />
              ¡Sigue avanzando!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-indigo-200"
            >
              Por favor, ingrese sus credenciales para acceder a su cuenta.
            </motion.p>
          </div>
          {/* <motion.img
            src={LOGIN_IMG_URL}
            alt="Login illustration"
            className="absolute bottom-0 right-0 w-2/3 max-h-64 object-contain"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          /> */}
        </motion.div>

        {/* Right side */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Iniciar sesión
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: "username", label: "Usuario", type: "text" },
              { id: "password", label: "Contraseña", type: "password" },
            ].map(({ id, label, type }) => (
              <div key={id} className="space-y-2">
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={formLogin[id]}
                  onChange={(e) =>
                    handleChangesLoginForm({ [id]: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            ))}
            <div className="text-sm text-right">
              <a
                href="#"
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
