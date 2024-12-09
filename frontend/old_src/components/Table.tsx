import axios from "axios";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  CircleX,
  CreditCard,
  DollarSign,
  ListCollapse,
  UserRound
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  FcMoneyTransfer
} from "react-icons/fc";
import { AuthHeader } from "../services/auth.header";
import { Contexts } from "../services/Contexts";
import { useUserServices } from "../services/user.services";
import { DatePicker } from "./DatePicker";
import { FormTicket } from "./Form.ticket";

const initialState: { approved: ResponseTickets | false; pending: ResponseTickets | false; rejected: ResponseTickets | false } = {
    approved: false,
    pending: false,
    rejected: false,
  }

export const Table = () => {
  const { get_tickets, update_ticket, get_week, get_week_number } = useUserServices();
  const { state, dispatch } = useContext(Contexts);
  const [currentWeek, setCurrentWeek] = useState({
    week_number: get_week_number(new Date()),
    is_paid: false,
  });
  const [responseTickets, setResponseTickets] = useState(initialState);

  const handlerPagination = useCallback(async (url: string | null, type: keyof typeof responseTickets) => {
    if (!url) return;
    try {
      const response = await axios.get(url, { headers: AuthHeader() });
      setResponseTickets((prev) => ({ ...prev, [type]: response.data }));
    } catch (error) {
      console.error(`Error fetching tickets: ${error}`);
    }
  }, []);

  const get_current_week = async () => {
    const response = await get_week({ week: currentWeek.week_number });
    setCurrentWeek(response || { ...currentWeek, is_paid: false });
  };

  const handle_date_change = (startDate: Date) => {
    setCurrentWeek((prev) => ({ ...prev, week_number: get_week_number(startDate) }));
  };

  const format_tickets = (title: string, response: ResponseTickets) => {
    const type = title.includes("Rechazados") ? "rejected" : title.includes("Pendientes") ? "pending" : "approved";
    return (
      <>
        <tr className="text-left text-zinc-400 dark:text-slate-200 text-xs ">
          {response.current && (
            <>
              <td className="font-bold">{title.replace("Tickets ", "")}</td>
              <td className="text-center">{"Mostrando "}</td>
              <td className="w-20">{`${Math.min((response.current - 1) * 5 + 1, response.count)} - ${Math.min(response.current * 5, response.count)} de ${response.count}`}</td>
              <td className="text-zinc-400 text-xs">
                <div className="inline-flex gap-1">
                  <button className="text-primary/60 hover:text-primary/80" onClick={() => handlerPagination(response.previous, type)} disabled={!response.previous}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="text-primary/60 hover:text-primary/80" onClick={() => handlerPagination(response.next, type)} disabled={!response.next}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </td>
            </>
          )}
        </tr>
        {response.results.map((ticket, index) => (
          <motion.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 * index }}
            key={ticket.id}
          >
            <td className="w-4 p-2 md:p-4 bg-white dark:bg-slate-800/20 dark:text-white rounded-l-lg">
              <div className="flex items-center">
                <input id={`checkbox-${ticket.id}`} type="checkbox" className="w-4 h-4 ring-none dark:bg-slate-500" />
                <label htmlFor={`checkbox-${ticket.id}`} className="sr-only">checkbox</label>
              </div>
            </td>
            <td className="py-3 w-20 bg-white dark:bg-slate-800/20 dark:text-white">{response.current && (response.current - 1) * 5 + index + 1}</td>
            <td className="py-3 bg-white dark:bg-slate-800/20 dark:text-white">
              <div className="grid sm:grid-cols-2 items-center justify-center max-full gap-3">
                <div className={`p-2 max-w-10 rounded-full bg-amber-300 hidden sm:table-cell justify-self-end`}>
                  <DollarSign className="text-white" size={20} />
                </div>
                <p className="text-left font-bold">{ticket.payment.amount} <br />
                  <span className="block text-xs text-gray-400 font-normal">{parseInt(ticket.payment.amount) > 200 ? "Bajo" : parseInt(ticket.payment.amount) < 500 ? "Alto" : "Medio"}</span>
                </p>
              </div>
            </td>
            <td className="py-5 bg-white dark:bg-slate-800/20 dark:text-white hidden md:table-cell">
              {ticket.payment.type === "Efectivo" ? <FcMoneyTransfer className="inline-block mx-1" size={16} /> : <CreditCard className="inline-block mx-1 text-primary" size={16} />} {ticket.payment.type}
            </td>
            <td className="py-3 gap-2 bg-white dark:bg-slate-800/20 dark:text-white w-34">
              <div className="grid sm:grid-cols-2 items-center justify-center gap-3">
                <div className={`p-2 max-w-10 rounded-full hidden sm:block justify-self-end`} style={{ backgroundColor: ticket.collaborator.color }}>
                  <UserRound className="text-white" size={20} />
                </div>
                <p className="text-left font-bold">{ticket.collaborator.username}<span className="block text-xs text-gray-400 font-normal">usuario</span></p>
              </div>
            </td>
            <td className="py-5 bg-white dark:bg-slate-800/20 dark:text-white">{new Date(ticket.created_at).toLocaleString()}</td>
            <td className="py-3 gap-2 bg-white dark:bg-slate-800/20 dark:text-white w-34">
              <div className="grid sm:grid-cols-2 items-center justify-center gap-3">
                <div className={`p-2 max-w-10 rounded-full hidden sm:block justify-self-end ${ticket.payment.status === "1" ? "bg-violet-400" : ticket.payment.status === "2" ? "bg-green-400" : "bg-red-400"}`}>
                  <CircleDashed className="text-white" size={20} />
                </div>
                <p className="text-left font-bold">{ticket.payment.status === "1" ? "Pendiente" : ticket.payment.status === "2" ? "Aprobado" : "Cancelado"}<span className="block text-xs text-gray-400 font-light">default</span></p>
              </div>
            </td>
            <td className="bg-white dark:bg-slate-800/20 dark:text-white rounded-r-lg">
              {state.auth.user?.roles.includes("user") ? (
                <>
                  <ListCollapse size={20} className="inline-block mx-1 text-primary cursor-pointer" onClick={() => dispatch({ type: "SET_POPUP", payload: { isOpen: true, loading: true, title: "Ticket", subtitle: "Editar", content: <FormTicket ticket_id={ticket.id} /> } })} />
                  <CircleX size={20} className="inline mx-0.5 cursor-pointer" onClick={() => {}} />
                </>
              ) : (
                <>
                  {["2", "3", "1"].map((status, idx) => (
                    <button key={status} className="inline mx-0.5 text-lg" onClick={() => update_ticket({ details: { id: ticket.id, payment: { status } } })}>
                      {["👍", "👎", "⚠️"][idx]}
                    </button>
                  ))}
                </>
              )}
            </td>
          </motion.tr>
        ))}
      </>
    );
  };

  const fetchTickets = async () => {
    const statuses = ["2", "1", "3"];
    const responses = await Promise.all(statuses.map(status => get_tickets({ status })));
    setResponseTickets({
      approved: responses[0],
      pending: responses[1],
      rejected: responses[2],
    });
  };

  useEffect(() => {
    get_current_week().then(fetchTickets);
  }, [currentWeek.week_number]);

  useEffect(() => {
    const msg = state.ws.lastMessage;
    if (!msg) return;

    const shouldFetch = (msg.type === "ticket_added" || msg.type === "ticket_deleted") && (msg.user.username === state.auth.user.username || state.auth.user.roles.includes("staff")) ||
      (msg.type === "ticket_updated" && ((msg.payload.collaborator && msg.payload.collaborator.id === state.auth.user.id) || state.auth.user.roles.includes("staff")));

    if (shouldFetch) fetchTickets();
  }, [state.ws.lastMessage]);

  return (
    <div className="w-full flex flex-col justify-between my-2 h-2/3 ">
      <div className="flex flex-wrap justify-end items-center w-full py-2 gap-1">
        <DatePicker onChange={handle_date_change} />
        <button className="px-5 py-2 rounded-lg text-sm border border-green-500 text-green-500 dark:border-white/10 shadow-sm dark:bg-white/15 dark:text-white" onClick={fetchTickets}>
          Buscar
        </button>
        {state.auth.user.roles.includes("user") && (
          <button className="px-5 py-2 rounded-lg text-sm bg-gradient-to-tr border border-blue-500 from-blue-600 to-blue-400 text-white dark:border-slate-800/15 shadow-sm dark:to-slate-800/20 dark:from-slate-800 dark:text-white" onClick={() => dispatch({ type: "SET_POPUP", payload: { isOpen: true, loading: false, title: "Ticket", subtitle: "Agregar", content: <FormTicket /> } })}>
            Agregar
          </button>
        )}
      </div>

      <div className="w-full h-full overflow-scroll bg-zinc-100 dark:bg-slate-800/15 dark:border dark:border-slate-300/5 text-slate-700 p-3 rounded-xl no-scrollbar ">
        <table className="table w-full border-separate border-spacing-y-1 text-xs lg:text-sm text-center space-y-2 h-1/2 ">
          <thead className="text-xs text-gray-700 uppercase sticky top-0 bg-white dark:bg-slate-800/20 dark:text-white dark:border dark:border-slate-100 backdrop-blur-2xl">
            <tr>
              <th className="p-2 md:p-4 dark:text-white rounded-l-lg ">
                <div className="flex items-center">
                  <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 rounded-xl text-primary-blue bg-gray-100 border-gray-300 focus:ring-primary-blue focus:ring-primary-blue ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2" />
                  <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                </div>
              </th>
              <th className="max-w-5 py-5 dark:text-white">ID</th>
              <th className="py-5 bg-transparent dark:text-white">Monto</th>
              <th className="py-5 bg-transparent dark:text-white hidden md:block">Tipo</th>
              <th className="py-5 bg-transparent dark:text-white">Usuario</th>
              <th className="py-5 bg-transparent dark:text-white">Fecha</th>
              <th className="py-5 bg-transparent dark:text-white">Estado</th>
              <th className="py-5 bg-transparent dark:text-white rounded-r-lg">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {responseTickets.pending && format_tickets("Tickets Pendientes", responseTickets.pending)}
            {responseTickets.rejected && format_tickets("Tickets Rechazados", responseTickets.rejected)}
            {responseTickets.approved && format_tickets("Tickets Aprobados", responseTickets.approved)}
          </tbody>
        </table>
      </div>
    </div>
  );
};
