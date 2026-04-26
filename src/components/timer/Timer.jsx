import { useState, useEffect } from "react";

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 타이머 동작
  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = () => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <section className="w-[170px] rotate-[6deg] rounded-[26px] border-2 border-neutral-800 bg-white p-4 shadow-[4px_5px_0_rgba(0,0,0,0.16)]">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          Desk Timer
        </p>

        <p className="mt-3 text-4xl font-semibold tracking-[0.08em] text-neutral-900">
          {formatTime()}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
          <button
            onClick={() => setIsRunning(true)}
            className="rounded-full border border-neutral-900 px-2 py-1.5"
          >
            Start
          </button>

          <button
            onClick={() => setIsRunning(false)}
            className="rounded-full border border-neutral-900 px-2 py-1.5"
          >
            Pause
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTime(0);
            }}
            className="rounded-full border border-neutral-900 px-2 py-1.5"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

export default Timer;