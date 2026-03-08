import React, { useState, createContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import MyNotes from "./pages/MyNotes";
import CollaboratedNotes from "./pages/CollaboratedNotes";
import SearchBar from "./components/SearchBar";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const NoteContext = createContext();

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("my-notes");

  // Track auth in state
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myNotes = filteredNotes.filter((note) => !note.collaborators?.length);
  const collaboratedNotes = filteredNotes.filter(
    (note) => note.collaborators?.length
  );

  // If not authenticated, show only login/register
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
        searchQuery,
        setSearchQuery,
        myNotes,
        collaboratedNotes,
      }}
    >
      <div className="flex h-screen bg-[#1e1e1e] text-gray-200">
        {/* Pass setIsAuthenticated to Sidebar */}
        <Sidebar view={view} setView={setView} setIsAuthenticated={setIsAuthenticated} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">

            <Routes>
              <Route path="/" element={<Navigate to="/my-notes" />} />
              <Route path="/my-notes" element={<MyNotes />} />
              <Route path="/collaborated" element={<CollaboratedNotes />} />
              <Route path="*" element={<Navigate to="/my-notes" />} />
            </Routes>
          </div>
        </main>
      </div>
    </NoteContext.Provider>
  );
}

export default App;