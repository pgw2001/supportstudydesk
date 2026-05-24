import { useEffect, useRef, useState } from "react";
import TimerFrame from "./TimerFrame";

function PomodoroTimer({ switchMode, onTick, setDeskTimerDisplay }) {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes] = useState(5);

  const [mode, setMode] = useState("focus");
  const [focusFinished, setFocusFinished] = useState(false);

  const notifiedRef = useRef(false);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);

            // const audio = new Audio("/alarm.mp3");
            // audio.play();

            if (mode === "focus" && !notifiedRef.current) {
              notifiedRef.current = true;
              setFocusFinished(true);

              alert("집중 시간이 끝났어요! 잠시 휴식을 취해보세요.");
            }

            if (mode === "break") {
              alert("휴식 시간이 끝났어요! 다시 집중해볼까요?");
              setMode("focus");
              setFocusFinished(false);
              notifiedRef.current = false;
              setTime(focusMinutes * 60);
            }

            return 0;
          }


          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, mode, focusMinutes]);

  // 시간이 변경될 때마다 onTick 호출 (포커스 모드일 때만)
  useEffect(() => {
    if (isRunning && mode === "focus" && time > 0 && onTick) {
      onTick();
    }
  }, [time, isRunning, mode, onTick]);


  useEffect(() => {

  setDeskTimerDisplay?.(
    formatTime()
  );

  }, [time]);

  const adjustFocusTime = (amount) => {
    const next = Math.max(5, focusMinutes + amount);

    setFocusMinutes(next);

    if (!isRunning && mode === "focus") {
      setTime(next * 60);
    }
  };

  const formatTime = () => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  return (
    <TimerFrame>
      {/* 제목 */}
      <text
        x="170"
        y="30"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="2"
        fill="#737373"
      >
        {mode === "focus" ? "FOCUS TIME" : "BREAK TIME"}
      </text>

      {/* NORMAL 버튼 */}
      <g
        onClick={switchMode}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: "pointer" }}
      >
        <rect
          x="250"
          y="14"
          width="64"
          height="22"
          rx="11"
          fill="#f5f5f5"
          stroke="black"
          strokeWidth="1.5"
        />

        <text
          x="282"
          y="28"
          textAnchor="middle"
          fontSize="9"
          pointerEvents="none"
        >
          NORMAL
        </text>
      </g>

      {/* 시간 */}
      <text
        x="170"
        y="102"
        textAnchor="middle"
        fontSize="38"
        fontWeight="600"
        letterSpacing="3"
        fill="#171717"
      >
        {formatTime()}
      </text>

      {/* -5 */}
      <g
        onClick={() => adjustFocusTime(-5)}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: "pointer" }}
      >
        <rect
          x="36"
          y="170"
          width="82"
          height="34"
          rx="17"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        <text
          x="77"
          y="191"
          textAnchor="middle"
          fontSize="12"
          pointerEvents="none"
        >
          -5 MIN
        </text>
      </g>

      {/* START / PAUSE */}
      <g
        onClick={() => setIsRunning((prev) => !prev)}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: "pointer" }}
      >
        <rect
          x="129"
          y="170"
          width="82"
          height="34"
          rx="17"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        <text
          x="170"
          y="191"
          textAnchor="middle"
          fontSize="12"
          pointerEvents="none"
        >
          {isRunning ? "PAUSE" : "START"}
        </text>
      </g>

      {/* +5 */}
      <g
        onClick={() => adjustFocusTime(5)}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: "pointer" }}
      >
        <rect
          x="222"
          y="170"
          width="82"
          height="34"
          rx="17"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        <text
          x="263"
          y="191"
          textAnchor="middle"
          fontSize="12"
          pointerEvents="none"
        >
          +5 MIN
        </text>
      </g>

      {/* 휴식 시작 */}
      {focusFinished && (
        <g
          onClick={() => {
            setMode("break");
            setFocusFinished(false);
            notifiedRef.current = false;
            setTime(breakMinutes * 60);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{ cursor: "pointer" }}
        >
          <rect
            x="92"
            y="138"
            width="156"
            height="22"
            rx="11"
            fill="#f0f0f0"
            stroke="black"
          />

          <text
            x="170"
            y="153"
            textAnchor="middle"
            fontSize="11"
            pointerEvents="none"
          >
            START BREAK TIME
          </text>
        </g>
      )}
    </TimerFrame>
  );
}

export default PomodoroTimer;