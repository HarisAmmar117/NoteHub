import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';

const AddNote = ({ refreshNotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState({
    title: '',
    content: '',
    color: '#2d2d2d',
    collaborators: [], // Array of user IDs
  });
  const [collabInput, setCollabInput] = useState(''); // Comma-separated emails
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("token");

  const colors = ['#2d2d2d', '#1e3a5f', '#3b2e1e', '#2d1e3b', '#1e3b2e'];

  // Helper: get user ID by email
  const getUserIdByEmail = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/email?email=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null; // user not found
      const data = await res.json();
      return data._id;
    } catch (err) {
      console.error("Error fetching user by email:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.title.trim() && !note.content.replace(/<[^>]*>/g, '').trim()) return;

    setIsSaving(true);

    try {
      const emails = collabInput
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      // Fetch all user IDs in parallel
      const ids = await Promise.all(emails.map(email => getUserIdByEmail(email)));
      const collaboratorIds = ids.filter(id => id !== null);

      // Alert if some emails were invalid
      emails.forEach((email, i) => {
        if (!ids[i]) alert(`User not found: ${email}`);
      });

      const payload = { ...note, collaborators: collaboratorIds };

      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add note");
      }

      // Reset form
      setNote({ title: '', content: '', color: '#2d2d2d', collaborators: [] });
      setCollabInput('');
      setIsExpanded(false);

      // Refresh notes
      if (refreshNotes) refreshNotes();

    } catch (error) {
      console.error("Error adding note:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <div 
        className={`bg-[#2d2d2d] rounded-lg border border-gray-800 overflow-hidden transition-all ${isExpanded ? 'shadow-xl' : 'hover:border-gray-700'}`}
        style={{ backgroundColor: note.color }}
      >
        {!isExpanded ? (
          <div 
            onClick={() => setIsExpanded(true)}
            className="p-4 cursor-text text-gray-400"
          >
            Take a note...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-4">
              <input
                type="text"
                placeholder="Title"
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
                className="w-full bg-transparent border-none outline-none text-lg font-medium mb-2 placeholder-gray-500 text-white"
                autoFocus
              />

              <RichTextEditor
                value={note.content}
                onChange={(content) => setNote({ ...note, content })}
                placeholder="Take a note..."
              />

              <input
                type="text"
                placeholder="Collaborators (comma-separated emails)"
                value={collabInput}
                onChange={(e) => setCollabInput(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-gray-300 mt-2 placeholder-gray-500"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNote({ ...note, color })}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${note.color === color ? 'border-yellow-500 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-sm bg-yellow-500 text-[#1e1e1e] rounded-lg hover:bg-yellow-400 transition-colors font-medium disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Add Note'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddNote;