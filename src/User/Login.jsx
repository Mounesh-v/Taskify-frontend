import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { showIndigoToast } from "../Component/IndigoToast";
const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API}/api/user/login`,
        form
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          token: res.data.token,
        })
      );
      // alert("Login Successful!");
      showIndigoToast("Login Successful!", "success");
      navigate("/dashboard");
      //  window.location.reload();
      if (res.data.token) {
        setTimeout(() => {
          window.location.reload();
        }, 500); // delay so toast is visible
      }
    } catch (err) {
      console.log(err);
      showIndigoToast("Invalid Credentials", "error");
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen font-dispaly flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white  w-full max-w-md p-6 rounded-xl shadow-md shadow-indigo-600 border border-gray-100">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
          Login
        </h2>

        {error && <p className="text-center text-red-500 mb-3">{error}</p>}

        <div className="space-y-4">
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
            onClick={handleLogin}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </div>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
