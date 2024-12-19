import { TrendingUp } from "lucide-react";
import { useAuthentication } from "../../contexts/AuthContext";
import AnimatedCounter from "../../Home/components/AnimatedCounter";
import { useDashboard } from "../contexts/DashboardContext";

const MetricCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mb-4">
      ${value.toLocaleString("es-ES", { style: "currency", currency: "DOP" })}
    </p>
  </div>
);

export const DashboardMetrics = () => {
  const { company } = useAuthentication();
  const { totalTickets, averageTicketsPerDay, mostProductiveUser } =
    useDashboard();

  const netTotal =
    totalTickets * ((company?.collaborator_percentage || 0) * 0.01);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-xl shadow-lg p-4 text-white  hover:brightness-90">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-indigo-100 text-lg">
            Usuario
          </p>
          <TrendingUp size={24} className="text-indigo-100" />
        </div>
        <div className="flex gap-3 w-full content-center items-center justify-items-center">
          <div className="w-full text-center">
            <p className="text-sm font-medium text-gray-100">Total: </p>
            <p className="text-xl font-bold text-gray-100">
              $<AnimatedCounter to={mostProductiveUser.total} />
            </p>
          </div>
          <div className="w-full text-center">
            <p className="text-sm font-medium text-gray-100">Promedio/día</p>
            <p className="text-xl font-bold text-gray-100">
              $<AnimatedCounter to={Math.ceil(averageTicketsPerDay)} />
            </p>
          </div>
          <div className="w-full text-center">
            <p className="text-sm font-medium text-gray-100">Usuario 👤</p>
            <p className="text-xl font-bold text-gray-100">
              {mostProductiveUser.name || "---"}
            </p>
          </div>
        </div>
      </div>
      <MetricCard title="Total Bruto 💵" value={totalTickets} />
      <MetricCard title="Total Neto 💸" value={netTotal} />
    </div>
  );
};
