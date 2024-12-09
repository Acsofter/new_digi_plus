import React, { useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import { Contexts } from "../services/Contexts";
import { motion } from "framer-motion";
import { CirclePlus } from "lucide-react";

export const Modal = () => {
  const { state, dispatch } = useContext(Contexts);

  if (!state.popup.isOpen) return <></>;

  const handleClickOutside = (event: any) => {
    if (event.target.id === "modal-wrapper") {
      dispatch({
        type: "SET_POPUP",
        payload: {
          isOpen: false,
          loading: true,
          title: "",
          subtitle: "",
          content: undefined,
        },
      });
    }
  };

  window.addEventListener("click", handleClickOutside);

  return (
    <div
      id="modal-wrapper"
      className={`modal-wrapper absolute z-10 bg-gray-600/40 rounded-xl backdrop-blur-sm w-full h-full flex place-items-center justify-center ${
        state.popup.isOpen ? "visible" : "invisible"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.1 }}
        className="modal bg-white dark:bg-slate-900 dark:border dark:border-white/10 dark:text-white p-7 h-auto w-auto rounded-3xl shadow-md"
      >
        <div className="flex justify-between gap-3 items-center">
          <CirclePlus className="text-3xl" />
          <span className="  w-full">
            <p className="text-lg font-bold space-y-0 capitalize">
              {state.popup.title}
            </p>
            {state.popup.subtitle && (
              <span className="text-sm  text-zinc-400">
                {state.popup.subtitle}
              </span>
            )}
          </span>
          <button
            className="text-slate-500 dark:text-white text-lg py-1 px-3 rounded-md  hover:text-red-500"
            onClick={() =>
              dispatch({
                type: "SET_POPUP",
                payload: {
                  isOpen: false,
                  loading: true,
                  title: "",
                  subtitle: "",
                  content: undefined,
                },
              })
            }
          >
            <RxCross2 />
          </button>
        </div>
        <hr className="my-2 border-slate-100" />

        {state.popup.content}
      </motion.div>
    </div>
  );
};
