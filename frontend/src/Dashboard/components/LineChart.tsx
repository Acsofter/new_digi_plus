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
import { Line } from "react-chartjs-2";
import { useDashboard } from "../contexts/DashboardContext";
import { DatePicker } from "./DatePicker";

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

export const LineChart = () => {
  const { lineChartData } = useDashboard();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(55, 65, 81)',
          font: {
            size: 12,
            weight: 'bold',
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: 'rgb(55, 65, 81)',
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📊 Actividad Semanal</h2>
        </div>
        <div className="p-6">
          <div className="h-80 w-full">
            {Object.keys(lineChartData).length ? (
              <Line
                data={lineChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "👤 Usuario por Monto Semanal",
                    },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500 text-sm animate-pulse">
                  ⏳ Cargando...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="">
        <DatePicker />
      </div>
    </div>
  );
};

