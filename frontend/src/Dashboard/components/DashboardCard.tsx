import { MoreHorizontal } from "lucide-react";
import AnimatedCounter from "../../Home/components/AnimatedCounter";

export const DashboardCard = ({
    title,
    value,
    change,
    isPositive,
  }: {
    title: string;
    value: number;
    change: number;
    isPositive: boolean;
  }) => (
    <div className="bg-white p-4 rounded-lg shadow dark:bg-slate-900/70 dark:border-slate-900 border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-white">
          {title} 🎉
        </h3>
        <MoreHorizontal className="w-5 h-5 text-gray-400 dark:text-white" />
      </div>
      <p className="text-2xl font-bold dark:text-white">
        $ <AnimatedCounter to={value} /> 💰
      </p>
      <p
        className={`text-sm ${
          isPositive
            ? "text-blue-500 dark:text-blue-300"
            : "text-red-50 dark:text-red-300"
        }`}
      >
        {isPositive ? "↑ + 😊" : "↓ - 😢"}
        <AnimatedCounter to={change} />% de la semana anterior
      </p>
    </div>
  );