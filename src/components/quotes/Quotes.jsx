import { useEffect, useMemo, useRef } from "react";
import rough from "roughjs";
import { quotes } from "./quotesData";

function Quotes() {
  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  // 오늘의 메시지
  const message = useMemo(() => {
    const today = new Date();
    const seed =
      today.getFullYear() +
      today.getMonth() +
      today.getDate();

    const index = seed % quotes.length;
    return quotes[index];
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const roughGroup = roughGroupRef.current;

    if (!svg || !roughGroup) return;

    roughGroup.innerHTML = "";

    const rc = rough.svg(svg);

    // 칠판 배경
    const board = rc.rectangle(5, 5, 290, 170, {
      stroke: "#d6d6d6",
      strokeWidth: 2.2,
      fill: "#1F2A24",
      fillStyle: "solid",
      roughness: 2,
      bowing: 2,
    });

    // 안쪽 테두리
    const inner = rc.rectangle(14, 14, 272, 152, {
      stroke: "#4d5c53",
      strokeWidth: 1,
      roughness: 1.5,
      bowing: 1,
    });

    // 낙서 라인
    const line1 = rc.line(28, 38, 120, 38, {
      stroke: "#ffffff33",
      roughness: 3,
      bowing: 2,
    });

    const line2 = rc.line(185, 145, 255, 145, {
      stroke: "#ffffff22",
      roughness: 3,
      bowing: 2,
    });

    roughGroup.appendChild(board);
    roughGroup.appendChild(inner);
    roughGroup.appendChild(line1);
    roughGroup.appendChild(line2);
  }, []);

  return (
    <section
      className="
        relative
        z-50
        w-full
        aspect-[300/180]
        drop-shadow-xl
        select-none
      "
    >
      {/* 칠판 프레임 */}
      <div
        className="
          absolute
          inset-0
          rounded-md
          bg-[#7A5230]
          shadow-[6px_6px_0_rgba(0,0,0,0.18)]
        "
      />

      {/* SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 300 180"
        className="absolute inset-[8px] h-[calc(100%-16px)] w-[calc(100%-16px)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={roughGroupRef} />
      </svg>

      {/* 분필 자국 */}
      <div
        className="
          absolute
          left-[12%]
          top-[18%]
          h-1
          w-1
          rounded-full
          bg-white/20
        "
      />

      <div
        className="
          absolute
          right-[18%]
          bottom-[22%]
          h-[2px]
          w-[2px]
          rounded-full
          bg-white/10
        "
      />

      {/* 텍스트 */}
      <div
        className="
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-center
          px-10
          text-center
        "
      >
        <p
          className="
            text-[15px]
            leading-7
            text-[#F5F5F5]
            tracking-wide
            font-['Patrick_Hand']
          "
          style={{
            textShadow: "1px 1px 1px rgba(255,255,255,0.15)",
          }}
        >
          {message}
        </p>
      </div>

      {/* 분필 */}
      <div
        className="
          absolute
          bottom-[10px]
          right-6
          h-[8px]
          w-12
          rotate-[-8deg]
          rounded-full
          bg-[#f3f3f3]
          shadow-[2px_2px_0_rgba(0,0,0,0.1)]
        "
      />
    </section>
  );
}

export default Quotes;