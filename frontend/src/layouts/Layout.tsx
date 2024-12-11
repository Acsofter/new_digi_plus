import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {!["/login", "/register"].includes(window.location.pathname) && (
        <div className="flex flex-col md:flex-row max-h-screen h-screen bg-slate-50 w-full overflow-hidden">
          <Sidebar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-screen h-screen p-2 md:p-10 overflow-scroll no-scrollbar md:overflow-hidden"
          >
            {children}
          </motion.main>
        </div>
      )}
    </>
  );
};
