import { useState, useCallback, useEffect, useRef } from "react";
import { DEFAULT_VOLUME, VIEWBOX } from "../constants";

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

  const toggleControlBarMode = useCallback(() => {
    setControlBarMode((prev) => (prev === 'title' ? 'progress' : 'title'));
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
    toggleRepeat,
    toggleShuffle,
    setVolume,
    playlist,
    controlBarMode,
    toggleControlBarMode,
    handleProgressBarClick,
    formatTime,
    getStyle,
    getCenterStyle,
    cleanSvg,
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