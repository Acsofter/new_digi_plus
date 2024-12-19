import React from "react";
import { ClipboardList, Clock } from "lucide-react";

export const AdminPanel: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <div className="bg-gradient-to-tr from-slate-100 to-white  shadow-lg rounded-xl p-8 max-w-6xl w-full text-center">
        <div className="flex justify-center mb-6">
          <ClipboardList className="h-16 w-16 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Panel de Administración en Desarrollo
        </h2>
        <p className="text-gray-600 mb-6">
          Estamos trabajando para traerte herramientas de
          gestión. Pronto podrás acceder a los controles
          avanzados.
        </p>
        <div className="flex items-center justify-center text-amber-500 mb-4">
          <Clock className="size-4 mr-1" />
          <span className="font-medium">Próximamente</span>
        </div>
        <ul className="text-sm text-gray-500 mt-4">
          <li>• Gestión de usuarios</li>
          <li>• Configuración avanzada</li>
        </ul>
      </div>
    </div>
  );
};
