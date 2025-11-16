import React, { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { showIndigoToast } from "../Component/IndigoToast";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const navigate = useNavigate();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const startOfMonth = currentDate.startOf("month");
  const daysInMonth = currentDate.daysInMonth();
  const startDay = startOfMonth.day();
  const today = dayjs().startOf("day");

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const generateDates = () => {
    let dates = [];
    for (let i = 0; i < startDay; i++) dates.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      dates.push(dayjs(currentDate).date(d));
    }
    return dates;
  };

  const dates = generateDates();

  const handleDateClick = (date) => {
    if (!date) return;

    const clicked = date.startOf("day");
    const formatted = clicked.format("YYYY-MM-DD");

    if (clicked.isBefore(today, "day")) {
      setSelectedDate(formatted);
      setIsInvalid(true);
      showIndigoToast("You cannot pick a past date!", "error");
      return;
    }

    setSelectedDate(formatted);
    setIsInvalid(false);
    showIndigoToast(`Selected date: ${formatted}`, "success");
  };

  const handleAddTask = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      showIndigoToast("Please login to continue", "error");
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      showIndigoToast("Please select a date!", "error");
      return;
    }

    if (isInvalid) {
      showIndigoToast("Cannot add a task to a past date!", "error");
      return;
    }

    showIndigoToast(`Adding task for: ${selectedDate}`, "success");

    navigate("/add", { state: { dueDate: selectedDate } });
  };

  return (
    <div className="w-full font-dispaly min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            ◀
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {currentDate.format("MMMM YYYY")}
          </h2>
          <button
            onClick={nextMonth}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            ▶
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
          {days.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {dates.map((date, index) => {
            const isToday =
              date &&
              date.isSame(dayjs(), "date") &&
              date.isSame(dayjs(), "month");

            const isPast =
              date && date.startOf("day").isBefore(today, "day");

            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`h-12 flex items-center justify-center rounded-[80%] w-9 sm:rounded-xl text-sm cursor-pointer
                  ${
                    isToday
                      ? "bg-indigo-600 text-white"
                      : date
                      ? `bg-gray-50 hover:bg-gray-200 ${
                          isPast ? "opacity-60" : ""
                        }`
                      : ""
                  }`}
              >
                {date ? date.date() : ""}
              </div>
            );
          })}
        </div>

        {/* Selected Date Box */}
        {selectedDate && (
          <div className="mt-6">
            {isInvalid ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-700 font-medium mb-2">
                  ⚠️ Invalid date — you selected a past date:{" "}
                  <span className="font-semibold">{selectedDate}</span>
                </p>
                <p className="text-sm text-red-600">
                  Please choose today or a future date to add a task.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between">
                <p className="text-blue-700 font-medium">
                  You selected:{" "}
                  <span className="font-semibold">{selectedDate}</span>
                </p>
                <button
                  onClick={handleAddTask}
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-[12px] h-[50px]"
                >
                  Add Task for this Date
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
