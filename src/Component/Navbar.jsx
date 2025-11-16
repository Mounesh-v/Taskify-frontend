import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showIndigoToast } from "../Component/IndigoToast.jsx";

export default function Navbar() {
  const [sideOpen, setSideOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));

    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    setUser(null);
    setProfileOpen(false);
    navigate("/login");

    setTimeout(() => showIndigoToast("Logout Successfully", "success"), 300);
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full font-dispaly bg-white shadow-sm fixed top-0 left-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

          {/* Left - LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-blue-700 font-semibold text-2xl">
              Taskify
            </span>
          </Link>

          {/* Center - Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-[18px] text-gray-700 hover:text-indigo-600">
              Dashboard
            </Link>
            <Link to="/" className="text-[18px] text-gray-700 hover:text-indigo-600">
              Tasks
            </Link>
            <Link to="/calendar" className="text-[18px] text-gray-700 hover:text-indigo-600">
              Calendar
            </Link>

            {user && (
              <Link
                to="/add"
                className="px-3 py-2 bg-indigo-600 text-white rounded-md text-[18px] hover:bg-indigo-700"
              >
                New Task
              </Link>
            )}
          </div>

          {/* Right - Desktop User */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Link
                to="/signup"
                className="px-3 py-2 bg-indigo-600 text-white rounded-md text-[18px] hover:bg-indigo-700"
              >
                Signup
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full p-1 focus:ring-2 focus:ring-indigo-300"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-[18px] text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <div className="border-t" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-[18px] text-red-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - MOBILE Hamburger */}
          <button
            className="md:hidden p-3 text-2xl"
            onClick={() => setSideOpen(true)}
          >
            ☰
          </button>
        </nav>
      </header>

      {/* MOBILE SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform 
          ${sideOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300`}
      >
        <div className="p-5 flex justify-between items-center border-b">
          <span className="text-xl font-bold text-indigo-700">Menu</span>
          <button className="text-2xl" onClick={() => setSideOpen(false)}>
            ✖
          </button>
        </div>

        <div className="p-4 space-y-3">
          <Link to="/dashboard" onClick={() => setSideOpen(false)} className="block text-lg hover:text-indigo-600">
            Dashboard
          </Link>
          <Link to="/" onClick={() => setSideOpen(false)} className="block text-lg hover:text-indigo-600">
            Tasks
          </Link>
          <Link to="/calendar" onClick={() => setSideOpen(false)} className="block text-lg hover:text-indigo-600">
            Calendar
          </Link>

          {user && (
            <Link to="/add" onClick={() => setSideOpen(false)} className="block text-lg hover:text-indigo-600">
              Add Task
            </Link>
          )}

          <div className="border-t pt-3" />

          {!user ? (
            <Link to="/login" onClick={() => setSideOpen(false)} className="block text-lg text-indigo-600">
              Login
            </Link>
          ) : (
            <button
              className="block text-left text-lg text-red-600"
              onClick={() => {
                handleSignOut();
                setSideOpen(false);
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Dark overlay when menu is open */}
      {sideOpen && (
        <div
          onClick={() => setSideOpen(false)}
        />
      )}
    </>
  );
}
