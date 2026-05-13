import { useState, useCallback } from "react";

export const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // 임시 재생 목록 데이터
  const playlist = [
    { id: 1, title: "Lo-fi Study Beat", artist: "Support Desk" },
    { id: 2, title: "Chill Rain", artist: "Nature" },
    { id: 3, title: "Jazz Cafe", artist: "Piano Trio" },
  ];

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    console.log("Next track playing...");
  }, [playlist.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    console.log("Previous track playing...");
  }, [playlist.length]);

  return {
    isPlaying,
    currentTrack: playlist[currentTrackIndex],
    togglePlay,
    nextTrack,
    prevTrack,
    playlist,
  };
};