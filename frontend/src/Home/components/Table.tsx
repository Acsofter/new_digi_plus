"use client";

import { useHome } from "../contexts/HomeContext";
// import { DatePicker } from "./DatePicker";

export const TicketTable = () => {
  const { format_tickets } = useHome();

  return (
    <div className=" text-slate-700 h-full overflow-scroll no-scrollbar">
      <table className="table w-full  border-spacing-y-1 text-xs lg:text-sm text-center  space-y-2 bg-slate-50 ">
        <thead className="text-[.6rem] md:text-xs  bg-white text-slate-400 uppercase sticky top-0 font-medium w-full-md dark:bg-slate-800/20 dark:text-white dark:border dark:border-slate-100 backdrop-blur-2xl ">
          <tr className="">
            <th className="py-5 dark:text-white rounded-tl-lg">ID</th>

            <th className="py-5 bg-transparent dark:text-white w-32 text-left">
              Estado
            </th>
            <th className="py-5 bg-transparent dark:text-white hidden md:block">
              Tipo
            </th>
            <th className="py-5 bg-transparent dark:text-white ">Monto</th>
            <th className="py-5 bg-transparent dark:text-white w-32 text-left">
              Usuario
            </th>
            <th className="py-5 bg-transparent dark:text-white ">Fecha</th>
            <th className="py-5 bg-transparent dark:text-white rounded-tr-lg ">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="h-96 overflow-y-scroll max-h-60 ">
          {format_tickets(1)}
          {format_tickets(2)}
          {format_tickets(3)}
        </tbody>
      </table>
    </div>
  );
};
