import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserServices } from "../../services/user.services";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const DashboardContext = createContext<any | null>(null);

interface LineChartData {
  labels: string[];
  datasets: any[];
}

interface BarChartData {
  labels: string[];
  datasets: any[];
}

interface DoughnutChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

interface MostProductiveUser {
  total: number;
  name: string;
}

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [lineChartData, setLineChartData] = useState<LineChartData>({
    labels: [],
    datasets: [],
  });
  const [barChartData, setBarChartData] = useState<BarChartData>({
    labels: [],
    datasets: [],
  });
  const [doughnutChartData, setDoughnutChartData] = useState<DoughnutChartData>(
    { labels: [], datasets: [] }
  );
  const [mostProductiveUser, setMostProductiveUser] =
    useState<MostProductiveUser>({ total: 0, name: "" });
  const [averageTicketsPerDay, setAverageTicketsPerDay] = useState<number>(0);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const { getGraph } = useUserServices();

  const getWeekDates = (date: Date): [Date, Date] => {
    const start = new Date(date);
    start.setDate(
      date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)
    );
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
  };

  const [selectedWeek, setSelectedWeek] = useState<[Date, Date]>(
    getWeekDates(new Date())
  );

  const fetchData = async () => {
    const metrics = await getGraph({ graphname: "line", start: selectedWeek[0].toISOString().split("T")[0], end: selectedWeek[1].toISOString().split("T")[0] });
    if (metrics) {
      const totalTickets = metrics.reduce(
        (total, user) => total + user.data.reduce((a, b) => a + b, 0),
        0
      );
      const averageTicketsPerDay =
        metrics.length > 0
          ? totalTickets / (metrics[0].data.length * metrics.length)
          : 0;

      const mostProductiveUser = metrics.reduce(
        (max, user) => {
          const userTotal = user.data.reduce((a, b) => a + b, 0);
          return userTotal > max.total
            ? { name: user.label, total: userTotal }
            : max;
        },
        { name: "", total: 0 }
      );

      setLineChartData({ labels, datasets: metrics });
      setBarChartData({
        labels,
        datasets: metrics.map((user) => ({
          ...user,
          backgroundColor: user.backgroundColor
            .replace(")", ", 0.6)")
            .replace("hsl", "hsla"),
        })),
      });
      setDoughnutChartData({
        labels: metrics.map((user) => user.label),
        datasets: [
          {
            data: metrics.map((user) => user.data.reduce((a, b) => a + b, 0)),
            backgroundColor: metrics.map((user) => user.backgroundColor),
            borderColor: metrics.map((user) => user.borderColor + "20"),
          },
        ],
      });
      setMostProductiveUser(mostProductiveUser);
      setAverageTicketsPerDay(averageTicketsPerDay);
      setTotalTickets(totalTickets);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedWeek]);

  const contextValue = {
    title: "Dashboard",
    lineChartData,
    barChartData,
    doughnutChartData,
    mostProductiveUser,
    averageTicketsPerDay,
    totalTickets,
    setSelectedWeek,
    selectedWeek,
    getWeekDates,
  };

  return (
    <DashboardContext.Provider
      value={{
        ...contextValue,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within an DashboardProvider");
  }
  return context;
};
