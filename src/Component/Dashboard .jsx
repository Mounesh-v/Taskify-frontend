import React, { useState, useEffect } from "react";
import ProductivityChart from "./ProductivityChart";
import { showIndigoToast } from "../Component/IndigoToast";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [dashboardTasks, setDashboardTasks] = useState([]);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const fetchTasks = async () => {
    try {
      const res = await fetch("https://taskify-ubrv.onrender.com/api/task/my-tasks", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("Dashboard Details", data);

      if (res.ok && Array.isArray(data.task)) {
        setTasks(data.task);

        // Toast only first time when tasks load
        // showIndigoToast("Dashboard Updated", "success");

        if (data.task.length === 0) {
          showIndigoToast("No tasks found", "info");
        }
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.log("Error loading tasks:", err);
      showIndigoToast("Failed to load tasks!", "error");
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async (taskId) => {
    try {
      const res = await fetch(
        `https://taskify-ubrv.onrender.com/api/task/complete/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Complete Response:", data);
      setDashboardTasks(data);

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, isComplete: true } : t))
        );

        showIndigoToast("Task Completed!", "success");
      }
    } catch (err) {
      console.log("Error completing task:", err);
      showIndigoToast("Error completing task", "error");
    }
  };

  // Helpers
  const now = new Date();

  const completedCount = tasks.filter((t) => t.isComplete).length;
  const pendingCount = tasks.filter((t) => !t.isComplete).length;

  const overdueCount = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const taskDate = new Date(t.dueDate);
    return taskDate < now && !t.isComplete;
  }).length;

  const upcomingTasks = tasks
    .filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      return taskDate > now && !t.isComplete;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const upcomingPreview = upcomingTasks.slice(0, 3);

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 font-dispaly w-full min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-indigo-600 mb-6">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow-sm rounded-xl p-5 flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            {tasks.length}
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-gray-800 font-semibold text-lg">{tasks.length}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-5 flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-lg">
            {completedCount}
          </div>
          <div>
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-gray-800 font-semibold text-lg">{completedCount}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-5 flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold text-lg">
            {overdueCount}
          </div>
          <div>
            <p className="text-gray-500 text-sm">Overdue</p>
            <p className="text-gray-800 font-semibold text-lg">{overdueCount}</p>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">
            Upcoming Tasks
          </h2>

          <div className="space-y-4">
            {upcomingTasks.length === 0 && (
              <p className="text-gray-500">No upcoming tasks</p>
            )}

            {(showAllUpcoming ? upcomingTasks : upcomingTasks.slice(0, 2)).map(
              (t) => (
                <div
                  key={t._id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-700">{t.title}</h3>
                    <p className="text-sm text-gray-500">
                      Deadline: {formatDate(t.dueDate)}
                    </p>
                  </div>
                </div>
              )
            )}

            {upcomingTasks.length > 2 && (
              <button
                onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                className="text-indigo-600 text-sm font-medium mt-2 hover:underline"
              >
                {showAllUpcoming
                  ? "Show Less"
                  : `Show ${upcomingTasks.length - 2} More Upcoming`}
              </button>
            )}
          </div>
        </div>

        {/* Productivity Chart */}
        <div className="lg:col-span-2">
          <ProductivityChart tasks={tasks} dashboardTasks={dashboardTasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
