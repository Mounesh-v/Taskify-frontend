import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { showIndigoToast } from "../Component/IndigoToast.jsx";


const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://taskify-ubrv.onrender.com/api/user/signup",
        form
      );

      // alert("Signup Successful!");
      showIndigoToast("Signup Successful!", "success");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data?.name,
          email: res.data?.email,
          token: res.data?.token,
        })
      );

      navigate("/login");
    } catch (err) {
      console.log(err);
      showIndigoToast("Signup failed!","error")
      setError(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="min-h-screen font-dispaly flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-md shadow-indigo-600 border border-gray-100">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
          Signup
        </h2>

        {error && <p className="text-center text-red-500 mb-3">{error}</p>}

        <div className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-white focus:ring-indigo-300"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-white focus:ring-indigo-300"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-white focus:ring-indigo-300"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </div>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
