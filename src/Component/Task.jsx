import React, { useEffect, useState } from "react";
import { showIndigoToast } from "../Component/IndigoToast";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // If user is not logged in
  if (!token) {
    return (
      <div className="p-6 w-full min-h-screen text-center text-xl text-gray-700">
        Please login to view your tasks.
      </div>
    );
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch("https://taskify-1-5hk3.onrender.com/api/task/my-tasks", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log(data);

      if (data.task.length === 0) {
        showIndigoToast("No tasks found", "info");
      }
      if (res.ok && Array.isArray(data.task)) {
        setTasks(data.task);
      } else {
        setTasks([]);
      }
    } catch (err) {
      showIndigoToast("Failed to load tasks!", "error");
      console.log("Error loading tasks:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async (taskId) => {
    try {
      const res = await fetch(
        `https://taskify-1-5hk3.onrender.com/api/task/complete/${taskId}`,
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

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, isComplete: true } : t))
        );

        showIndigoToast("Task Completed!", "success");
      }
    } catch (err) {
      showIndigoToast("Error completing task", "error");
      console.log("Error completing task:", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(
        `https://taskify-1-5hk3.onrender.com/api/task/delete/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        showIndigoToast("Task Deleted!", "success");
      } else {
        showIndigoToast(data.msg || "Cannot delete task", "error");
      }
    } catch (err) {
      showIndigoToast("Error deleting task", "error");
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-dispaly">
      <h1 className="text-2xl font-bold mb-6 text-indigo-600 font-display">
        My Tasks
      </h1>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-gray-600 text-center">No tasks found</p>
        )}

        {tasks.map((task) => (
          <div
            key={task._id}
            className="p-5 border rounded-xl shadow-sm bg-white shadow-xl border-solid font-display hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <h1
                className={`text-xl font-semibold flex-1 ${
                  task.isComplete
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h1>

              <button
                onClick={() =>
                  setExpandedTask(expandedTask === task._id ? null : task._id)
                }
                className="text-indigo-600 font-medium hover:underline underline-offset-2"
              >
                {expandedTask === task._id ? "Hide" : "Details"}
              </button>
            </div>

            {/* Details Section */}
            {expandedTask === task._id && (
              <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100 space-y-3 animate-fadeIn">
                <p className="text-gray-800">
                  <span className="font-semibold text-indigo-600">
                    Description:
                  </span>{" "}
                  {task.description}
                </p>

                <p className="text-gray-800">
                  <span className="font-semibold text-indigo-600">
                    Due Date:
                  </span>{" "}
                  {task.dueDate?.slice(0, 10)}
                </p>

                <p className="text-gray-800">
                  <span className="font-semibold text-indigo-600">
                    Complete Date:
                  </span>{" "}
                  {task.completedAt
                    ? new Date(task.completedAt).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Not completed"}
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  {!task.isComplete && (
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      onClick={() => handleComplete(task._id)}
                    >
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
