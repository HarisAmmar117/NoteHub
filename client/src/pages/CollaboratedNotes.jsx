import React, { useEffect, useState } from "react";
import CollaboratorNoteCard from "../components/CollaboratorNoteCard";
import SearchBar from "../components/SearchBar";

const CollaboratedNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  // Fetch collaborated notes
  const fetchCollaboratedNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/notes/collaborated", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) setNotes(data);
      else setNotes([]);
    } catch (error) {
      console.error("Error fetching collaborated notes:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaboratedNotes();
  }, []);

  // Filter notes by search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Loading collaborated notes...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Notes shared with you</h2>

      {/* Search */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "No notes match your search."
              : "No collaborated notes yet."}
          </p>
          {!searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Notes shared with you will appear here
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <CollaboratorNoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaboratedNotes;