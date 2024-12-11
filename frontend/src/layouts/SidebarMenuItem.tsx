import { ReactElement, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface MenuItemProps {
  path: string;
  icon: ReactElement;
  name: string;
  notificaciones?: number;
}

export const SidebarMenuItem = ({ path, icon, name, notificaciones }: MenuItemProps) => {
  const navigate = useNavigate();
  const isActive = window.location.pathname === path;

  return (
    <div className="w-5/6">
    <motion.button
      onClick={() => navigate(path)}
      className={`group  w-full px-2 py-1 md:p-3 rounded-xl my-2 transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-md shadow-indigo-500/50"
          : "hover:bg-gradient-to-br hover:from-indigo-400 hover:to-indigo-600 hover:shadow-md hover:shadow-indigo-500/30"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {cloneElement(icon, {
        className: "text-white w-6 h-6 mx-auto mb-1",
      })}
      {notificaciones && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
          {notificaciones}
        </span>
      )}
      <span className="hidden md:block text-xs text-white font-medium truncate">
        {name}
      </span>
      <motion.span
        className="hidden md:block absolute  left-20 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {name}
      </motion.span>
    </motion.button>
  </div>
  );
};

