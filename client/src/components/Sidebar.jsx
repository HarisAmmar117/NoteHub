import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NoteContext } from "../App"; // import context to update auth

const Sidebar = ({ view, setView, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update App state
    setIsAuthenticated(false);

    // Navigate to login page
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#2d2d2d] border-r border-gray-800 flex flex-col">

      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-yellow-500">NOTEHUB</h1>
        <p className="text-xs text-gray-500 mt-1">
          Collaborative Note Taking
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <Link
          to="/my-notes"
          onClick={() => setView("my-notes")}
          className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
            view === "my-notes"
              ? "bg-yellow-500/10 text-yellow-500"
              : "hover:bg-[#3d3d3d] text-gray-400"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 
                 01-2-2V5a2 2 0 012-2h5.586a1 1 0 
                 01.707.293l5.414 5.414a1 1 0 
                 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>My Notes</span>
        </Link>

        <Link
          to="/collaborated"
          onClick={() => setView("collaborated")}
          className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
            view === "collaborated"
              ? "bg-yellow-500/10 text-yellow-500"
              : "hover:bg-[#3d3d3d] text-gray-400"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 
                 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 
                 6 0 00-9-5.197"/>
          </svg>
          <span>Collaborated</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;