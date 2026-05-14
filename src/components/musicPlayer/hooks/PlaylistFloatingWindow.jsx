import React, { useState } from 'react';

const PlaylistFloatingWindow = ({
  isOpen,
  onClose,
  userPlaylists,
  activePlaylistId,
  selectPlaylist,
  createPlaylist,
  deletePlaylist,
  toggleSongInPlaylist,
  allSongs, // The full list of all available songs
  currentTrack, // To highlight the currently playing song
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  if (!isOpen) return null;

  const activePlaylist = userPlaylists.find(p => p.id === activePlaylistId);

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsAdding(false);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-white border-2 border-black rounded-lg shadow-lg z-50 p-4 flex flex-col font-mono">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Playlists</h3>
        <button onClick={onClose} className="text-xl font-bold hover:text-red-500">✕</button>
      </div>

      {/* Playlist Management */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2 flex justify-between items-center">
          Your Playlists
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-xl leading-none bg-gray-100 hover:bg-gray-200 w-6 h-6 rounded flex items-center justify-center transition-all active:scale-95"
            title="Toggle Add Playlist"
          >
            {isAdding ? '−' : '+'}
          </button>
        </h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {userPlaylists.map(playlist => (
            <button
              key={playlist.id}
              onClick={() => selectPlaylist(playlist.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                activePlaylistId === playlist.id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {playlist.name}
              {!playlist.isSystem && (
                <span
                  className="ml-2 text-xs hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting playlist when deleting
                    deletePlaylist(playlist.id);
                  }}
                >
                  ✕
                </span>
              )}
            </button>
          ))}
        </div>
        {isAdding && (
          <div className="flex gap-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <input
              type="text"
              placeholder="New name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
              className="flex-grow p-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              ADD
            </button>
          </div>
        )}
      </div>

      {/* Songs in Active Playlist */}
      <div className="flex-grow overflow-y-auto border-t border-gray-200 pt-4">
        <h4 className="font-semibold mb-2">
          {activePlaylist ? activePlaylist.name : 'Select a Playlist'} ({activePlaylist ? activePlaylist.songIds.length : 0} songs)
        </h4>
        {activePlaylist && (
          <ul>
            {allSongs.map(song => (
              <li key={song.id} className={`flex items-center justify-between py-1 px-2 text-sm ${currentTrack && currentTrack.id === song.id ? 'bg-yellow-100 font-bold' : ''}`}>
                <span>{song.title} - {song.artist}</span>
                {!activePlaylist.isSystem && (
                  <button
                    onClick={() => toggleSongInPlaylist(activePlaylist.id, song.id)}
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activePlaylist.songIds.includes(song.id) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}
                  >
                    {activePlaylist.songIds.includes(song.id) ? 'Remove' : 'Add'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlaylistFloatingWindow;