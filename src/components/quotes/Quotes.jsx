import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

function Quotes() {
  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  // 날짜별 메시지
  const messages = [
    "Small progress is still progress.",
    "Done is better than perfect.",
    "One more hour for your future self.",
    "Focus on the process, not the pressure.",
    "Your consistency creates results.",
    "Keep showing up every day.",
    "Start now. Motivation comes later.",
  ];

  const [message, setMessage] = useState("");

  // 하루마다 다른 메시지 선택
  useEffect(() => {
    const today = new Date();

    // 날짜 기반 index 생성
    const seed =
      today.getFullYear() +
      today.getMonth() +
      today.getDate();

    const index = seed % messages.length;

    setMessage(messages[index]);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const roughGroup = roughGroupRef.current;

    if (!svg || !roughGroup) return;

    roughGroup.innerHTML = "";

    const rc = rough.svg(svg);

    // 배경 메모
    const note = rc.rectangle(4, 4, 212, 152, {
      stroke: "#B76E79",
      strokeWidth: 2,
      fill: "#FFD6E0",
      fillStyle: "solid",
      roughness: 1.2,
      bowing: 1.5,
    });

    roughGroup.appendChild(note);
  }, []);

  return (
    <section
      className="
        relative
        z-50
        w-[clamp(150px,18vw,240px)]
        aspect-[216/156]
        rotate-[3deg]
      "
    >
      {/*SVG*/}
      <svg
        ref={svgRef}
        viewBox="0 0 216 156"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          ref={roughGroupRef}
          style={{ pointerEvents: "none" }}
        />
      </svg>

      {/*메시지*/}
      <div
        className="
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-center
          px-5
          text-center
          text-[12px]
          leading-5
          text-neutral-900
          select-none
        "
      >
        <p>{message}</p>
      </div>
    </section>
  );
}

export default Quotes;