import React from "react";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";

function TestBench() {
  return (
    <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center p-20">
      {/* 조정하고 싶은 너비를 MusicPlayer의 className prop으로 직접 변경하며 테스트하세요 */}
      {/* 예: className="w-full max-w-[400px]" */}
      <MusicPlayer className="w-full max-w-[400px]" />
    </div>
  );
}

export default TestBench;