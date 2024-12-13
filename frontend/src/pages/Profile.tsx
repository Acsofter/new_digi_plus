import React from "react";
import { useAuthentication } from "../contexts/AuthContext";

import { motion } from "framer-motion"; // Importar motion de framer-motion

export const Profile = () => {
  const { user } = useAuthentication();

  return (
    <motion.div // Cambiar div a motion.div
      className="w-1/2 h-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200"
      initial={{ opacity: 0 }} // Propiedades iniciales de animación
      animate={{ opacity: 1 }} // Propiedades de animación
      transition={{ duration: 0.5 }} // Duración de la animación
    >
      <div className="flex h-1/3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl mb-10 items-center space-x-4"></div>
      <div className="flex items-center space-x-4">
        <motion.div // Cambiar div a motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
          style={{ backgroundColor: user.color }}
          initial={{ scale: 0 }} // Propiedades iniciales de animación
          animate={{ scale: 1 }} // Propiedades de animación
          transition={{ duration: 0.5 }} // Duración de la animación
        >
          {user.first_name[0]}
          {user.last_name[0]}
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          <strong>Estado:</strong> {user.is_active ? "Activo" : "Inactivo"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Usuario:</strong> {user.username}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Roles:</strong> {user.roles.join(", ")}
        </p>
      </div>

      <button
        type="button"
        disabled={true}
        className="mt-6 w-full py-2 px-4 bg-gray-300 text-white font-medium rounded-lg shadow  focus:ring-opacity-75"
      >
        Editar Perfil
      </button>
    </motion.div>
  );
};
