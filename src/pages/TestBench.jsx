import React, { useState, useEffect } from "react";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";
import StudyPlant from "../components/study-plant/StudyPlant";

function TestBench() {
  const [focusTime, setFocusTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 시뮬레이션을 위한 타이머 (1초마다 1분씩 증가시켜서 성장을 빠르게 확인)
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setFocusTime((prev) => prev + 60); 
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-[#f4f1ec] flex flex-col items-center justify-center p-20 gap-10">
      <div className="flex flex-col items-center gap-4 p-10 bg-white rounded-3xl shadow-xl border-2 border-black/5">
        <h2 className="font-['Patrick_Hand'] text-2xl">Plant Growth Test</h2>
        
        {/* focusTime 전달 */}
        <StudyPlant focusTime={focusTime} plantType="rose" />
        
        <div className="flex flex-col items-center gap-2 mt-4">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2 bg-[#4ade80] rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {isRunning ? "Pause" : "Start Simulation"}
          </button>
          <p className="font-mono text-sm text-black/40">Simulated Time: {Math.floor(focusTime/60)} mins</p>
        </div>
      </div>
    </div>
  );
}

export default TestBench;