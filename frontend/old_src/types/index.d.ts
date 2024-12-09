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

interface Popup {
  isOpen: boolean;
  loading: boolean;
  title?: string;
  subtitle?: string;
  content?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  token: string;
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
  amount: string;
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

interface CreateTicket {
  payment: {
    amount?: number;
    number?: string;
  };
  category: number;
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
