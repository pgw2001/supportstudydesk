import { useState, useEffect, useRef } from "react";
import rough from "roughjs";

function Memo() {
  const [text, setText] = useState("");

  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("memo");
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("memo", text);
  }, [text]);

  useEffect(() => {
    const svg = svgRef.current;
    const roughGroup = roughGroupRef.current;

    if (!svg || !roughGroup) return;

    roughGroup.innerHTML = "";

    const rc = rough.svg(svg);

    // 메모 배경
    const note = rc.rectangle(4, 4, 192, 212, {
      stroke: "#987a00",
      strokeWidth: 2,
      fill: "#ffd93b",
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
        w-[clamp(120px,16vw,200px)]
        aspect-[200/220]
      "
    >
      {/* SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 220"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          ref={roughGroupRef}
          style={{ pointerEvents: "none" }}
        />
      </svg>

      {/* 메모 입력 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write memo..."
        className="
          absolute
          inset-0
          z-10
          h-full
          w-full
          resize-none
          bg-transparent
          p-4
          text-[11px]
          leading-4
          text-neutral-900
          outline-none
        "
      />
    </section>
  );
}

export default Memo;
