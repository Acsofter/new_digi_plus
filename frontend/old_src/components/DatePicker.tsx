import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";

interface DatePickerProps {
  onChange: (startDate: Date, endDate: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ onChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date] | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getWeekDates = (date: Date): [Date, Date] => {
    const start = new Date(date);
    start.setDate(
      date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)
    );
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US");
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleSelectWeek = (date: Date) => {
    const [start, end] = getWeekDates(date);
    setSelectedWeek([start, end]);
    onChange(start, end);
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
            className={`p-2 text-center cursor-pointer group-hover:bg-slate-900/50 hover:text-white text-slate-300 duration-100 ${
              isSelected ? "bg-slate-900/60 text-white" : ""
            } ${
              day.getMonth() !== currentDate.getMonth() ? "text-gray-400" : ""
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
      <button
        className="bg-slate-800 text-white border border-slate-700 px-3 py-2 h-full rounded-lg text-sm min-w-28"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Calendar className="inline-block text-white" size={19} />{" "}
        {selectedWeek ? formatDate(selectedWeek[0]) + " - " + formatDate(selectedWeek[1]) : "Semana"}
      </button>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-64 bg-white/20 backdrop-blur-md shadow-md rounded-xl overflow-hidden pb-2 absolute my-2 z-10 border border-white/20 ${
          isDropdownOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-between items-center bg-slate-800 text-white p-2">
          <button onClick={handlePrevMonth}>&lt;</button>
          <span>
            {currentDate.toLocaleDateString("es-ES", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-white/10  text-slate-500 dark:text-white">
              {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((day) => (
                <th key={day} className="p-2">
                  {day}
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
