import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {!["/login", "/register"].includes(window.location.pathname) && (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 w-screen ">
          <Sidebar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col p-2 md:p-4"
          >
            {children}
          </motion.main>
        </div>
      )}
    </>
  );
};
