import React, { useEffect, useState } from "react";
import Signup from "./Signup.jsx";
import { showIndigoToast } from "../Component/IndigoToast.jsx";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);

  useEffect(() => {
    setuser(JSON.parse(localStorage.getItem("user")));
  }, []);

  if (!user) {
    return (
      <div className="p-6 w-full min-h-screen">
        <Signup />
      </div>
    );
  }

  const handleSignOut = () => {
    localStorage.removeItem("user");

    // 🔥 Notify all components (Navbar)
    window.dispatchEvent(new Event("storage"));

    setuser(null);
    navigate("/login");

    setTimeout(() => {
      showIndigoToast("Logout Successfully", "success");
    }, 300);
  };

  return (
    <div className="p-6 w-full font-dispaly min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=120`}
            alt="avatar"
            className="w-28 h-28 rounded-full shadow-md"
          />

          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Signout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
