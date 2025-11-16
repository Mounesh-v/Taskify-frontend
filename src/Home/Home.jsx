import React from "react";
import Task from "../Component/Task";
import Navbar from "../Component/Navbar";
import Dashboard from "../Component/Dashboard ";
import Calendar from "../Component/Calender";
import Profile from "../User/Profile";
import Signup from "../User/Signup";
import Login from "../User/Login";
import { Routes, Route } from "react-router-dom";
import AddTask from "../Component/AddTask";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Component/Footer";

const Home = () => {
  return (
    <>
      <ToastContainer autoClose={3000} pauseOnHover={false} closeOnClick />

      <Navbar />
      <Routes>
        <Route path="/" element={<Task />} />
        <Route path="/add" element={<AddTask />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="h-screen flex items-center justify-center">
              <h1 className="font-dispaly text-center text-5xl flex text-indigo-600">
                Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
      <Footer/>
    </>
  );
};

export default Home;
