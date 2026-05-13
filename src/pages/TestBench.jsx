import React from "react";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";

function TestBench() {
  return (
    <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center p-20">
      {/* 조정하고 싶은 너비를 여기서 직접 변경하며 테스트하세요 */}
      <div className="w-full max-w-[400px]">
        <MusicPlayer />
      </div>
    </div>
  );
}

export default TestBench;