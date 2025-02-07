import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserServices } from "../../services/user.services";
import { Circle } from "lucide-react";
import { useWebsockets } from "../../contexts/WebsocketContext";

export const PaymentContext = createContext<any | null>(null);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    getPayments,
    getUsers,
    getWeekNumber,
    getReport,
    generatePaymentForUser,
    generatePaymentForAll,
    getWeek,
    handlePagination,
  } = useUserServices();

  const { wsState } = useWebsockets();
  const [users, setUsers] = useState<User[]>([]);
  const [currentWeek, setCurrentWeek] = useState({ is_paid: false });
  const [filters, setFilters] = useState<{
    collaborator: number | null;
    week: number;
  }>({
    collaborator: null,
    week: getWeekNumber(new Date()),
  });

  const [payments, setPayments] = useState<ResponsePayments>({
    count: 0,
    pages: 0,
    next: null,
    current: null,
    previous: null,
    results: [],
  });

  const getWeekDates = (date: Date): [Date, Date] => {
    const start = new Date(date);
    start.setDate(
      date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)
    );
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
  };

  const onHandleNextPagination = async () => {
    if (payments.next) {
      const response = await handlePagination(payments.next);
      if (response) setPayments(response);
    }
  };

  const onHandlePreviousPagination = async () => {
    if (payments.previous) {
      const response = await handlePagination(payments.previous);
      if (response) setPayments(response);
    }
  };

  const getStatus = (status: number) => {
    switch (status) {
      case 1:
        return (
          <div className="inline-flex gap-1 font-semibold w-full">
            <div className="auto-center px-2 py-1 bg-indigo-100 border border-indigo-200 rounded-full text-indigo-500 text-[.6rem] md:text-xs ">
              <Circle className="w-3 h-2 hidden md:inline" /> Pendiente
            </div>
          </div>
        );
      case 2:
        return (
          <div className="inline-flex items-center gap-1 font-semibold w-full">
            <div className="auto-center px-2 py-1 bg-teal-100 border border-teal-200 rounded-full text-teal-500 text-[.6rem] md:text-xs">
              <Circle className="w-3 h-2 hidden md:inline" /> Aprobado
            </div>
          </div>
        );
      case 3:
        return (
          <div className="inline-flex items-center gap-1 font-semibold w-full">
            <div className="auto-center px-2 py-1 bg-rose-100 border border-rose-200 rounded-full text-rose-500 text-[.6rem] md:text-xs">
              <Circle className="w-3 h-2 hidden md:inline" /> Rechazado
            </div>
          </div>
        );
      default:
        return "Desconocido";
    }
  };

  const getBadge = (status: string) => {
    switch (status) {
      case "3":
        return (
          <span className=" bg-red-100 text-red-500  px-2 py-1 text-xs rounded-md font-semibold dark:bg-red-600/20">
            Rechazado
          </span>
        );
      case "2":
        return (
          <span className=" bg-green-100 text-green-500  px-2 py-1 text-xs rounded-md font-semibold dark:bg-green-600/20">
            Aceptado
          </span>
        );

      default:
        return (
          <span className=" bg-amber-100 text-amber-500  px-2 py-1 text-xs rounded-md font-semibold dark:bg-amber-600/20">
            Pendiente
          </span>
        );
    }
  };

  const handleChangesFilters = (changes: {
    [key: string]: string | number;
  }) => {
    setFilters({ ...filters, ...changes });
  };

  const fetchPayments = async () => {
    if (!filters.collaborator) return;
    const response = await getPayments({ filters });
    if (response) setPayments(response);
  };

  const fetchUsers = async () => {
    const response = await getUsers({ includeAdmins: false });
    if (response) setUsers(response);
  };

  const exportPayments = async () => {
    const collaborators_for_get_report = filters.collaborator
      ? [{ id: filters.collaborator }]
      : users;

    collaborators_for_get_report.forEach(async (user) => {
      const response = await getReport({ user: user.id });

      if (response) {
        const blob = new Blob([response], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        window.open(url);
      }
    });
  };

  const getCurrentWeek = async () => {
    if (!filters.collaborator) return;
    const response = await getWeek({ week: filters.week, collaborator: filters.collaborator });
    if (response) {
      setCurrentWeek(response);
    } else {
      setCurrentWeek({ ...currentWeek, is_paid: false });
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUsers();
    getCurrentWeek();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (!wsState.lastMessage) return;
    const lastMessage = JSON.parse(wsState.lastMessage.data);
    switch (lastMessage.type) {
      case "user_added":
      case "user_updated":
        fetchUsers();
        break;
      case "payment_added":
      case "payment_updated":
      case "payment_for_all":
      case "payment_for_user":
      case "ticket_added":
      case "ticket_updated":
        fetchPayments();
        getCurrentWeek();
        break;
      default:
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsState]);

  const handleDateChange = (startDate: Date) => {
    const week = getWeekNumber(startDate);
    setFilters({ ...filters, week });
  };

  const onHandleGeneratePayment = () => {
    if (filters.collaborator) {
      generatePaymentForUser({
        collaborator: filters.collaborator,
        week: filters.week,
      });
    } else {
      generatePaymentForAll({ week: filters.week });
    }
  };

  const contextValue = {
    handleDateChange,
    payments,
    exportPayments,
    getBadge,
    handleChangesFilters,
    currentWeek,
    users,
    getStatus,
    onHandleGeneratePayment,
    onHandlePreviousPagination,
    onHandleNextPagination,
    getWeekDates,

    title: "Payment",
  };

  return (
    <PaymentContext.Provider
      value={{
        ...contextValue,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within an PaymentProvider");
  }
  return context;
};
