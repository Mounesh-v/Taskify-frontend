import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showIndigoToast } from "../Component/IndigoToast";

const AddTask = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Pre-filled date from Calendar
  const prefilledDate = location.state?.dueDate || "";

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: prefilledDate,
    completedAt: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      showIndigoToast("Please login to add tasks!", "error");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/task/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        showIndigoToast("Task Created Successfully!", "success");

        // Clear form
        setForm({
          title: "",
          description: "",
          dueDate: "",
          completedAt: "",
        });

        // Redirect back to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        showIndigoToast(data.msg || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("Error:", err);
      showIndigoToast("Error creating task", "error");
    }
  };

  return (
    <div className="w-full font-dispaly max-w-lg mx-auto bg-white p-6 shadow-md rounded-xl mt-6">
      <h1 className="text-xl font-semibold text-indigo-600 mb-4">
        Create a New Task
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full border p-3 rounded-lg resize-none"
        ></textarea>

        {/* Due Date */}
        <label className="text-gray-600 text-sm mb-1 block">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* Completion Date (optional) */}
        <label className="text-gray-600 text-sm mb-1 block">
          Completion Date (Optional)
        </label>
        <input
          type="datetime-local"
          name="completedAt"
          value={form.completedAt}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
