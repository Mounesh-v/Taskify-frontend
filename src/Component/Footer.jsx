import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" text-gray-300 font-dispaly py- mt-0">
      <div className="max-w-7xl bg-gray-900 mx-auto px-6">
        {/* Bottom */}
        <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Taskly — All rights reserved.
          <p className="text-sm text-gray-400">
              Stay productive. Stay organized.  
              Manage tasks easily with Taskly.
            </p>
        </div>
      </div>
    </footer>
  );
}
