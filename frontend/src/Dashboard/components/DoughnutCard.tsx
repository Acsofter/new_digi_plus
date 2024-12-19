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
import { useDashboard } from "../contexts/DashboardContext";

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

export const DoughnutCard = () => {
  const { totalTickets, users } = useDashboard();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Distribución de Usuarios 🎉
        </h2>
        {/* <div className="flex-grow">
          {Object.keys(doughnutChartData).length > 0 && (
            <Doughnut
              data={doughnutChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                borderColor: barChartborderColor,
                plugins: {
                  legend: {
                    position: "bottom" as const,
                    labels: {
                      font: {
                        size: 12,
                        weight: "bold",
                      },
                      color: "rgb(75, 85, 99)",
                    },
                  },
                  title: {
                    display: true,
                    text: "Porcentaje por Usuario",
                    font: {
                      size: 16,
                      weight: "bold",
                    },
                    color: "rgb(75, 85, 99)",
                  },
                },
              }}
            />
          )}
        </div> */}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Métricas
        </h2>
        <div className="space-y-6"></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Porcentajes por Usuario
        </h2>
        <div className="space-y-4">
          {users &&
            users.map((user: any) => {
              const userTotal = user.reduce((a: number, b: number) => a + b, 0);
              const percentage = (userTotal / totalTickets) * 100;
              return (
                <div key={user.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className="font-medium"
                      style={{ color: user.borderColor }}
                    >
                      {user.label}
                    </span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: user.backgroundColor,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
