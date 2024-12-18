import { motion } from "framer-motion";
import { Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import React from "react";
import useDatePicker from "../hooks/useDatePicker";
import { format } from "path";

interface DatePickerProps {
  onChange: (startDate: Date, endDate: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = () => {
  const {
    currentDate,
    selectedWeek,
    handlePrevMonth,
    handleNextMonth,
    handleSelectWeek,
  } = useDatePicker();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("es-EN", {
      year: "numeric",
      day: "numeric",
      month: "long",
    });
  };

  const renderCalendar = () => {
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startDate = new Date(monthStart);
    startDate.setDate(
      startDate.getDate() -
        (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1)
    );
    const endDate = new Date(monthEnd);
    endDate.setDate(
      endDate.getDate() + (endDate.getDay() === 0 ? 0 : 7 - endDate.getDay())
    );

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isSelected =
          selectedWeek &&
          cloneDay >= selectedWeek[0] &&
          cloneDay <= selectedWeek[1];
        days.push(
          <td
            key={day.toISOString()}
            className={`p-2 text-center cursor-pointer group-hover:bg-indigo-100 hover:text-white  font-bold duration-100 ${
              isSelected ? "bg-indigo-50 text-indigo-500" : "text-slate-900"
            } ${
              day.getMonth() !== currentDate.getMonth()
                ? "text-gray-400 font-normal"
                : ""
            }`}
            onClick={() => handleSelectWeek(cloneDay)}
          >
            {day.getDate()}
          </td>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <tr key={day.toISOString()} className="group">
          {days}
        </tr>
      );
      days = [];
    }

    return rows;
  };

  return (
    <div className="relative ">
      <motion.div className="p-5 text-lg font-semibold text-slate-700 bg-white rounded-2xl shadow-md h-full">
        <p className="font-bold">Semana Actual 📅</p>
        {selectedWeek &&
          formatDate(selectedWeek[0]) + " al " + formatDate(selectedWeek[1])}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full bg-white text-slate-700 backdrop-blur-md shadow-md rounded-3xl overflow-hidden pb-2 absolute my-2 z-10 border border-slate-100 `}
      >
        <div className="flex justify-between items-center py-2 px-5 font-semibold">
          <div className="space-x-3">
            <button onClick={handlePrevMonth} className="text-sm" title="Mes Anterior">
              <ChevronLeft className="size-3" /> 
            </button>
            <button onClick={handleNextMonth} className="text-sm" title="Mes Siguiente">
              <ChevronRight className="size-3" /> 
            </button>
            <span>
              {currentDate.toLocaleDateString("es-ES", {
                month: "long",
              })} 🌼
            </span>
          </div>
          <div className="text-gray-400 font-normal">
            {currentDate.toLocaleDateString("es-EN", {
              year: "numeric",
            })} 📆
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-slate-600 uppercase">
              {["Lun", "Mar", "Mie", "Juv", "Vie", "Sab", "Dom"].map((day) => (
                <th key={day} className="p-2 font-normal text-sm">
                  {day} 🌞
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendar()}</tbody>
        </table>
      </motion.div>
    </div>
  );
};
