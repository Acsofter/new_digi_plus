"use client";

import { Plus } from "lucide-react";
import { useHome } from "../contexts/HomeContext";
// import { DatePicker } from "./DatePicker";

export const TicketTable = () => {
  const { user, format_tickets, openModal } = useHome();

  return (
    <div className="w-full flex flex-col justify-between my-2 h-2/3 ">
      <div className="inline-flex justify-between items-center w-full py-2 gap-3">
        <span className="font-bold text-slate-800 text-2xl">Detalles</span>
        {/* buttons table */}
        <div className="flex  p-1 rounded-xl justify-between w-full">
          {/* <DatePicker onChange={handle_date_change} /> */}

          {user?.roles.includes("user") ? (
            <button
              className="flex items-center gap-2 px-4 py-2 mx-2 rounded-lg text-sm text-white bg-gradient-to-tr from-indigo-400 to-indigo-600 border border-indigo-200"
              onClick={() => {
                openModal();
              }}
            >
              <Plus className="h-4 w-4" />
              Añadir Ticket
            </button>
          ) : (
            <div className=""></div>
          )}
        </div>
      </div>
      <div className="w-full h-full overflow-scroll  dark:bg-slate-800/15 dark:border dark:border-slate-300/5 text-slate-700 p-1  overflow-x-hidden no-scrollbar ">
        <table className="table  w-full h-full  border-collapse border-spacing-y-1 text-xs lg:text-sm text-center  space-y-2  bg-white ">
          <thead className="text-[.6rem] md:text-xs border-collapse bg-slate-50 text-slate-400 uppercase sticky top-0 font-medium w-full-md dark:bg-slate-800/20 dark:text-white dark:border dark:border-slate-100 backdrop-blur-2xl ">
            <tr className="">
              <th className="  py-5 dark:text-white rounded-tl-lg">ID</th>

              <th className="py-5 bg-transparent dark:text-white w-32 text-left">Estado</th>
              <th className="py-5 bg-transparent dark:text-white hidden md:block">
                Tipo
              </th>
              <th className="py-5 bg-transparent dark:text-white ">Monto</th>
              <th className="py-5 bg-transparent dark:text-white w-32 text-left">Usuario</th>
              <th className="py-5 bg-transparent dark:text-white ">Fecha</th>
              <th className="py-5 bg-transparent dark:text-white rounded-tr-lg ">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="">
            {format_tickets(1)}
            {format_tickets(2)}
            {format_tickets(3)}
          </tbody>
        </table>
      </div>
    </div>
  );
};
