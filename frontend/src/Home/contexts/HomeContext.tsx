import { getISOWeek } from "date-fns";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  DollarSign,
  Percent,
  Ticket,
} from "lucide-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthentication } from "../../contexts/AuthContext";
import { useWebsockets } from "../../contexts/WebsocketContext";
import { useUserServices } from "../../services/user.services";
import { RenderTickets } from "../utils/TableUtils";

const initialMetricsState: MetricsInterface = {
  today: {
    tickets: { approved: 0, total: 0 },
    gross: { approved: 0, total: 0 },
    net: { approved: 0, total: 0 },
    cancelled: { approved: 0, total: 0 },
    pending: { approved: 0, total: 0 },
  },
  week: {
    tickets: { approved: 0, total: 0 },
    gross: { approved: 0, total: 0 },
    net: { approved: 0, total: 0 },
    cancelled: { approved: 0, total: 0 },
    pending: { approved: 0, total: 0 },
  },
  month: {
    tickets: { approved: 0, total: 0 },
    gross: { approved: 0, total: 0 },
    net: { approved: 0, total: 0 },
    cancelled: { approved: 0, total: 0 },
    pending: { approved: 0, total: 0 },
  },
  year: {
    tickets: { approved: 0, total: 0 },
    gross: { approved: 0, total: 0 },
    net: { approved: 0, total: 0 },
    cancelled: { approved: 0, total: 0 },
    pending: { approved: 0, total: 0 },
  },
};

const initialForm = {
  category: null,
  description: "",
  payment: {
    type: "Efectivo",
    amount: 0,
  },
};

export const HomeContext = createContext<any | null>(null);

// Function to get the current week number
const getWeekNumber = () => {
  const currentDate = new Date();
  return getISOWeek(currentDate); // Returns the ISO week number
};

export const HomeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { wsState } = useWebsockets();
  const { user } = useAuthentication();
  const { getMetrics, getTickets, getCategories, handlePagination, getWeek } =
    useUserServices();
  const [ticketSelected, setTicketSelected] = useState<Ticket | null>(null);
  const [addTicketModal, setAddTicketModal] = useState(false);

  const [metrics, setMetrics] = useState<MetricsInterface>(initialMetricsState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentWeek, setCurrentWeek] = useState({ is_paid: false });
  const { createTicket } = useUserServices();
  const quickAmounts = [25, 30, 35, 50, 75, 100, 200, 500];
  const [form, setForm] = useState(initialForm);
  const [responseTicketsPending, setResponseTicketsPending] =
    useState<PaginatedResponse<Ticket> | null>(null);
  const [responseTicketsRejected, setResponseTicketsRejected] =
    useState<PaginatedResponse<Ticket> | null>(null);
  const [responseTicketsApproved, setResponseTicketsApproved] =
    useState<PaginatedResponse<Ticket> | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response) setCategories(response.results);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const getCurrentWeek = async () => {
    const filters = { week: getWeekNumber(), collaborator: user?.id }
    const response = await getWeek(filters);
    if (response) {
      setCurrentWeek(response);
    }
  };

  const closeAddTicketModal = () => {
    setAddTicketModal(false);
  };

  const openAddTicketModal = () => {
    setAddTicketModal(true);
  };

  const fetchTickets = async () => {
    try {
      const [pending, rejected, approved] = await Promise.all([
        getTickets({ status: "1" }),
        getTickets({ status: "3" }),
        getTickets({ status: "2" }),
      ]);

      if (pending) setResponseTicketsPending(pending);
      if (rejected) setResponseTicketsRejected(rejected);
      if (approved) setResponseTicketsApproved(approved);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const clearForm = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const response = await createTicket(form);
    if (response) {
      clearForm();
    }
  };

  const handleChanges = ({
    changes,
  }: {
    changes: { [key: string]: string | number };
  }) => {
    const updatedForm = { ...form, ...changes };
    setForm(updatedForm);
  };

  const onChangePagination = async (url: string, status: number) => {
    if (!url) return;
    const response = await handlePagination(url);
    if (response) {
      switch (status) {
        case 1:
          setResponseTicketsPending(response);
          break;
        case 2:
          setResponseTicketsApproved(response);
          break;
        case 3:
          setResponseTicketsRejected(response);
          break;
        default:
          break;
      }
    }
  };

  const getStatus = (status: number) => {
    switch (status) {
      case 1:
        return (
          <div className="inline-flex flex-nowrap gap-1 font-semibold w-full">
            <div className="auto-center px-2 py-1 bg-indigo-100 border border-indigo-200 rounded-full text-indigo-500 text-[.6rem] md:text-xs ">
              <Circle className="w-3 h-2 hidden md:inline" /> Pendiente
            </div>
          </div>
        );
      case 2:
        return (
          <div className="inline-flex flex-nowrap items-center gap-1 font-semibold w-full">
            <div className="auto-center px-2 py-1 bg-teal-100 border border-teal-200 rounded-full text-teal-500 text-[.6rem] md:text-xs">
              <Circle className="w-3 h-2 hidden md:inline" /> Aprobado
            </div>
          </div>
        );
      case 3:
        return (
          <div className="inline-flex flex-nowrap items-center gap-1 font-semibold w-full">
            <div className="auto-center px-2 py-1 bg-rose-100 border border-rose-200 rounded-full text-rose-500 text-[.6rem] md:text-xs">
              <Circle className="w-3 h-2 hidden md:inline" /> Rechazado
            </div>
          </div>
        );
      default:
        return "Desconocido";
    }
  };

  const format_tickets = (status: number) => {
    const types = {
      1: {
        title: "Pendientes",
        response: responseTicketsPending,
        color: "border-indigo-200",
      },
      2: {
        title: "Aprobados",
        response: responseTicketsApproved,
        color: "border-teal-200",
      },
      3: {
        title: "Rechazados",
        response: responseTicketsRejected,
        color: "border-rose-200",
      },
    };

    const { title, response, color } = types[status as keyof typeof types];

    const renderTicketsProps = {
      color,
      getStatus,
      response,
      currentWeek,
      fetchTickets,
      user,
      onSelectTicket: setTicketSelected,
    };

    return (
      <>
        <motion.tr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          
          className="text-xs text-slate-400 dark:bg-slate-700 font-semibold h-16"
        >
          {response && (
            <>
              <td className={`${color} text-left w-5`}>
                {title}
                <br />
                <span className="text-slate-300 font-normal">
                  {response.count > 0
                    ? `pag. ${response.current} / ${Math.ceil(
                        response.count / 5
                      )}`
                    : "..."}
                </span>
              </td>
              {response.count > 0 ? (
                <>
                  <td className="w-5">
                    <button
                      disabled={!response.previous}
                      className="hover:text-slate-800 duration-300 text-slate-300 disabled:text-slate-200"
                      onClick={() =>
                        onChangePagination(response.previous as string, status)
                      }
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  </td>
                  <td className="w-5">
                    <button
                      disabled={!response.next}
                      className="hover:text-slate-800 duration-300 text-slate-300 disabled:text-slate-200"
                      onClick={() =>
                        onChangePagination(response.next as string, status)
                      }
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>---</td>
                  <td
                    colSpan={3}
                    className="text-left font-normal italic text-gray-300 "
                  >
                    Aun no existen tickets {title.toLowerCase()} para mostrar
                  </td>
                </>
              )}
            </>
          )}
        </motion.tr>
        <RenderTickets {...renderTicketsProps} />
      </>
    );
  };

  const cards: Card[] = [
    {
      name: "Tickets",
      total: metrics.week.tickets.total,
      approved: metrics.week.tickets.approved,
      color: "bg-rose-500 text-slate-600 from-slate-300 to-slate-400 ",
      icon: <Ticket size={30} className="text-zinc-400" />,
    },
    {
      name: "Bruto",
      total: metrics.week.gross.total,
      approved: metrics.week.gross.approved,
      // pending: metrics.week.pending,
      // cancelled: metrics.week.cancelled,
      color:
        "bg-white text-slate-200 bg-gradient-to-rt from-slate-400 to-slate-600",
      icon: <DollarSign size={30} className="text-slate-500" />,
    },
    {
      name: "Porc.",
      total: metrics.week.net.total,
      approved: metrics.week.net.approved,
      color: "bg-indigo-600 text-indigo-100 from-indigo-400 to-indigo-700",
      icon: <Percent size={30} className="text-indigo-600 " />,
    },
  ];

  const fetchMetrics = async () => {
    try {
      const response = await getMetrics();

      setMetrics(response);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  useEffect(() => {
    if (wsState.lastMessage) {
      const lastMessage = JSON.parse(wsState.lastMessage.data);

      switch (lastMessage.type) {
        case "payment_for_user":
            fetchTickets();
            getCurrentWeek();
            break
        case "ticket_added":
        case "ticket_updated":
        case "ticket_deleted":
          fetchTickets();
          fetchMetrics();
          getCurrentWeek();
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsState]);

  useEffect(() => {
    fetchMetrics();
    fetchTickets();
    fetchCategories();
    getCurrentWeek();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    quickAmounts,
    closeAddTicketModal,
    openAddTicketModal,
    addTicketModal,
    handleChanges,
    handleSubmit,
    metrics,
    cards,
    fetchMetrics,
    responseTicketsPending,
    responseTicketsRejected,
    responseTicketsApproved,
    user,
    fetchTickets,
    format_tickets,
    categories,
    form,
    getStatus,
    ticketSelected,
    currentWeek,
    onUnselectTicket: () => setTicketSelected(null),

    title: "Home",
  };

  return (
    <HomeContext.Provider
      value={{
        ...contextValue,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within an HomeProvider");
  }
  return context;
};
