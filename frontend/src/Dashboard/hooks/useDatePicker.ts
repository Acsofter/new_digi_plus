import { useState } from "react";
import { useUserServices } from "../../services/user.services";
import { useDashboard } from "../contexts/DashboardContext";

const useDatePicker = () => {
  const { setSelectedWeek, selectedWeek, getWeekDates } = useDashboard();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  };

  return {
    currentDate,
    selectedWeek,
    isDropdownOpen,
    setIsDropdownOpen,
    handlePrevMonth,
    handleNextMonth,
    handleSelectWeek,
  };
};
export default useDatePicker;
