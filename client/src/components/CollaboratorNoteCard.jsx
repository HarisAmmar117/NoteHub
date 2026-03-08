import React from "react";

const CollaboratorNoteCard = ({ note }) => {
  // Enhanced date formatting with time
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

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Header with title */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex-1 break-words pr-4">
            {note.title || (
              <span className="text-gray-500 italic">Untitled Note</span>
            )}
          </h3>
          
          {/* Collaborator badge - shows this is a shared note */}
          <div className="px-2 py-1 bg-yellow-500/10 rounded-full">
            <span className="text-xs text-yellow-500">Shared</span>
          </div>
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

        {/* Collaborator count - with nicer styling */}
        {note.collaborators?.length > 0 && (
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex -space-x-2">
              {/* Show first 3 collaborators as avatars with initials */}
              {note.collaborators.slice(0, 3).map((collaborator, idx) => {
                // Get initial from email or name
                const initial = collaborator.charAt(0).toUpperCase();
                return (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 border-2 border-[#2d2d2d] flex items-center justify-center"
                    title={collaborator}
                  >
                    <span className="text-[10px] font-bold text-[#1e1e1e]">
                      {initial}
                    </span>
                  </div>
                );
              })}
            </div>
            {note.collaborators.length > 3 && (
              <span className="text-xs text-gray-500">
                +{note.collaborators.length - 3} more
              </span>
            )}
            <span className="text-xs text-gray-500">
              {note.collaborators.length} collaborator
              {note.collaborators.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* If no collaborators but it's a shared note (shouldn't happen, but just in case) */}
        {(!note.collaborators || note.collaborators.length === 0) && (
          <div className="flex items-center space-x-1 mb-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs text-gray-500">Shared with you</span>
          </div>
        )}

        {/* Footer with date - matching the main card style */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDate(note.createdAt)}</span>
          </div>

          {/* Owner indicator - shows who owns the note */}
          {note.owner && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>by {note.owner?.name || 'Owner'}</span>
            </div>
          )}
        </div>

        {/* Subtle indicator that this is a shared note (appears on hover) */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1 text-[10px] text-yellow-500/50">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Shared</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorNoteCard;