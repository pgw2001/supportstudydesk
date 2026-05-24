import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { DEFAULT_VOLUME, VIEWBOX } from "../constants";
import { SONG_PLAYLIST } from "./songs";
import { getAllSongsFromDB, saveSongToDB, deleteSongFromDB, calculateTotalSize } from "../../../utils/musicDB";
export { SONG_PLAYLIST };

export const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [controlBarMode, setControlBarMode] = useState('title'); // 'title' or 'progress'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 플레이리스트 관련 상태
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [userSongs, setUserSongs] = useState([]); // IndexedDB에서 불러온 곡들
  const [userPlaylists, setUserPlaylists] = useState(() => {
    const saved = localStorage.getItem("boombox_playlists");
    return saved ? JSON.parse(saved) : [{ id: 'all', name: 'All Tracks', songIds: [], isSystem: true }];
  });
  const [activePlaylistId, setActivePlaylistId] = useState('all');

  // 시스템 곡과 사용자 곡 통합
  const allAvailableSongs = useMemo(() => {
    return [...SONG_PLAYLIST, ...userSongs];
  }, [userSongs]);

  // 사용자 업로드 곡의 총 용량 계산 (MB 단위)
  const totalStorageSize = useMemo(() => {
    return userSongs.reduce((total, song) => total + (song.file?.size || 0), 0);
  }, [userSongs]);

  // 현재 선택된 플레이리스트의 곡 목록 필터링
  const playlist = useMemo(() => {
    const currentList = userPlaylists.find(p => p.id === activePlaylistId) || userPlaylists[0];
    // 시스템 플레이리스트(All Tracks)인 경우 모든 곡을 반환
    if (currentList.isSystem) return allAvailableSongs;
    return allAvailableSongs.filter(song => currentList.songIds.includes(song.id));
  }, [userPlaylists, activePlaylistId, allAvailableSongs]);

  const currentTrack = useMemo(() => playlist[currentTrackIndex] || playlist[0] || allAvailableSongs[0], 
    [playlist, currentTrackIndex, allAvailableSongs]);

  const audio = new Audio();
  audio.crossOrigin = "anonymous";

  const audioRef = useRef(audio);

  // 초기 로드: IndexedDB에서 곡 불러오기
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const songs = await getAllSongsFromDB();
        const songsWithUrls = songs.map(song => ({
          ...song,
          src: URL.createObjectURL(song.file) // Blob을 URL로 변환
        }));
        setUserSongs(songsWithUrls);
      } catch (e) {
        console.error("Failed to load songs from IndexedDB", e);
      }
    };
    loadSongs();

    // 클린업: 생성된 모든 ObjectURL 해제
    return () => {
      userSongs.forEach(song => {
        if (song.src.startsWith('blob:')) URL.revokeObjectURL(song.src);
      });
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.preload = "metadata";
    audio.volume = volume;
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // 로컬 스토리지 저장
  useEffect(() => {
    localStorage.setItem("boombox_playlists", JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (isShuffling && playlist.length > 1) {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * playlist.length);
        }
        return next;
      }
      return (prev + 1) % playlist.length;
    });
    console.log("Next track playing...");
  }, [isShuffling, playlist.length]);

  const prevTrack = useCallback(() => {
    if (currentTime > 3) {
      // 3초가 넘었을 때 누르면 현재 곡을 처음부터 다시 시작
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    setCurrentTrackIndex((prev) => {
      if (isShuffling && playlist.length > 1) {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * playlist.length);
        }
        return next;
      }
      return (prev - 1 + playlist.length) % playlist.length;
    });
    console.log("Previous track playing...");
  }, [isShuffling, playlist.length, currentTime]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeating, nextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack?.src) return;
    
    audio.src = currentTrack.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentTrack.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const deleteUserSong = useCallback(async (id) => {
    // 1. IndexedDB에서 삭제
    await deleteSongFromDB(id);

    // 2. 상태 업데이트 및 메모리 해제
    setUserSongs(prev => {
      const songToDelete = prev.find(s => s.id === id);
      if (songToDelete && songToDelete.src.startsWith('blob:')) {
        URL.revokeObjectURL(songToDelete.src);
      }
      return prev.filter(s => s.id !== id);
    });

    // 3. 모든 플레이리스트에서 해당 곡 ID 제거 (참조 무결성 유지)
    setUserPlaylists(prev => prev.map(p => ({ ...p, songIds: p.songIds.filter(sid => sid !== id) })));
  }, []);

  const playTrack = useCallback((index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, []);

  const toggleControlBarMode = useCallback(() => {
    setControlBarMode((prev) => (prev === 'title' ? 'progress' : 'title'));
  }, []);

  const togglePlaylistWindow = useCallback(() => {
    setIsPlaylistOpen((prev) => !prev);
  }, []);

  // 플레이리스트 커스텀 기능
  const createPlaylist = useCallback((name) => {
    const newList = { id: Date.now(), name, songIds: [] };
    setUserPlaylists(prev => [...prev, newList]);
  }, []);

  const uploadLocalSong = useCallback(async (file) => {
    const MAX_STORAGE_SIZE = 100 * 1024 * 1024; // 100MB
    const currentTotalSize = await calculateTotalSize();

    if (currentTotalSize + file.size > MAX_STORAGE_SIZE) {
      alert("브라우저 저장 공간이 부족합니다 (최대 100MB). 불필요한 곡을 삭제하거나 정리해주세요.");
      return;
    }

    const id = `local_${Date.now()}`;
    const newSongData = {
      id,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      file: file, // 원본 Blob 저장
    };

    await saveSongToDB(newSongData);
    
    const songWithUrl = {
      ...newSongData,
      src: URL.createObjectURL(file)
    };
    setUserSongs(prev => [...prev, songWithUrl]);
  }, []);

  const deletePlaylist = useCallback((id) => {
    setUserPlaylists(prev => {
      const filtered = prev.filter(p => p.id !== id || p.isSystem);
      if (activePlaylistId === id) setActivePlaylistId('all');
      return filtered;
    });
  }, [activePlaylistId]);

  const toggleSongInPlaylist = useCallback((playlistId, songId) => {
    setUserPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.isSystem) {
        const hasSong = p.songIds.includes(songId);
        return {
          ...p,
          songIds: hasSong 
            ? p.songIds.filter(id => id !== songId) 
            : [...p.songIds, songId]
        };
      }
      return p;
    }));
  }, []);

  const selectPlaylist = useCallback((id) => {
    setActivePlaylistId(id);
    setCurrentTrackIndex(0);
  }, []);

  const formatTime = useCallback((seconds) => {
    const secsTotal = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(secsTotal / 60);
    const secs = secsTotal % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const getStyle = useCallback((pos) => ({
    position: "absolute",
    left: `${(pos.x / VIEWBOX.WIDTH) * 100}%`,
    top: `${(pos.y / VIEWBOX.HEIGHT) * 100}%`,
    width: `${(pos.w / VIEWBOX.WIDTH) * 100}%`,
    height: `${(pos.h / VIEWBOX.HEIGHT) * 100}%`,
  }), []);

  const getCenterStyle = useCallback((cx, cy, w, h, flip = false) => ({
    position: "absolute",
    left: `${(cx / VIEWBOX.WIDTH) * 100}%`,
    top: `${(cy / VIEWBOX.HEIGHT) * 100}%`,
    width: `${(w / VIEWBOX.WIDTH) * 100}%`,
    height: `${(h / VIEWBOX.HEIGHT) * 100}%`,
    transform: `translate(-50%, -50%) ${flip ? "scaleX(-1)" : ""}`,
  }), []);

  const cleanSvg = useCallback((svgStr) => {
    return svgStr.replace(/<svg([^>]+)>/, (match, contents) => {
      const updatedContents = contents
        .replace(/\bwidth="[^"]*"/, 'width="100%"')
        .replace(/\bheight="[^"]*"/, 'height="100%"')
        .replace(/\bpreserveAspectRatio="[^"]*"/, '');
      return `<svg${updatedContents} preserveAspectRatio="none">`;
    });
  }, []);

  const handleProgressBarClick = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio.duration) return;

    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (clickX / progressBar.offsetWidth) * audio.duration;
    audio.currentTime = newTime;
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeating((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffling((prev) => !prev);
  }, []);

  return {
    isPlaying,
    isRepeating,
    isShuffling,
    volume,
    currentTrack,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    deleteUserSong,
    playTrack,
    toggleRepeat,
    toggleShuffle,
    setVolume,
    playlist,
    allAvailableSongs,
    totalStorageSize,
    controlBarMode,
    toggleControlBarMode,
    handleProgressBarClick,
    formatTime,
    uploadLocalSong,
    // 새 기능들
    isPlaylistOpen,
    togglePlaylistWindow,
    userPlaylists,
    activePlaylistId,
    createPlaylist,
    deletePlaylist,
    toggleSongInPlaylist,
    selectPlaylist,
    getStyle,
    getCenterStyle,
    cleanSvg,
    audioRef,
    handleVolumePointerDown: useCallback((e) => {
      e.preventDefault();
      const startY = e.clientY;
      const startVolume = volume;
      const sensitivity = 150; // 드래그 감도 (픽셀 단위)

      const onPointerMove = (moveEvent) => {
        const deltaY = startY - moveEvent.clientY; // 위로 올리면 볼륨 증가
        const nextVolume = Math.max(0, Math.min(1, startVolume + deltaY / sensitivity));
        setVolume(nextVolume);
      };

      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }, [volume, setVolume]),
  };
};
