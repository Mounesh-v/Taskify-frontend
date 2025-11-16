import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showIndigoToast } from "../Component/IndigoToast.jsx";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user once
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));

    // 🔥 Listen for "storage" updates (logout anywhere)
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // SignOut Function
  const handleSignOut = () => {
    localStorage.removeItem("user");

    // 🔥 Notify the entire app (Profile & Navbar)
    window.dispatchEvent(new Event("storage"));

    setUser(null);
    setProfileOpen(false);
    navigate("/login");

    setTimeout(() => {
      showIndigoToast("Logout Successfully", "success");
    }, 300);
  };

  return (
    <header className="w-full font-dispaly bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              {/* <img
                src="/taskify.png" 
                alt="Taskly Logo"
                className="h-12 w-20 object-cover" 
              /> */}

              <span className="text-blue-700 font-semibold text-2xl">
                Taskify
              </span>
            </Link>

            {/* Links */}
            <div className="hidden  md:flex md:ml-8 md:space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 text-[18px] text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/"
                className="px-3 py-2 text-[18px] text-gray-700 hover:bg-gray-100"
              >
                Tasks
              </Link>
              <Link
                to="/calendar"
                className="px-3 py-2 text-[18px] text-gray-700 hover:bg-gray-100"
              >
                Calendar
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Add Task Btn */}
            {user && (
              <Link
                to="/add"
                className="hidden sm:inline-flex px-3 py-2 bg-indigo-600 text-white rounded-md text-[18px] hover:bg-indigo-700"
              >
                New Task
              </Link>
            )}

            {/* If not logged in */}
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
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-md py-1 z-30">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-[18px] text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>

                    <div className="border-t my-1" />

                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-[18px] text-red-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden -mr-2">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {mobileOpen ? "✖" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              \
              <Link
                to="/dashboard"
                className="block px-3 py-2 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link to="/" className="block px-3 py-2 hover:bg-gray-50">
                Tasks
              </Link>
              <Link to="/calendar" className="block px-3 py-2 hover:bg-gray-50">
                Calendar
              </Link>
              {user && (
                <Link to="/add" className="block px-3 py-2 hover:bg-gray-50">
                  Add Task
                </Link>
              )}
              {!user ? (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-indigo-600 font-medium"
                >
                  Login
                </Link>
              ) : (
                <>
                  <div className="border-t mt-2" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
