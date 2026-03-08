import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor";

const NoteCard = ({ note, onUpdate, onDelete, isOwner = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Save changes
  const handleSave = async () => {
    if (!isOwner) return;
    setIsLoading(true);
    try {
      await fetch(`http://localhost:5000/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedNote),
      });
      onUpdate();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update note");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete note with confirmation
  const handleDelete = async () => {
    if (!isOwner) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await onDelete(note._id);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : "Failed to delete note"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset time part for accurate day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = today - noteDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    if (diffDays === 0) return `Today at ${timeString}`;
    if (diffDays === 1) return `Yesterday at ${timeString}`;
    if (diffDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[date.getDay()]} at ${timeString}`;
    }
    if (diffDays < 365) {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${timeString}`;
    }
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${timeString}`;
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-[#2d2d2d] to-[#252525] rounded-xl border border-gray-800/50 overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-300 hover:-translate-y-1"
      style={{ 
        backgroundColor: note.color,
        background: note.color !== '#2d2d2d' ? note.color : 'linear-gradient(135deg, #2d2d2d 0%, #252525 100%)'
      }}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      {/* Color indicator strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500/50 to-transparent"></div>

      {isEditing && isOwner ? (
        // EDIT MODE - Beautiful editor
        <div className="p-5 relative z-10">
          <div className="mb-4 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <span className="text-xs text-gray-500 ml-2">Editing note</span>
          </div>
          
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
            placeholder="Note title"
            className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors mb-3"
            autoFocus
          />
          
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <RichTextEditor
              value={editedNote.content}
              onChange={(content) => setEditedNote({ ...editedNote, content })}
              placeholder="Write your note here..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-[#1e1e1e] rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all font-medium shadow-lg shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      ) : (
        // VIEW MODE - Beautiful card
        <div className="p-5 relative z-10">
          {/* Header with actions */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex-1 break-words pr-4">
              {note.title || (
                <span className="text-gray-500 italic">Untitled Note</span>
              )}
            </h3>
            
            {/* Menu button for owners */}
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-36 bg-[#2d2d2d] border border-gray-700 rounded-lg shadow-xl z-50 py-1">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Note content with nice typography */}
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 mb-4">
            {note.content ? (
              <div
                className="note-content leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: note.content.length > 200 
                    ? note.content.substring(0, 200) + '...' 
                    : note.content 
                }}
              />
            ) : (
              <p className="text-gray-600 italic">No content</p>
            )}
          </div>

          {/* Collaborator count only - simplified */}
          {note.collaborators?.length > 0 && (
            <div className="flex items-center space-x-1 mb-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs text-gray-500">
                {note.collaborators.length} collaborator{note.collaborators.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Footer with date */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDate(note.createdAt)}</span>
            </div>

            {/* Quick action buttons for owners (visible on hover) */}
            {isOwner && (
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  title="Edit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-yellow-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;