import React, { useState, useRef } from 'react';
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
  uploadLocalSong, // Local MP3 upload handler
  totalStorageSize, // Total size of user-uploaded files in bytes
  deleteUserSong, // Function to permanently delete a song
  playTrack, // Function to play a specific track
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isSongAddMode, setIsSongAddMode] = useState(false);
  const fileInputRef = useRef(null);

  const activePlaylist = userPlaylists.find(p => p.id === activePlaylistId);

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsAdding(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      await uploadLocalSong(file);
      e.target.value = null; // Reset input
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
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="audio/mpeg,audio/wav,audio/mp3"
          onChange={handleFileChange}
        />
        <h4 className="font-semibold mb-2 flex justify-between items-center">
          Your Playlists
          <div className="flex gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-2 py-1 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition-all flex items-center gap-1"
              title="Import MP3"
            >
              <span className="text-sm">♫</span> Import
            </button>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="text-xl leading-none bg-gray-100 hover:bg-gray-200 w-6 h-6 rounded flex items-center justify-center transition-all active:scale-95 border border-gray-300"
              title="New Playlist"
            >
              {isAdding ? '−' : '+'}
            </button>
          </div>
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
                {(activePlaylist.isSystem ? allSongs : allSongs.filter(song => activePlaylist.songIds.includes(song.id))).map((song, index) => (
                  <li 
                    key={song.id} 
                    onClick={() => playTrack(index)}
                    className={`flex items-center justify-between py-1 px-2 text-sm cursor-pointer hover:bg-black/5 transition-colors ${currentTrack && currentTrack.id === song.id ? 'bg-yellow-100 font-bold' : ''}`}
                  >
                    <span className="truncate flex-grow">{song.title} - {song.artist}</span>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {/* 라이브러리에서 영구 삭제 (가져온 곡만 가능) */}
                      {typeof song.id === 'string' && song.id.startsWith('local_') && (
                        <button
                          onClick={() => {
                            if (window.confirm("이 곡을 라이브러리에서 완전히 삭제할까요?")) {
                              deleteUserSong(song.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete from Library"
                        >
                          🗑️
                        </button>
                      )}
                      {!activePlaylist.isSystem && (
                        <button
                          onClick={() => toggleSongInPlaylist(activePlaylist.id, song.id)}
                          className="ml-1 px-2 py-0.5 rounded text-xs bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
                          title="Remove from playlist"
                        >
                          ✕
                        </button>
                      )}
                    </div>
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

      <p className="text-[10px] text-gray-400 mt-2 text-center italic shrink-0">
        Import 된 곡은 브라우저에 저장됩니다. ({ (totalStorageSize / (1024 * 1024)).toFixed(1) }MB / 100MB)
      </p>
    </Modal>
  );
};

export default PlaylistFloatingWindow;