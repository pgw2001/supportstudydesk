import React, { useState } from 'react';
import Modal from '../../common/modal';

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
  const [isSongAddMode, setIsSongAddMode] = useState(false);

  const activePlaylist = userPlaylists.find(p => p.id === activePlaylistId);

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsAdding(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Music Playlists"
      width="320px"
      height="450px"
      className="font-mono select-none"
    >
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
              onClick={() => {
                selectPlaylist(playlist.id);
                setIsSongAddMode(false); // 다른 플레이리스트 선택 시 곡 추가 모드 해제
              }}
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
      <div className="flex-grow overflow-y-auto border-t border-gray-200 pt-4 flex flex-col">
        <h4 className="font-semibold mb-2 flex justify-between items-center">
          <span className="truncate">
            {activePlaylist ? activePlaylist.name : 'Select a Playlist'} ({activePlaylist ? activePlaylist.songIds.length : 0} songs)
          </span>
          {activePlaylist && !activePlaylist.isSystem && (
            <button 
              onClick={() => setIsSongAddMode(!isSongAddMode)}
              className={`text-lg leading-none w-6 h-6 rounded flex items-center justify-center transition-all active:scale-95 ${isSongAddMode ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              title={isSongAddMode ? "View Playlist" : "Add Songs"}
            >
              {isSongAddMode ? '✕' : '+'}
            </button>
          )}
        </h4>
        {activePlaylist && (
          <ul className="flex-grow">
            {isSongAddMode ? (
              // 곡 추가 모드: 전체 곡 목록을 보여주고 추가/제거 버튼 제공
          allSongs.filter(song => !activePlaylist.songIds.includes(song.id)).length > 0 ? (
            allSongs.filter(song => !activePlaylist.songIds.includes(song.id)).map(song => (
              <li key={song.id} className={`flex items-center justify-between py-1 px-2 text-sm ${currentTrack && currentTrack.id === song.id ? 'bg-yellow-100 font-bold' : ''}`}>
                <span className="truncate">{song.title} - {song.artist}</span>
                <button
                  onClick={() => toggleSongInPlaylist(activePlaylist.id, song.id)}
                  className="ml-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-green-500 text-white hover:bg-green-600 transition-colors active:scale-90"
                >
                  +
                </button>
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-500 py-4 text-center">All available songs are added!</li>
          )
            ) : (
              // 일반 모드: 현재 플레이리스트에 포함된 곡만 표시
              <>
                {(activePlaylist.isSystem ? allSongs : allSongs.filter(song => activePlaylist.songIds.includes(song.id))).map(song => (
                  <li key={song.id} className={`flex items-center justify-between py-1 px-2 text-sm ${currentTrack && currentTrack.id === song.id ? 'bg-yellow-100 font-bold' : ''}`}>
                    <span className="truncate">{song.title} - {song.artist}</span>
                    {!activePlaylist.isSystem && (
                      <button
                        onClick={() => toggleSongInPlaylist(activePlaylist.id, song.id)}
                        className="ml-2 px-2 py-0.5 rounded text-xs bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
                        title="Remove from playlist"
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
                {!activePlaylist.isSystem && activePlaylist.songIds.length === 0 && (
                  <li className="text-xs text-gray-500 py-4 text-center">No songs yet. Click + to add some!</li>
                )}
              </>
            )}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default PlaylistFloatingWindow;