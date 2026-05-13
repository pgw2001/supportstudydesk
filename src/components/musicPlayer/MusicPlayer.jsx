import React, { useState } from "react";
import * as assets from "./boomboxAssets";
import { useMusicPlayer } from "./useMusicPlayer";

// 버튼 좌표 (body.svg의 viewBox가 0 0 400 251 이라고 가정할 때의 예시 좌표)
const BUTTON_MAP = {
  play: { x: 184.5, y: 35, w: 30, h: 19 },
  prev: { x: 151.5, y: 35, w: 30, h: 19 },
  next: { x: 217.5, y: 35, w: 30, h: 19 },
  repeat: {x: 250.5, y: 35, w: 30, h: 19 },
  shuffle: {x: 118.5, y: 35, w: 30, h: 19 }
};

function MusicPlayer({ className }) {
  const { isPlaying, togglePlay, nextTrack, prevTrack, currentTrack } = useMusicPlayer();

  // 일반 좌표를 %로 변환하는 함수 (버튼용)
  const getStyle = (pos) => ({
    position: "absolute",
    left: `${(pos.x / 400) * 100}%`,
    top: `${(pos.y / 251) * 100}%`,
    width: `${(pos.w / 400) * 100}%`,
    height: `${(pos.h / 251) * 100}%`,
  });

  // 중심 좌표 기준 스타일
  const getCenterStyle = (cx, cy, w, h, flip = false) => ({
    position: "absolute",
    left: `${(cx / 400) * 100}%`,
    top: `${(cy / 251) * 100}%`,
    width: `${(w / 400) * 100}%`,
    height: `${(h / 251) * 100}%`,
    transform: `translate(-50%, -50%) ${flip ? "scaleX(-1)" : ""}`,
  });

  // SVG 문자열에서 불필요한 고정 크기 속성을 제거하는 처리 (선택 사항)
  // 만약 SVG 파일 자체에 width/height가 없다면 이 과정도 생략 가능합니다.
  const cleanSvg = (svgStr) => {
    return svgStr
      .replace(/width="S*?"/g, 'width="100%"')
      .replace(/height="S*?"/g, 'height="100%"');
  };

  return (
    <div className={`relative w-full aspect-[400/251] ${className}`}>

          {/* 재생/일시정지 버튼 아이콘 */}
        <div
            style={getStyle(BUTTON_MAP.play)}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(isPlaying ? assets.pauseBtnSvg : assets.playBtnSvg) }}
        />

        {/* 이전 곡 버튼 아이콘 */}
        <div
            style={getStyle(BUTTON_MAP.prev)}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.prevSongBtnSvg) }}
        />

        {/* 다음 곡 버튼 아이콘 (이전 곡 버튼 좌우 반전) */}
        <div
            style={{
            ...getStyle(BUTTON_MAP.next),
            transform: "scaleX(-1)"
            }}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.prevSongBtnSvg) }}
        />

        {/* 반복 버튼 아이콘 */}
        <div
            style={getStyle(BUTTON_MAP.repeat)}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.repeatBtnSvg) }}
        />

        {/* 셔플 버튼 아이콘 */}
        <div
            style={getStyle(BUTTON_MAP.shuffle)}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.shuffleBtnSvg) }}
        />

    
        {/* 1. 디자인 배경 (Body) */}
        <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.bodySvg) }}
        />
            
        {/* 스피커 레이어 */}
        <div
            style={getCenterStyle(66.5, 173.5, 124, 124)}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.speakerSvg) }}
        />
        <div
            style={getCenterStyle(333.5, 173.5, 124, 124, true)}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.speakerSvg) }}
        />
        
        {/* 컨트롤 바 레이어 */}
        <div
            style={getStyle({ x: 49.5, y: 58.5, w: 301, h: 25 })}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.controlBarSvg) }}
        />

        {/* 볼륨 노브 레이어 */}
        <div
            style={getCenterStyle(377, 73 , 27, 27)}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.volumeKnobSvg) }}
        />
        
        {/* 곡 목록 레이어 */}
        <div
            style={getCenterStyle(24, 73, 27, 27)}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: cleanSvg(assets.songListSvg) }}
        />


      {/* 2. 인터랙티브 버튼 레이어 */}
      <div className="absolute inset-0 w-full h-full">
        {/* 재생 버튼 */}
        <button
          style={getStyle(BUTTON_MAP.play)}
          className="bg-transparent hover:bg-black/10 rounded-full transition-colors"
          onClick={togglePlay}
          title="Play/Pause"
        />
        {/* 이전 곡 버튼 */}
        <button
          style={getStyle(BUTTON_MAP.prev)}
          className="bg-transparent hover:bg-black/10 rounded-sm"
          onClick={prevTrack}
          title="Previous"
        />
        {/* 다음 곡 버튼 */}
        <button
          style={getStyle(BUTTON_MAP.next)}
          className="bg-transparent hover:bg-black/10 rounded-sm"
          onClick={nextTrack}
          title="Next"
        />

        {/* 반복 버튼 */}
        <button
          style={getStyle(BUTTON_MAP.repeat)}
          className="bg-transparent hover:bg-black/10 rounded-sm"
          onClick={togglePlay}
          title="Repeat"
        />

        {/* 셔플 버튼 */}
        <button
          style={getStyle(BUTTON_MAP.shuffle)}
          className="bg-transparent hover:bg-black/10 rounded-sm"
          onClick={togglePlay}
          title="Shuffle"
        />
      </div>
    </div>
  );
}

export default MusicPlayer;
