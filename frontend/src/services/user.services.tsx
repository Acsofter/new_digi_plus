import axios from "axios";
import { AuthHeader } from "./auth.header";
import { useWebsocket } from "../contexts/WebsocketContext";

const apiRequest = async <T, Data = unknown>(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  data?: Data
): Promise<T | false> => {
  try {
    const response = await axios({
      method,
      url: `${import.meta.env.VITE_BASE_URL}${endpoint}`,
      data,
      headers: AuthHeader(),
    });
    return response.status === 200 || response.status === 201
      ? response.data
      : false;
  } catch (error) {
    console.error("API request error:", error);
    return false;
  }
};

export const useUserServices = () => {
  const { sendMessage } = useWebsocket();

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const firstDayOfWeek = new Date(firstDayOfYear);
    firstDayOfWeek.setDate(
      firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1
    );

    if (isNaN(firstDayOfWeek.getTime())) {
      throw new Error("Could not calculate week number");
    }

    const weekNumber =
      Math.floor(
        (date.getTime() - firstDayOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)
      ) + 1;
    return weekNumber;
  };

  const getUsers = async ({
    includeAdmins = false,
  }: {
    includeAdmins?: boolean;
  }): Promise<User[] | false> => {
    return await apiRequest<User[]>("get", `/users/`, {
      params: { includeAdmins },
    });
  };

  const getUser = async ({ id }: { id: number }): Promise<User | false> => {
    return await apiRequest<User>("get", `/users/${id}/`);
  };

  const getCompanies = async (): Promise<Company[] | false> => {
    return await apiRequest<Company[]>("get", `/companies/`);
  };

  const getCompany = async ({
    id,
  }: {
    id: number;
  }): Promise<Company | false> => {
    return await apiRequest<Company>("get", `/companies/${id}/`);
  };

  const getTickets = async ({
    status,
  }: {
    status: "1" | "2" | "3";
  }): Promise<PaginatedResponse<Ticket> | false> => {
    return await apiRequest<PaginatedResponse<Ticket>>("get", `/tickets/`, {
      params: { status },
    });
  };

  const getTicket = async ({ id }: { id: number }): Promise<Ticket | false> => {
    return await apiRequest<Ticket>("get", `/tickets/${id}/`);
  };

  const getCategories = async (): Promise<ResponseCategories | false> => {
    return await apiRequest<ResponseCategories>("get", `/categories/`);
  };

  const updateCategory = async ({
    id,
    data,
  }: {
    id: number;
    data: Category;
  }): Promise<Category | false> => {
    const response = await apiRequest<Category>(
      "put",
      `/categories/${id}/`,
      data
    );
    if (response) {
      sendMessage({
        type: "category_updated",
        message: "Categoría actualizada",
      });
    }
    return response;
  };

  const getCompanyDetails = async (): Promise<Company | false> => {
    return await apiRequest<Company>("get", `/company/`);
  };

  const createCategory = async (data: Category) => {
    const response = await apiRequest<Category>("post", `/categories/`, data);
    if (response) {
      sendMessage({
        type: "category_added",
        message: "Categoría creada",
        payload: { user: response },
      });
    }
    return response;
  };

  const updateCompany = async (details: UpdateCompany | Company) => {
    const response = await apiRequest<Company>("put", `/company/`, details);
    if (response) {
      sendMessage({
        type: "company_updated",
        message: "Compañía actualizada",
        payload: { user: response },
      });
    }
    return response;
  };

  const updateTicketStatus = async (id: number, status: number) => {
    const response = await apiRequest<Ticket>("put", `/tickets/${id}/`, {
      params: { payment: { status } },
    });
    if (response) {
      sendMessage({
        type: "ticket_updated",
        message: "Ticket actualizado",
        payload: { collaborator: response.data.collaborator },
      });
    }
    return response;
  };

  const createTicket = async (details: CreateTicket) => {
    const response = await apiRequest<Ticket>("post", `/tickets/`, details);
    if (response) {
      sendMessage({
        type: "ticket_added",
        message: "Ticket creado",
        payload: { ticket: response },
      });
    }
    return response;
  };

  const getMetrics = async () => {
    return await apiRequest<any>("get", `/metrics/`);
  };

  const getMetricsById = async (id: number) => {
    return await apiRequest<any>("get", `/metrics/${id}/`);
  };

  const getRandomColor = () => {
    // Genera valores RGB aleatorios
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convierte los valores RGB a hexadecimal y asegúrate de que tengan dos dígitos
    const toHex = (value: number) => value.toString(16).padStart(2, "0");

    // Retorna el color en formato hexadecimal
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const getGraph = async ({
    graphname,
    allusers = false,
  }: {
    graphname: string;
    allusers?: boolean;
  }): Promise<UserData[] | false> => {
    return await apiRequest<any>("get", `/metrics/${graphname}/`, {
      params: { allusers },
    });
  };

  const getPayments = async ({
    filters,
  }: {
    filters: {
      collaborator: number | null;
      week: number;
    };
  }) => {
    return await apiRequest<any>("get", `/payments/`, { params: filters });
  };

  const getPaymentsById = async (id: number) => {
    return await apiRequest<any>("get", `/payments/${id}/`);
  };

  const getPercentages = async () => {
    return await apiRequest<any>("get", `/metrics/percentages/`);
  };

  const getTicketsPercentages = async () => {
    return await apiRequest<any>("get", `/metrics/tickets/`);
  };

  const getReport = async ({ user }: { user?: number | null }) => {
    return await apiRequest<any>("get", `/report/`, { params: { user } });
  };

  const generatePaymentForUser = async ({
    collaborator,
    week,
  }: {
    collaborator: number;
    week: number;
  }) => {
    return await apiRequest<any>("post", `/payments/generate_payment/`, {
      collaborator,
      week,
    });
  };

  const generatePaymentForAll = async ({ week }: { week: number }) => {
    return await apiRequest<any>(
      "post",
      `/payments/generate_payment_for_all/`,
      { week }
    );
  };

  const getWeek = async ({ week }: { week: number }) => {
    return await apiRequest<any>("get", `/week/${week}/`);
  };

  const updateUser = async ({ userDetails }: { userDetails: User }) => {
    const response = await apiRequest<User>(
      "put",
      `/users/${userDetails.id}/`,
      userDetails
    );
    if (response) {
      if (!response.is_active) {
        sendMessage({
          type: "user_disabled",
          message: "Desconectado del sistema",
          payload: { user: response },
        });
      } else {
        sendMessage({
          type: "user_updated",
          message: "Usuario actualizado",
          payload: { user: response },
        });
      }
    }
    return response;
  };

  const handlePagination = async (
    url: string 
  ): Promise<PaginatedResponse<Ticket> | false>  => {
    const response = await apiRequest<PaginatedResponse<Ticket>>("get", url);
    if (response) {
      return response;
    }
    return false;
  };

  return {
    getCompanyDetails,
    getReport,
    getUsers,
    getWeekNumber,
    getWeek,
    updateUser,
    handlePagination,
    updateCompany,
    updateTicketStatus,
    updateCategory,
    createTicket,
    createCategory,
    getMetrics,
    getMetricsById,
    getGraph,
    getPayments,
    getPaymentsById,
    getRandomColor,
    getCompanies,
    getUser,
    getCategories,
    // getCategoryById,
    getTickets,
    getTicket,
    getCompany,
    getPercentages,
    getTicketsPercentages,
    generatePaymentForUser,
    generatePaymentForAll,
  };
};
