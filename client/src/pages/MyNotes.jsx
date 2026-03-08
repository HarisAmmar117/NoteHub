import React, { useEffect, useContext, useState } from "react";
import AddNote from "../components/AddNote";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";
import { NoteContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyNotes = () => {
  const { notes, setNotes } = useContext(NoteContext);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Logout helper
  const handleLogout = () => {
    alert("Session expired. Please log in again.");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    navigate("/login");
  };

  // Fetch all notes of logged-in user via Bearer token
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!Array.isArray(res.data)) {
        setNotes([]);
        return;
      }
      setNotes(res.data); // all notes for the logged-in user
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleLogout();
      else setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleLogout();
      else alert("Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes based on search query (title or content)
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-400">Loading notes...</div>
    );
  }

  return (
    <div className="p-4">
      {/* Add Note */}
      <AddNote refreshNotes={fetchNotes} />

      {/* Search */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Notes */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={deleteNote}
              onUpdate={fetchNotes}
              isOwner={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "No notes match your search."
              : "No notes yet. Create your first note above!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyNotes;