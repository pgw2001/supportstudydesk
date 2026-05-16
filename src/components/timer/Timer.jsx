import { useState, useEffect, useRef } from "react";
import rough from "roughjs";

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // normal | pomodoro
  const [mode, setMode] = useState("normal");

  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  // 뽀모도로 기본값 (25분)
  const POMODORO_TIME = 25 * 60;

  // 타이머 동작
  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          // 일반 모드 → 증가
          if (mode === "normal") {
            return prev + 1;
          }

          // 뽀모도로 모드 → 감소
          if (prev <= 0) {
            clearInterval(timer);
            setIsRunning(false);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  // rough.js SVG 렌더링
  useEffect(() => {
    const svg = svgRef.current;
    const roughGroup = roughGroupRef.current;

    if (!svg || !roughGroup) return;

    const draw = () => {
      roughGroup.innerHTML = "";

      const rc = rough.svg(svg);

      // 외부 박스
      const outer = rc.rectangle(4, 4, 332, 232, {
        stroke: "black",
        strokeWidth: 2,
        fill: "white",
        fillStyle: "solid",
        roughness: 1.5,
        bowing: 1.5,
      });

      // 내부 화면
      const inner = rc.rectangle(40, 48, 260, 84, {
        stroke: "black",
        strokeWidth: 2,
        fill: "#e5e5e5",
        fillStyle: "solid",
        roughness: 1.5,
        bowing: 1.5,
      });

      roughGroup.appendChild(outer);
      roughGroup.appendChild(inner);
    };

    draw();

    window.addEventListener("resize", draw);

    return () => {
      window.removeEventListener("resize", draw);
    };
  }, []);

  // 시간 포맷
  const formatTime = () => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  // 모드 변경
  const toggleMode = () => {
    setIsRunning(false);

    if (mode === "normal") {
      setMode("pomodoro");
      setTime(POMODORO_TIME);
    } else {
      setMode("normal");
      setTime(0);
    }
  };

  return (
    <section
      className="
        w-[clamp(150px,22vw,320px)]
      "
    >
      <svg
        ref={svgRef}
        viewBox="0 0 340 240"
        className="w-full h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* rough.js 배경 */}
        <g
          ref={roughGroupRef}
          style={{ pointerEvents: "none" }}
        />

        {/* 제목 */}
        <text
          x="170"
          y="30"
          textAnchor="middle"
          fontSize="12"
          letterSpacing="2"
          fill="#737373"
          pointerEvents="none"
        >
          {mode === "normal" ? "DESK TIMER" : "POMODORO TIMER"}
        </text>

        {/* 모드 변경 버튼 */}
        <g
          onClick={toggleMode}
          onPointerDown={(e) => e.stopPropagation()}
          style={{ cursor: "pointer" }}
        >
          <rect
            x="258"
            y="14"
            width="56"
            height="22"
            rx="11"
            fill="#f5f5f5"
            stroke="black"
            strokeWidth="1.5"
          />

          <text
            x="286"
            y="28"
            textAnchor="middle"
            fontSize="9"
            fill="#171717"
            pointerEvents="none"
          >
            {mode === "normal" ? "POMO" : "NORMAL"}
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
          pointerEvents="none"
        >
          {formatTime()}
        </text>

        {/* START 버튼 */}
        <g
          onClick={() => setIsRunning(true)}
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
            START
          </text>
        </g>

        {/* PAUSE 버튼 */}
        <g
          onClick={() => setIsRunning(false)}
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
            PAUSE
          </text>
        </g>

        {/* RESET 버튼 */}
        <g
          onClick={() => {
            setIsRunning(false);

            if (mode === "pomodoro") {
              setTime(POMODORO_TIME);
            } else {
              setTime(0);
            }
          }}
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
            RESET
          </text>
        </g>
      </svg>
    </section>
  );
}

export default Timer;