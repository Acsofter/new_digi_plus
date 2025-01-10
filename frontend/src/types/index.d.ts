interface State {
  ws: WsState;
  company: Company;
  popup: Popup;
  auth: AuthState;
}

interface WsState {
  readyState: number;
  lastMessage: any;
}

interface Company {
  id: number;
  name: string;
  email: string;
  logo?: string;
  address: string;
  phone: string;
  collaborator_percentage: string;
  company_percentage: string;
  created_at: string;
}

interface UpdateCompany {
  name: string;
  logo: string;
  darkMode: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
  color: string;
  transparent: boolean;
  collaborator_percentage: string;
}



interface User {
  id: number | null;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  password?: string;
  is_superuser: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  username: string;
  roles: string[];
  token?: string;
  color?: string;
}

interface Ticket {
  id: number;
  payment: Payment;
  category: Category;
  collaborator: User;
  description: string;
  created_at: string;
  week_paid: string;
  updated_at: string;
  company: number;
}

interface RequestTicket extends Ticket {
  id?: number | null;
  category: number | null;
  payment: number | null;
  collaborator?: User | null;
  company?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ResponseTickets {
  count: number;
  current: number | null;
  next: string | null;
  previous: string | null;
  results: Ticket[];
}

interface ResponsePayments {
  count: number;
  pages: number;
  current: number | null;
  next: string | null;
  previous: string | null;
  results: Payment[];
}

interface ResponseCategories {
  count: number;
  pages: number;
  current: number | null;
  next: string | null;
  previous: string | null;
  results: Category[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Payment {
  id: number;
  status: string;
  type: string;
  amount: number;
  week: number | null;
  ticket: Ticket;
  created_at: string;
  updated_at: string;
  collaborator: number;
}

interface UpdateTicket {
  id: number;
  category?: number;
  description?: string;
  payment?: {
    status?: string;
    amount?: number;
  };
}

type RequestPayment = {
  amount: number;
  status?: string;
};

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

interface CreateTicket {
  payment: {
    amount?: number;
    type?: string;
  };
  category: number | null;
  description: string;
}
interface RequestTicket extends Ticket {
  id?: number;
}

interface AuthenticationUserResponse {
  user: User;
  token: string;
}

interface LoginForm {
  username: string;
  password: string;
}

type UserData = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
  tension: number;
};

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}
interface AuthenticationUserResponse {
  user: {
    token: string;
    first_name: string;
    last_name: string;
    color?: string | null;
  };
}



type TicketMetrics = {
  tickets: {
    approved: number;
    total: number;
  };
  gross: {
    approved: number;
    total: number;
  };
  net: {
    approved: number;
    total: number;
  };
  cancelled: {
    approved: number;
    total: number;
  };
  pending: {
    approved: number;
    total: number;
  };
};

type MetricsInterface = {
  today: TicketMetrics;
  week: TicketMetrics;
  month: TicketMetrics;
  year: TicketMetrics;
};


interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  current: number | null;
  results: T[];
}


interface Card {
  name: string;
  total: number;
  approved: number;
  pending?: number;
  cancelled?: number;
  color: string;
  icon: JSX.Element;
}
