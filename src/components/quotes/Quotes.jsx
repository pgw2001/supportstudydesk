import { useEffect, useMemo, useRef } from "react";
import rough from "roughjs";
import { quotes } from "./quotesData";

function Quotes() {
  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  // 날짜별 메시지
  const message = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() + today.getMonth() + today.getDate();
    const index = seed % quotes.length;
    return quotes[index];
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
        block
        relative
        z-50
        w-[clamp(150px,18vw,240px)]
        aspect-[216/156]
      "
    >
      {/*SVG*/}
      <svg
        ref={svgRef}
        style={{ pointerEvents: "none" }}
        viewBox="0 0 216 156"
        className="absolute inset-0 block h-full w-full"
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