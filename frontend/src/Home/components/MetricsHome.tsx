"use client";

import { cloneElement, useEffect, useState } from "react";
import { ArrowUpRight, ClockIcon as ClockArrowDown, DollarSign, Percent, Ticket, TicketX } from 'lucide-react';
import { useHome } from "../contexts/HomeContext";
import AnimatedCounter from "./AnimatedCounter";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const MetricsHome = () => {
  const { metrics, cards } = useHome();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <DailyTicketsCard metrics={metrics} />
      {cards.map((card: Card, index: number) => (
        <MetricCard key={index} {...card} />
      ))}
    </div>
  );
};

const DailyTicketsCard = ({ metrics }: { metrics: MetricsInterface }) => {
  const items = [
    {
      icon: DollarSign,
      label: "💰 Bruto",
      value: metrics.today.gross.approved,
      format: true,
    },
    { icon: Percent, label: "📊 Porc.", value: metrics.today.net.approved },
    { icon: Ticket, label: " 🎟️ Tickets", value: metrics.today.tickets.approved },
    {
      icon: ClockArrowDown,
      label: "⏳ Pend.",
      value: metrics.today.pending.total,
    },
    { icon: TicketX, label: "❌ Cancel. ", value: metrics.today.cancelled.total },
  ];

  return (
    <div className="bg-gradient-to-t from-slate-50 text-slate-600 to-white rounded-xl shadow-lg  shadow-slate-200 p-6 space-y-4">
      <h2 className="text-xl font-bold">Tickets del día 📅</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs md:text-sm"
          >
            <div className="flex items-center space-x-2 text-indigo-500">
              {/* <item.icon className="hidden md:inline" /> */}
              <span className="text-gray-600">{item.label}</span>
            </div>
            <span className="font-bold">
              {item.format
                ? `$${new Intl.NumberFormat().format(item.value)}`
                : item.value}
            </span>
          </div>
        ))}
      </div>
     <span
       className="w-full justify-end m-0 hidden md:flex text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-colors duration-200 text-right"
     >
       <Link
        to={"/dashboard"}
      >
         Ver Estadísticas 
        <ArrowUpRight size={16} className="ml-1 inline" />
      </Link>
     </span>
       
    </div>
  );
};

const MetricCard = ({ name, icon: Icon, approved, total, color }: Card) => {
  const percentage = Math.round((approved / total) * 100);

  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {cloneElement(Icon, {
            className: `${Icon.props.className} inline text-center w-full size-7`,
          })}
          <h3 className="text-lg font-bold">{name} 📈</h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">
            {<AnimatedCounter to={approved} />} 
          </p>
          <p className="text-sm opacity-75">
            de {<AnimatedCounter to={total} />} 🎯
          </p>
        </div>
      </div>
      <div className="relative pt-1">
        <div
          className={`overflow-hidden h-2 text-xs flex rounded bg-white bg-opacity-15 ${
            color.split(" ", 1)[0]
          }`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage || 0}%` }}
            transition={{ duration: 1.5 }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-slate-600 ${
              color.split(" ", 1)[0]
            }`}
          ></motion.div>
        </div>
      </div>
      <p className="text-right text-sm mt-1">{percentage || 0}% completado 🚀</p>
    </div>
  );
};

export default MetricsHome;