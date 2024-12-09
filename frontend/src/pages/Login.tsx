// src/pages/Login.tsx
import { motion } from "framer-motion";
import { useAuthentication } from "../contexts/AuthContext";

export const Login = () => {
  const { formLogin, handleChangesLoginForm, handleLogin } = useAuthentication();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangesLoginForm({ [field]: e.target.value });
  };

  return (
    <div className="min-h-screen h-screen bg-base flex items-center justify-center p-4 w-screen">
      <div className="bg-white rounded-3xl shadow-xl w-full h-full flex flex-col md:flex-row overflow-hidden">
        {/* Lado izquierdo */}
        <div className="hidden md:flex w-full h-full lg:w-2/3 p-8 lg:p-16 items-center relative">
          <div className="relative">
            <div className="rounded-full bg-blue-500/15 size-72 absolute blur-xl" />
            <div className="rounded-full bg-green-500/10 size-72 absolute blur-xl -left-28 mx-1 top-16" />
            <div className="rounded-full bg-violet-500/10 size-72 absolute blur-xl left-28 -top-16" />
            <motion.h1
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-7xl font-bold mb-6"
            >
              Bienvenido,
              <br />
              Sigue avanzando!
              <br />
            </motion.h1>
            <p className="text-gray-600 mb-8">
              Por favor, ingrese sus credenciales para acceder a su cuenta.
            </p>
          </div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            exit={{ opacity: 0 }}
            className="h-2/5 lg:h-3/5 w-1/2 bottom-0 right-0 bg-[url('./assets/image/login-img.svg')] bg-cover absolute"
          />
        </div>

        {/* Lado derecho */}
        <div className="w-full h-full lg:w-1/3 p-8 lg:p-16 bg-gray-50 flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {["username", "password"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field === "username" ? "Usuario" : "Contraseña"}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  id={field}
                  name={field}
                  value={formLogin[field]}
                  onChange={handleInputChange(field)}
                  className="w-full px-4 h-12 rounded-lg bg-gray-200 border focus:bg-white focus:outline-blue-600"
                  required
                />
              </div>
            ))}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Recuerdame
                </label>
              </div>
              <a href="/" className="text-sm text-blue-600 hover:underline">
                Olvidaste la contraseña?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 h-12 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              // disabled={loading}
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};