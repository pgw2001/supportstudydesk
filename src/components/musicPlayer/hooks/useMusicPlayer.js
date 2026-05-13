import { useState, useCallback, useEffect, useRef } from "react";
import { DEFAULT_VOLUME } from "../constants";

const songModules = import.meta.glob("../songs/*.mp3", { eager: true });

const parseSongMetadata = (path, module, index) => {
  const fileName = path.split("/").pop().replace(/\.mp3$/, "");
  const [artistTag, ...titleParts] = fileName.split("-");
  const artist = artistTag.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const title = titleParts
    .join(" ")
    .replace(/x27/g, "'")
    .replace(/\s\d+$/, "")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

  return {
    id: index + 1,
    title,
    artist,
    src: module.default,
    duration: 0,
  };
};

const SONG_PLAYLIST = Object.entries(songModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, module], index) => parseSongMetadata(path, module, index));

export const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [controlBarMode, setControlBarMode] = useState('title'); // 'title' or 'progress'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playlist = SONG_PLAYLIST;
  const currentTrack = playlist[currentTrackIndex];
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.preload = "metadata";
    audio.volume = volume;
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

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
  }, [isShuffling, playlist.length]);

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
    audio.src = currentTrack.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentTrack.src, isPlaying]);

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

  const toggleControlBarMode = useCallback(() => {
    setControlBarMode((prev) => (prev === 'title' ? 'progress' : 'title'));
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
    toggleRepeat,
    toggleShuffle,
    setVolume,
    playlist,
    controlBarMode,
    toggleControlBarMode,
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