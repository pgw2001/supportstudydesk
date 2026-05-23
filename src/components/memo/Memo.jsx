import { useEffect, useRef } from "react";
import rough from "roughjs";

function Memo({ memo, onChange, onDragStart }) {
  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const roughGroup = roughGroupRef.current;

    if (!svg || !roughGroup) return;

    roughGroup.innerHTML = "";

    const rc = rough.svg(svg);

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
      className="absolute select-none"
      style={{
        left: memo.x,
        top: memo.y,
        transform: `rotate(${memo.rotation}deg)`,
      }}
      onMouseDown={onDragStart}
    >
      {/* SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 220"
        className="h-[220px] w-[200px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          ref={roughGroupRef}
          style={{ pointerEvents: "none" }}
        />
      </svg>

      {/* 입력 */}
      <textarea
        value={memo.text}
        onChange={(e) =>
          onChange(memo.id, e.target.value)
        }
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