import React, { useRef, useEffect, useState } from "react";
import * as assets from "./boomboxAssets";
import { useMusicPlayer, SONG_PLAYLIST } from "./hooks/useMusicPlayer"; // Import SONG_PLAYLIST
import PlaylistFloatingWindow from "./hooks/PlaylistFloatingWindow"; // Import PlaylistFloatingWindow
import { 
  BUTTON_MAP, 
  VIEWBOX, 
  VOLUME_SENSITIVITY, 
  DEFAULT_MARQUEE_TEXT,
  MARQUEE_STYLE 
} from "./constants";

function MusicPlayer({ className }) {
  const {
    isPlaying,
    isRepeating,
    isShuffling,
    volume,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleRepeat,
    toggleShuffle,
    setVolume,
    currentTrack,
    currentTime,
    duration,
    handleVolumePointerDown,
    controlBarMode,
    handleProgressBarClick,
    toggleControlBarMode,
    formatTime,
    getStyle,
    getCenterStyle,
    cleanSvg,
    // New playlist features
    isPlaylistOpen,
    togglePlaylistWindow,
    userPlaylists,
    activePlaylistId,
    createPlaylist,
    deletePlaylist,
    toggleSongInPlaylist,
    selectPlaylist,
  } = useMusicPlayer();

  const marqueeTextRef = useRef(null);
  const marqueeContainerRef = useRef(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);

  useEffect(() => {
    if (marqueeTextRef.current && marqueeContainerRef.current) {
      const textWidth = marqueeTextRef.current.scrollWidth;
      const containerWidth = marqueeContainerRef.current.clientWidth;

      // 텍스트가 컨테이너보다 길면 마퀴 활성화 (여유 공간 5px)
      if (textWidth > containerWidth + 5) {
        setShouldMarquee(true);
      } else {
        setShouldMarquee(false);
      }
    }
  }, [currentTrack, isPlaying, controlBarMode]); // 곡 정보나 재생 상태, 모드 변경 시 다시 측정

  return (
    <div className={`relative w-full aspect-[400/252] ${className}`}>
      {/* 3. 상태 표시 아이콘 레이어 (재생, 반복 등) - z-index를 낮추고 가장 먼저 렌더링하여 뒤로 보냄 */}
      <div
        style={getStyle(BUTTON_MAP.play)}
        className="pointer-events-none z-0"
        dangerouslySetInnerHTML={{ __html: cleanSvg(isPlaying ? assets.pauseBtnSvg : assets.playBtnSvg) }}
      />
      <div
        style={getStyle(BUTTON_MAP.prev)}
        className="pointer-events-none z-0"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.prevSongBtnSvg) }}
      />
      <div
        style={{
          ...getStyle(BUTTON_MAP.next),
          transform: "scaleX(-1)"
        }}
        className="pointer-events-none z-0"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.prevSongBtnSvg) }}
      />
      <div
        style={getStyle(BUTTON_MAP.repeat)}
        className="pointer-events-none z-0"
        dangerouslySetInnerHTML={{ __html: cleanSvg(isRepeating ? assets.activateRepeatBtnSvg : assets.repeatBtnSvg) }}
      />
      <div
        style={getStyle(BUTTON_MAP.shuffle)}
        className="pointer-events-none z-0"
        dangerouslySetInnerHTML={{ __html: cleanSvg(isShuffling ? assets.activateShuffleBtnSvg : assets.shuffleBtnSvg) }}
      />

      {/* 1. 디자인 배경 (Body) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.bodySvg) }}
      />

      {/* 2. 장식 및 베이스 레이어 (스피커, 컨트롤바, 곡 목록 등) */}
      <div
        style={{
          ...getCenterStyle(66.5, 173.5, 124, 124),
          animation: isPlaying ? "speaker-pump 0.8s ease-in-out infinite" : "none",
          "--speaker-scale": 1 + (volume * 0.1)
        }}
        className="pointer-events-none z-20"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.speakerSvg) }}
      />
      <div
        style={{
          ...getCenterStyle(333.5, 173.5, 124, 124, true),
          animation: isPlaying ? "speaker-pump-flip 0.8s ease-in-out infinite" : "none",
          "--speaker-scale": 1 + (volume * 0.1)
        }}
        className="pointer-events-none z-20"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.speakerSvg) }}
      />
      <div
        style={getStyle({ x: 49.5, y: 58.5, w: 302, h: 25 })}
        className="pointer-events-none z-20"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.controlBarSvg) }}
      />

      <div
        style={getCenterStyle(24, 73, 27, 27)}
        className="pointer-events-none z-20"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.songListSvg) }}
      />

      <div
        ref={marqueeContainerRef}
        style={{
          ...getStyle({ x: 55, y: 58.5, w: 262, h: 25 }),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
        className="z-20 pointer-events-none"
      >
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          @keyframes speaker-pump {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(var(--speaker-scale, 1.05)); }
          }
          @keyframes speaker-pump-flip {
            0%, 100% { transform: translate(-50%, -50%) scaleX(-1) scale(1); }
            50% { transform: translate(-50%, -50%) scaleX(-1) scale(var(--speaker-scale, 1.05)); }
          }
        `}</style>
        {controlBarMode === "title" ? (
          <div
            ref={marqueeTextRef}
            className="whitespace-nowrap font-mono font-bold"
            style={{
              animation: shouldMarquee ? "marquee 12s linear infinite" : "none",
              fontSize: "10px",
              color: "#16a34a",
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            {isPlaying
              ? `${currentTrack.title} - ${currentTrack.artist} 🎵 `
              : "BOOMBOX READY - SUPPORT STUDY DESK"}
          </div>
        ) : (
          <div className="w-full px-1">
            <div className="flex items-center justify-center">
              <div className="text-[9px] font-mono font-bold text-[#16a34a] tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            <div 
              className="mt-0.5 h-[7px] w-full overflow-hidden rounded-full bg-black/20 cursor-pointer pointer-events-auto" 
              onClick={handleProgressBarClick}
              data-no-drag="true"
            >
              <div
                className="h-full rounded-full bg-[#16a34a]"
                style={{
                  width: `${duration ? Math.min(100, (currentTime / duration) * 100) : 0}%`,
                  transition: "width 0.2s linear",
                }}
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        style={getStyle({ x: 330, y: 61, w: 18, h: 8 })}
        onClick={toggleControlBarMode}
        title="Swap control view"
        className="pointer-events-auto z-30 flex items-center justify-center rounded-sm text-[10px] text-black transition hover:bg-slate-100"
      >
        <svg viewBox="0 0 10 6" className="w-2.5 h-1.5 fill-current">
          <path d="M5 0L10 6H0L5 0Z" />
        </svg>
      </button>
      <button
        type="button"
        style={getStyle({ x: 330, y: 70, w: 18, h: 8 })}
        onClick={toggleControlBarMode}
        title="Swap control view"
        className="pointer-events-auto z-30 flex items-center justify-center rounded-sm text-[10px] text-black transition hover:bg-slate-100"
      >
        <svg viewBox="0 0 10 6" className="w-2.5 h-1.5 fill-current">
          <path d="M5 6L0 0H10L5 6Z" />
        </svg>
      </button>

      {/* 4. 인터랙티브 볼륨 노브 레이어 */}
      <div
        style={{
          ...getCenterStyle(377, 73, 27, 27),
          transform: `${getCenterStyle(377, 73, 27, 27).transform} rotate(${(volume * 270) - 135}deg)`,
          cursor: "ns-resize"
        }}
        className="pointer-events-auto z-30"
        onPointerDown={handleVolumePointerDown}
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.volumeKnobSvg) }}
      />

      {/* 5. 인터랙티브 버튼 히트박스 레이어 (가장 앞) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-40">
        <button
          style={getStyle(BUTTON_MAP.play)}
          className="bg-transparent hover:bg-black/10 rounded-full transition-colors pointer-events-auto"
          onClick={togglePlay}
          title="Play/Pause"
        />
        <button
          style={getStyle(BUTTON_MAP.prev)}
          className="bg-transparent hover:bg-black/10 rounded-sm pointer-events-auto"
          onClick={prevTrack}
          title="Previous"
        />
        <button
          style={getStyle(BUTTON_MAP.next)}
          className="bg-transparent hover:bg-black/10 rounded-sm pointer-events-auto"
          onClick={nextTrack}
          title="Next"
        />
        <button
          style={getStyle(BUTTON_MAP.repeat)}
          className="bg-transparent hover:bg-black/10 rounded-sm pointer-events-auto"
          onClick={toggleRepeat}
          title="Repeat"
        />
        <button
          style={getStyle(BUTTON_MAP.shuffle)}
          className="bg-transparent hover:bg-black/10 rounded-sm pointer-events-auto"
          onClick={toggleShuffle}
          title="Shuffle"
        />
        {/* Song List Button (clickable area over the visual SVG) */}
        <button
          style={getCenterStyle(24, 73, 27, 27)} // Use the same style as the visual songListSvg
          className="bg-transparent hover:bg-black/10 rounded-sm pointer-events-auto"
          onClick={togglePlaylistWindow}
          title="Song List"
        />
      </div>

      {/* Playlist Floating Window */}
      <PlaylistFloatingWindow
        isOpen={isPlaylistOpen}
        onClose={togglePlaylistWindow}
        userPlaylists={userPlaylists}
        activePlaylistId={activePlaylistId}
        selectPlaylist={selectPlaylist}
        createPlaylist={createPlaylist}
        deletePlaylist={deletePlaylist}
        toggleSongInPlaylist={toggleSongInPlaylist}
        allSongs={SONG_PLAYLIST} // Pass the full list of songs
        currentTrack={currentTrack} // Pass current track to highlight
      />
    </div>
  );
}


export default MusicPlayer;
