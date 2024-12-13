// src/pages/Login.tsx
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import login_img from "../assets/login-img.webp";
import { useAuthentication } from "../contexts/AuthContext";

export const Login = () => {
  const { formLogin, handleChangesLoginForm, login, loading, authenticated } =
    useAuthentication();



  return authenticated ? (
   <Navigate to="/home"/>
  ) : (
    <div className="h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-msl w-full  h-full flex flex-col md:flex-row overflow-hidden">
        {/* Left side */}
        <div className="hidden md:flex w-full lg:w-2/3 p-8 lg:p-16 items-center relative">
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-bold mb-6 dark:text-white"
            >
              Bienvenido,
              <br />
              Sigue avanzando!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 mb-8"
            >
              Por favor, ingrese sus credenciales para acceder a su cuenta.
            </motion.p>
          </div>
          {/* <div className="h-2/5 lg:h-3/5 w-1/2 bottom-0 right-0 absolute  animate-pulse rounded-tl-3xl" /> */}
          {
            <motion.img
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              src={login_img}
              alt="Login illustration"
              className="h-2/5 lg:h-3/5 w-1/2 bottom-0 right-0 absolute bg-cover rounded-tl-3xl"
            />
          }
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/3 p-8 lg:p-16 bg-gray-50 dark:bg-gray-700 flex flex-col items-center justify-center h-full">
        <h2 className="text-4xl font-bold mb-6 dark:text-white">Iniciar sesión</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className="space-y-6 w-full"
          >
            {["username", "password"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  {field === "username" ? "Usuario" : "Contraseña"}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  id={field}
                  name={field}
                  value={formLogin[field]}
                  onChange={(e) =>
                    handleChangesLoginForm({ [field]: e.target.value })
                  }
                  className="w-full px-4 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 border focus:bg-white dark:focus:bg-gray-500 focus:outline-indigo-600 dark:text-white transition-colors duration-200"
                  required
                  aria-required="true"
                />
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-xs text-right w-full text-slate-600  dark:text-indigo-400  transition-colors duration-200">
                Si olvidaste tu contraseña contacta al administrador
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-tr from-indigo-400 to-indigo-600 border border-indigo-300 text-white rounded-lg px-4 h-12 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoaderCircle className="animate-spin" />
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
