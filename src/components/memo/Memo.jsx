import { useEffect, useRef } from "react";
import rough from "roughjs";

function Memo({
  memo,
  onChange,
  onDragStart,
  onDelete,
  isEditMode,
  index,
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
        group
        absolute
        select-none
        w-[60%]
        h-[66%]
        min-w-[100px]
        min-h-[110px]
      "
      style={{
        left: `${memo.xPercent * 100}%`,
        top: `${memo.yPercent * 100}%`,
        transform: `
          translate(-50%, -50%)
          rotate(${memo.rotation}deg)
        `,
        touchAction: "none",
        userSelect: "none",
        cursor: isEditMode
          ? "grab"
          : "default",
        // Draggable의 투명 덮개(z-9999)보다 높게 설정하여 
        // 개별 메모가 이벤트를 직접 받을 수 있게 함
        zIndex: 10000 + index, 
      }}

      // 메모 드래그 시작
      onPointerDown={(e) => {
        if (!isEditMode) return;
        e.stopPropagation();
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

      {/* 삭제 버튼 */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="
          absolute
          right-[2%]
          top-[1%]
          z-20
          flex
          items-center
          justify-center
          w-[24px] h-[24px]
          text-black
          opacity-0
          group-hover:opacity-100
          transition-opacity
          hover:text-red-600
        "
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-10 h-10" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
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
        className={`
          absolute
          top-[16%]
          left-[10%]
          w-[80%]
          h-[74%]
          z-10
          resize-none
          bg-transparent
          p-0
          text-[14px]
          leading-[1.3]
          text-neutral-900
          outline-none
          break-words
          overflow-y-auto
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          ${isEditMode ? "pointer-events-none" : "pointer-events-auto"}
        `}
      />
    </section>
  );
}

export default Memo;