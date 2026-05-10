import { useState, useEffect, useRef } from "react";
import rough from "roughjs";

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

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
          DESK TIMER
        </text>

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
            setTime(0);
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