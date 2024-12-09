import {
  ArrowDownToLine,
  Award,
  Info,
  MessageSquareMore,
  UserRoundPen,
} from "lucide-react";
import { useContext } from "react";
import { General } from "../layouts/General";
import { Contexts } from "../services/Contexts";
const noprofile = require("../assets/image/noprofile.jpg");
const placeholder = require("../assets/image/placeholder.svg");

export const Profile = () => {
  const { state: { auth: { user } } } = useContext(Contexts);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-transparent">
      {/* sidebar */}
      <div className="w-full bg-white dark:bg-slate-800/60 dark:text-white p-4 flex flex-col md:w-1/6 shadow-md">
        <div className="mb-8 text-center">
          <img
            src={noprofile}
            alt="Patient"
            className="rounded-full w-24 h-24 mx-auto mb-4 border border-slate-200"
          />
          <h2 className="text-xl font-bold">{`${user?.first_name} ${user?.last_name}`}</h2>
          <div>
            {user.roles.map((role, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-center space-x-2 mb-8">
          <button className="p-2 bg-gray-200 rounded-full" aria-label="Message">
            <MessageSquareMore size={18} />
          </button>
          <button className="p-2 bg-blue-600 text-white rounded-full" aria-label="Download record">
            <ArrowDownToLine size={18} />
          </button>
        </div>
        <div className="space-y-4 text-center md:text-left duration-300">
          <h3 className="font-semibold">Informacion</h3>
          <div className="text-sm text-gray-500">
            <p>Nombre de usuario: {user.username}</p>
            <p>Correo Electronico: {user.email}</p>
            <p>Cumpleaños: 21/10/2000</p>
            <div className="w-full h-5 text-white text-sm px-2 rounded-xl" style={{ backgroundColor: user.color }}>
              {user.color}
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 p-8 w-full h-screen dark:bg-slate-800/40 dark:text-white">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Info size={30} />
            <div>
              <p className="font-semibold">Perfil</p>
              <p className="text-sm text-gray-500">Informaciones del usuario</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/40 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="space-x-4 w-full text-gray-500 dark:text-white">
              <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Detalles</button>
              <button>Documentos</button>
              <button>Acciones</button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              <UserRoundPen />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <h3 className="font-semibold mb-4">Logros</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { title: "Desempeño", time: "5 meses antes", color: "amber-600" },
                  { title: "Clientes", time: "1 mes antes", color: "green-600" },
                  { title: "Monto", time: "4 meses antes", color: "violet-600" },
                ].map(({ title, time, color }, index) => (
                  <div className="inline-flex" key={index}>
                    <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center mr-3`}>
                      <Award size={18} className={`text-${color}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-gray-500">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Actividad</h3>
              <div className="relative bg-zinc-100 dark:bg-slate-800/30 rounded-md h-72">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className={`absolute ${index === 0 ? 'top-1/4' : index === 1 ? 'top-1/2' : 'bottom-1/4'} left-1/4 w-3 h-3 bg-blue-600 rounded-full`}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="font-semibold mb-4">Progreso del mes</h3>
              <div className="relative">
                <svg viewBox="0 0 100 100" className="w-32 h-32">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e6e6e6" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray="220" strokeDashoffset="60" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Estadisticas</h3>
              <div className="h-20 bg-gray-100 dark:bg-slate-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
