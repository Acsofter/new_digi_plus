import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MoreHorizontal, Users } from "lucide-react";
import AnimatedCounter from "../components/AnimatedCounter";
import { General } from "../layouts/General";
import { Loading } from "../components/Loading";
import { useUserServices } from "../services/user.services";
import { Contexts } from "../services/Contexts";

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

type DashboardProps = {
  data: UserData[];
};

export function Dashboard() {
  const { state } = React.useContext(Contexts);
  const darkMode = localStorage.getItem("darkMode") === "true";
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [data, setData] = useState({
    lineChartData: {} as any,
    barChartData: {} as any,
    doughnutChartData: {} as any,
    mostProductiveUser: { total: 0, name: "" },
    averageTicketsPerDay: 0,
    totalTickets: 0,
  });
  const { get_graph } = useUserServices();
  const [users, setUsers] = useState<UserData[]>([]);

  const DashboardCard = ({ title, value, change, isPositive }: { title: string; value: number; change: number; isPositive: boolean; }) => (
    <div className="bg-white p-4 rounded-lg shadow dark:bg-slate-900/70 dark:border-slate-900 border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-white">{title}</h3>
        <MoreHorizontal className="w-5 h-5 text-gray-400 dark:text-white" />
      </div>
      <p className="text-2xl font-bold dark:text-white">$ <AnimatedCounter to={value} /></p>
      <p className={`text-sm ${isPositive ? "text-blue-500 dark:text-blue-300" : "text-red-50 dark:text-red-300"}`}>
        {isPositive ? "↑ +" : "↓ -"}<AnimatedCounter to={change} />% de la semana anterior
      </p>
    </div>
  );

  const fetchData = async () => {
    const metrics = await get_graph({ graphname: "line" });
    if (metrics) {
      setUsers(metrics);
      const totalTickets = metrics.reduce((total, user) => total + user.data.reduce((a, b) => a + b, 0), 0);
      const averageTicketsPerDay = metrics.length > 0 ? totalTickets / (metrics[0].data.length * metrics.length) : 0;

      const mostProductiveUser = metrics.reduce((max, user) => {
        const userTotal = user.data.reduce((a, b) => a + b, 0);
        return userTotal > max.total ? { name: user.label, total: userTotal } : max;
      }, { name: "", total: 0 });

      setData({
        lineChartData: { labels, datasets: metrics },
        barChartData: {
          labels,
          datasets: metrics.map(user => ({
            ...user,
            backgroundColor: user.backgroundColor.replace(")", ", 0.6)").replace("hsl", "hsla"),
          })),
        },
        doughnutChartData: {
          labels: metrics.map(user => user.label),
          datasets: [{
            data: metrics.map(user => user.data.reduce((a, b) => a + b, 0)),
            backgroundColor: metrics.map(user => user.backgroundColor),
            borderColor: metrics.map(user => user.borderColor + "20"),
          }],
        },
        mostProductiveUser,
        averageTicketsPerDay,
        totalTickets,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const msg = state.ws.lastMessage;
    if (["ticket_added", "ticket_deleted", "ticket_updated", "user_added", "user_deleted", "user_updated"].includes(msg?.type)) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ws.lastMessage]);

  return (
    <>
      {users.length > 0 ? (
        <div className="px-4 py-4 no-scrollbar overflow-scroll h-screen flex flex-col gap-3">
          <h1 className="text-xl font-bold dark:text-white">Dashboard</h1>
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-blue-600/80 p-4 rounded-lg text-white">
              <p className="font-medium mb-2">Actualizacion</p>
              <h3 className="text-xl font-bold mb-2">Esta semana ha aumentado un 40% el rendimiento en los tickets</h3>
              <p className="text-sm">Estadisticas →</p>
            </div>
            <DashboardCard title="Total Bruto" value={data.totalTickets} change={33} isPositive={true} />
            <DashboardCard title="Total Neto" value={data.totalTickets * (parseInt(state.company.collaborator_percentage) * 0.01)} change={24} isPositive={false} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-white/10 px-6 py-2 rounded-lg shadow-md flex flex-col items-center dark:text-white dark:border-white/10 dark:border">
              <h2 className="text-md font-semibold">Actividad semanal</h2>
              <div className="h-72 w-full">
                {Object.keys(data.lineChartData).length ? (
                  <Line
                    data={data.lineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          ticks: {
                            color: darkMode ? "white" : "",
                          },
                        },
                        x: {
                          ticks: {
                            color: darkMode ? "white" : "",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top" as const,
                          labels: {
                            color: darkMode ? "white" : "",
                            font: {
                              size: 14,
                            },
                          },
                        },
                        title: {
                          display: true,
                          text: "Usuario por monto semanal",
                          color:
                            darkMode && localStorage.getItem("transparent")
                              ? "white"
                              : "",
                        },
                      },
                    }}
                  />
                ) : (
                  <span className="text-gray-500 text-sm animate-pulse">
                    Cargando...
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-white/10 dark:text-white px-3 py-2 rounded-lg shadow-md flex flex-col items-center">
              <h2 className="text-md font-semibold ">Actividad diaria</h2>
              <div className="h-72 w-full">
                {Object.keys(data.barChartData).length ? (
                  <Bar
                    data={data.barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          ticks: {
                            color: darkMode ? "white" : "",
                          },
                        },
                        x: {
                          ticks: {
                            color: darkMode ? "white" : "",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top" as const,
                          labels: {
                            color: darkMode ? "white" : "",
                          },
                        },
                        title: {
                          display: true,
                          text: "Usuarios por monto diario ",
                          color: darkMode ? "white" : "",
                        },
                      },
                    }}
                  />
                ) : (
                  <span className="text-gray-500 text-sm animate-pulse">
                    Cargando...
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            <div className="bg-white dark:bg-white/10 p-3 rounded-lg shadow-md flex flex-col items-center w-full">
              <h2 className="dark:text-white text-xl font-semibold mb-4 ">
                Distribucion de usuarios
              </h2>
              <div className="h-full w-full max-w-lg">
                {Object.keys(data.doughnutChartData).length > 0 && (
                  <Doughnut
                    data={data.doughnutChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      borderColor: data.barChartData.borderColor,

                      plugins: {
                        legend: {
                          position: "bottom" as const,
                          labels: {
                            color: darkMode ? "white" : "",
                            font: {
                              size: 14,
                              weight: "bold",
                              
                            }
                          },
                        },
                        title: {
                          display: true,
                          text: "Porcentaje  por usuario",
                          color: darkMode ? "white" : "",

                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-white/10 dark:text-white p-3 rounded-lg shadow-md w-full">
              <h2 className="text-xl font-semibold mb-4">Metricas</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 dark:text-slate-400">Total:</p>
                  <p className="text-2xl font-bold">
                    {data.totalTickets.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-slate-400">Promedio por dia:</p>
                  <p className="text-2xl font-bold">
                    {data.averageTicketsPerDay.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-slate-400">Usuario mas productivo:</p>
                  <p className="text-2xl font-bold">
                    {data.mostProductiveUser.name}
                  </p>
                  <p className="text-lg">${data.mostProductiveUser.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-white/10 dark:text-white p-3 rounded-lg shadow-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                Porcentages por usuario
              </h2>
              <div className="space-y-4">
                {users.map((user) => {
                  const userTotal = user.data.reduce((a, b) => a + b, 0);
                  const percentage = (userTotal / data.totalTickets) * 100;
                  return (
                    <div key={user.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span style={{ color: user.borderColor }}>{user.label}</span>
                        <span className="font-semibold">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
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
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
