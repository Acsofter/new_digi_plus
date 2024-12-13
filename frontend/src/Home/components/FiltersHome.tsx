import { AlertCircle, Plus } from "lucide-react";
import { useHome } from "../contexts/HomeContext";

export const FiltersHome = () => {
  const { user, openAddTicketModal, currentWeek } = useHome();

  const isAddTicketDisabled =
    !user?.roles.includes("user") || currentWeek.is_paid;

  return (
    <div className="flex justify-between items-center  py-4 ">
      <div className="flex  items-center">
        <h2 className="font-bold text-slate-800 text-2xl ">Detalle</h2>
        {isAddTicketDisabled && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 m-2 rounded-r-lg ">
            <div className="flex items-center ">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
              <p className="text-xs text-yellow-600  hidden md:inline w-full">
                Las acciones están deshabilitadas en este momento. <br />
                Esto puede deberse a que la semana actual ya ha sido pagada o no
                tienes los permisos necesarios.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {/* <DatePicker onChange={handle_date_change} /> */}
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out
              ${
                isAddTicketDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-white bg-gradient-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md hover:shadow-lg"
              }`}
          onClick={isAddTicketDisabled ? undefined : openAddTicketModal}
          disabled={isAddTicketDisabled}
        >
          <Plus className="h-4 w-4" />
          Añadir Ticket
        </button>
      </div>
    </div>
  );
};
