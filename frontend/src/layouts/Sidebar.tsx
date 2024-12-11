import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import noprofile from "../assets/image/noprofile.jpg";
import { useAuthentication } from "../contexts/AuthContext";
import { useWebsockets } from "../contexts/WebsocketContext";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const Sidebar = () => {
  const { getReadyStateColor } = useWebsockets();
  const { menuSidebar } = useAuthentication();
  const navigate = useNavigate();

  return (
    <motion.div
      className=" h-full md:w-24 px-1 py-3 flex max-h-20 md:max-h-full md:flex-col gap-3 justify-between items-center bg-slate-950 shadow-sm"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "tween", stiffness: 100, damping: 20 }}
    >
      <div className="w-full max-h-full flex md:flex-col items-center gap-3">
        {menuSidebar.map((menuitem: any, index: number) => (
          <SidebarMenuItem key={index} {...menuitem} />
        ))}
      </div>

      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <img
          src={noprofile}
          alt="profile"
          onClick={() => navigate("/profile")}
          style={{ borderColor: getReadyStateColor() }}
          className="size-10 md:size-14 rounded-full cursor-pointer border-2 border-indigo-400 transition-all duration-300 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/30"
        />
        <span
          className="absolute  top-0 -right-1 size-4 rounded-full border-2 border-slate-950 "
          style={{ backgroundColor: getReadyStateColor() }}
        ></span>
      </motion.div>
    </motion.div>
  );
};
