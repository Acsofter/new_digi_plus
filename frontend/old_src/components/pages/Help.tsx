import { useState } from "react";
import { SearchIcon, ChevronDownIcon } from "lucide-react";
import { General } from "../layouts/General";
import { motion } from "framer-motion";

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const items = [
    {
      title: "Administracion de usuario",
      description: "Crea, edita y elimina usuarios en tu red.",
    },
    {
      title: "Visualizacion de tickets",
      description:
        "Visualiza los tickets pendientes, rechazados y aprobados en tu red.",
    },
    {
      title: "Registros",
      description: "Crea, edita y elimina registros en tu red.",
    },
    {
      title: "Exportar datos",
      description: "Exporta los datos de tu red a un archivo de Excel o CSV.",
    },
    {
      title: "Metricas",
      description:
        "Visualiza las metricas de tus tickets pendientes, rechazados y aprobados.",
    },
    {
      title: "Pagos",
      description: "Paga tus tickets pendientes, rechazados y aprobados.",
    },
    {
      title: "Espacio de trabajo",
      description: "Crea, edita y elimina espacios de trabajo en tu red.",
    },
    {
      title: "Colecciones",
      description: "Crea, edita y elimina colecciones de datos en tu red.",
    },
    {
      title: "Ajustes",
      description: "Cambia la configuración de la compania, temas, colores.",
    },

    {
      title: "Actividad y notificaciones",
      description: "Mantente al día con cambios, comentarios y más.",
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center px-6 py-4 border-b dark:text-white">
        <h1 className="text-2xl font-bold">Centro de Ayuda</h1>
      </header>

      <main className="px-6 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Encuentra lo que sea"
              className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-white/10 dark:border-white/10 dark:placeholder-white focus:outline-none dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <button className="border rounded-md px-3 py-2 flex items-center space-x-2 dark:text-white dark:bg-white/20">
            <span>英</span>
            <ChevronDownIcon size={16} />
          </button>
        </div>

        <div className="bg-primary dark:bg-slate-900/70 rounded-lg p-6 mb-8 text-white">
          <motion.h2
            initial={{ translateX: 100, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            Espacio de Trabajo
          </motion.h2>
          <motion.p
            initial={{ translateX: 100, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Ve los mismos datos de la colección en múltiples formas
            configurables.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.04 * index }}
              key={item.title}
              className={`p-4 rounded-lg ${
                index === 3
                  ? "bg-gradient-to-tr from-blue-400 to-blue-500 text-white dark:from-primary dark:to-primary"
                  : "bg-gray-100 text-zinc-500 dark:bg-slate-900/30 dark:text-white"
              } `}
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm ">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
