import { useEffect, useRef } from "react";
import rough from "roughjs";

function Memo({
  memo,
  onChange,
  onDragStart,
  onDelete,
  isEditMode,
}) {
  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const roughGroup = roughGroupRef.current;

    if (!svg || !roughGroup) return;

    roughGroup.innerHTML = "";

    const rc = rough.svg(svg);

    const note = rc.rectangle(
      4,
      4,
      192,
      212,
      {
        stroke: "#987a00",
        strokeWidth: 2,
        fill: "#ffd93b",
        fillStyle: "solid",
        roughness: 1.2,
        bowing: 1.5,
      }
    );

    roughGroup.appendChild(note);
  }, []);

  return (
    <section
      className="
        absolute
        select-none
        w-[12vw]
        h-[13.2vw]
        min-w-[120px]
        min-h-[132px]
        max-w-[220px]
        max-h-[242px]
      "
      data-no-drag="true"
      style={{
        left: `${memo.xPercent * 100}%`,
        top: `${memo.yPercent * 100}%`,
        transform: `
          translate(-50%, -50%)
          rotate(${memo.rotation}deg)
        `,
        touchAction: "none",
        cursor: isEditMode
          ? "grab"
          : "default",
        pointerEvents: "auto",
      }}
      onPointerDownCapture={(e) => {
        if (!isEditMode) return;

        // 부모 Draggable로 이벤트 전달 완전 차단
        e.stopPropagation();
      }}

      onPointerDown={(e) => {
        if (!isEditMode) return;

        e.preventDefault();

        e.currentTarget.setPointerCapture?.(
          e.pointerId
        );

        onDragStart?.(
          e.clientX,
          e.clientY
        );
      }}
    >
      {/* SVG */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 220"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          ref={roughGroupRef}
          style={{
            pointerEvents: "none",
          }}
        />
      </svg>

      {/* 삭제 */}
      <button
        type="button"
        onPointerDown={(e) =>
          e.stopPropagation()
        }
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="
          absolute
          right-[6%]
          top-[4%]
          z-20
          flex
          items-center
          justify-center
          text-[12px]
          text-black
          transition
          hover:text-red-600
        "
      >
        ×
      </button>

      {/* 입력 */}
      <textarea
        value={memo.text}
        onChange={(e) =>
          onChange(
            memo.id,
            e.target.value
          )
        }
        placeholder="Write memo..."
        readOnly={isEditMode}
        onPointerDown={(e) => {
          if (isEditMode) {
            e.preventDefault();
          }
        }}
        className="
          absolute
          inset-0
          z-10
          h-full
          w-full
          resize-none
          bg-transparent
          p-[8%]
          text-[0.75vw]
          min-text-[11px]
          leading-[1.3]
          text-neutral-900
          outline-none
        "
      />
    </section>
  );
}

export default Memo;