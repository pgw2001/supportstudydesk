import React, { useRef, useEffect, useState } from "react";
import * as assets from "./boomboxAssets";
import { useMusicPlayer } from "./hooks/useMusicPlayer";
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
    toggleControlBarMode,
  } = useMusicPlayer();

  const formatTime = (seconds) => {
    const secsTotal = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(secsTotal / 60);
    const secs = secsTotal % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // 일반 좌표를 %로 변환하는 함수 (버튼용)
  const getStyle = (pos) => ({
    position: "absolute",
    left: `${(pos.x / VIEWBOX.WIDTH) * 100}%`,
    top: `${(pos.y / VIEWBOX.HEIGHT) * 100}%`,
    width: `${(pos.w / VIEWBOX.WIDTH) * 100}%`,
    height: `${(pos.h / VIEWBOX.HEIGHT) * 100}%`,
  });

  // 중심 좌표 기준 스타일
  const getCenterStyle = (cx, cy, w, h, flip = false) => ({
    position: "absolute",
    left: `${(cx / VIEWBOX.WIDTH) * 100}%`,
    top: `${(cy / VIEWBOX.HEIGHT) * 100}%`,
    width: `${(w / VIEWBOX.WIDTH) * 100}%`,
    height: `${(h / VIEWBOX.HEIGHT) * 100}%`,
    transform: `translate(-50%, -50%) ${flip ? "scaleX(-1)" : ""}`,
  });

  // SVG 문자열에서 불필요한 고정 크기 속성을 제거하는 처리 (선택 사항)
  // 만약 SVG 파일 자체에 width/height가 없다면 이 과정도 생략 가능합니다.
  const cleanSvg = (svgStr) => {
    // <svg> 태그 내부의 width, height만 찾아서 100%로 바꾸고, 
    // 내부의 rect, circle 등의 속성은 건드리지 않도록 수정합니다.
    return svgStr.replace(/<svg([^>]+)>/, (match, contents) => {
      // 기존 preserveAspectRatio 속성이 있다면 제거하고 새로 추가
      const updatedContents = contents
      .replace(/\bwidth="[^"]*"/, 'width="100%"')
        .replace(/\bheight="[^"]*"/, 'height="100%"')
        .replace(/\bpreserveAspectRatio="[^"]*"/, '');
      return `<svg${updatedContents} preserveAspectRatio="none">`;
    });
  };



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
    <div className={`relative w-full aspect-[400/251] ${className}`}>
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
        style={getCenterStyle(66.5, 173.5, 124, 124)}
        className="pointer-events-none z-20"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.speakerSvg) }}
      />
      <div
        style={getCenterStyle(333.5, 173.5, 124, 124, true)}
        className="pointer-events-none z-20"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.speakerSvg) }}
      />
      <div
        style={getStyle({ x: 49.5, y: 58.5, w: 302, h: 25 })}
        className="pointer-events-none z-20"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.controlBarSvg) }}
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
            <div className="flex items-center justify-between gap-2">
              <div className="truncate text-[9px] font-mono font-bold text-[#16a34a]">
                {currentTrack.title}
              </div>
              <div className="text-[8px] text-[#16a34a] tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            <div className="mt-1 h-[4px] w-full overflow-hidden rounded-full bg-black/20">
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

      <div
        style={getCenterStyle(24, 73, 27, 27)}
        className="pointer-events-none z-20"
        dangerouslySetInnerHTML={{ __html: cleanSvg(assets.songListSvg) }}
      />

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
      </div>
    </div>
  );
}

export default MusicPlayer;
