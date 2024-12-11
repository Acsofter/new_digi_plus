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
import { DashboardMetrics } from "../Dashboard/components/DashboardMetrics";
import { LineChart } from "../Dashboard/components/LineChart";
import { DashboardProvider } from "../Dashboard/contexts/DashboardContext";
import { DoughnutCard } from "../Dashboard/components/DoughnutCard";
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

export function Dashboard() {
  return (
    <div className="no-scrollbar overflow-scroll w-full h-screen flex flex-col gap-3">
      <DashboardProvider>
        <DashboardMetrics />
        <LineChart />
        <DoughnutCard />
      </DashboardProvider>
    </div>
  );
}
