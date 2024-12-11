import { useState } from "react";
const getWeekDates = (date: Date): [Date, Date] => {
  const start = new Date(date);
  start.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return [start, end];
};

const useDatePicker = (onChange: (startDate: Date, endDate: Date) => void) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date]>(
    getWeekDates(currentDate)
  );
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
    onChange(start, end);
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
