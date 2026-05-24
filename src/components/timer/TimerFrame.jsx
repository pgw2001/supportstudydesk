import { useEffect, useRef } from "react";
import rough from "roughjs";

function TimerFrame({ children }) {
  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const roughGroup = roughGroupRef.current;

    if (!svg || !roughGroup) return;

    const draw = () => {
      roughGroup.innerHTML = "";

      const rc = rough.svg(svg);

      const outer = rc.rectangle(4, 4, 332, 232, {
        stroke: "black",
        strokeWidth: 2,
        fill: "white",
        fillStyle: "solid",
        roughness: 1.5,
        bowing: 1.5,
        seed: 10,
      });

      const inner = rc.rectangle(40, 48, 260, 84, {
        stroke: "black",
        strokeWidth: 2,
        fill: "#e5e5e5",
        fillStyle: "solid",
        roughness: 1.5,
        bowing: 1.5,
        seed: 20,
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

  return (
    <section className="w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 340 240"
        className="w-full h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          ref={roughGroupRef}
          style={{ pointerEvents: "none" }}
        />

        {children}
      </svg>
    </section>
  );
}

export default TimerFrame;