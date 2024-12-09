import { BadgeHelp, Gauge, House, MonitorCog, Shield } from "lucide-react";
import { cloneElement, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReadyState } from "react-use-websocket";
import { Contexts } from "../services/Contexts";

const noprofile = require("../assets/image/noprofile.jpg");

export const Sidebar = () => {
  const { state } = useContext(Contexts);
  const navigate = useNavigate();
  const [transparent, setTransparent] = useState(false);
  
  const menu = useMemo(() => {
    const baseMenu: { name: string; icon: JSX.Element; path: string, notificaciones?: number }[] = [
      { name: "Inicio", icon: <House size={24} />, path: "/home" },
      { name: "Estadisticas", icon: <Gauge size={24} />, path: "/dashboard" },
       {
        name: "Administración",
        icon: <Shield size={24} />,
        path: "/admin",
      },
      { name: "Ajustes", icon: <MonitorCog size={24} />, path: "/settings" },
      { name: "Ayuda", icon: <BadgeHelp size={24} />, path: "/help" },
    ];
    return baseMenu.filter(Boolean);
  }, [state.auth.user]);

  const getReadyStateColor = () => {
    const readyStateColors: Record<ReadyState, string> = {
      [ReadyState.CONNECTING]: "#FBBF24",
      [ReadyState.OPEN]: "#34D399",
      [ReadyState.CLOSING]: "#F87171",
      [ReadyState.CLOSED]: "#F87171",
      [ReadyState.UNINSTANTIATED]: "#F87171",
    };
    return readyStateColors[state.ws.readyState as ReadyState] || "#F87171";
  };

  useEffect(() => {
    setTransparent(localStorage.getItem("transparent") === "true");
  }, []);

  return (
    <div className={`sidebar md:w-24 px-5 flex md:flex-col justify-between r items-center gap-2 ${transparent ? "bg-transparent" : "bg-base"}`}>
      <div className="md:w-full h-full flex gap-2 md:block place-content-cente ">
       {menu.map(
          (menuitem, index) =>
           
            <button
            key={index}
            onClick={() => navigate(menuitem.path)}
            className={`group relative duration-300 ${window.location.pathname === menuitem.path ? `bg-secondary ${transparent ? "text-white" : "text-primary"}` : "bg-transparent"} transition-all max-w-20 min-w-12 text-center text-xs md:text-sm w-full hover:bg-gradient-to-br hover:from-secondary hover:to-primary shadow-sm shadow-slate-950/10 py-3 md:p-4 rounded-xl my-3`}
          >
             {cloneElement(menuitem.icon, {
               className: `${transparent ? "text-primary group-hover:text-white" : "text-white"} text-center duration-300 w-full`,
             })}
             {menuitem.notificaciones  && (
               <span className="absolute top-[-.5em] right-[-.2em] text-xs text-white bg-primary px-2 py-.5 rounded-md hidden md:inline-block">
                 {menuitem.notificaciones}
               </span>
             )}
             <span className="w-full md:w-auto md:h-8 absolute left-0 bottom-[-2em] z-20 md:px-5 py-2 md:left-[5em] md:top-2 md:bg-slate-900/20 md:backdrop-blur-sm text-white font-semibold text-xs rounded-md invisible group-hover:visible duration-200 transition-all ease-linear truncate md:text-clip">
               {menuitem.name}
             </span>
          </button>
        )}
        
      </div>

      <div className="group relative text-sm w-full h-13 duration-100 border-1 place-items-center py-2 max-w-16">
        <img
          src={noprofile}
          alt="profile"
          onClick={() => navigate("/profile")}
          className="text-center text-zinc-300 inline group-hover:text-slate-100 duration-300 rounded-full cursor-pointer max-w-12"
        />
        <span
          className="block absolute top-0 right-[-2px] text-xs text-white rounded-xl duration-300 w-3 h-3"
          style={{ backgroundColor: getReadyStateColor() }}
        ></span>
      </div>
    </div>
  );
};
