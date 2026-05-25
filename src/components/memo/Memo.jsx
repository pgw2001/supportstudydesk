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
        w-[80%]
        h-[88%]
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
        // Draggable의 투명 덮개(z-9999)보다 낮게 설정하여 
        // 배치 수정 모드에서 위젯 전체가 드래그되도록 함 (기존 Date.now()는 너무 큼)
        zIndex: index + 1, 
      }}

      // 부모 Draggable 이벤트 차단
      onMouseDownCapture={(e) => {
        if (!isEditMode) return;

        e.stopPropagation();
      }}

      // 메모 드래그 시작
      onMouseDown={(e) => {
        if (!isEditMode) return;

        e.preventDefault();
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
        onMouseDown={(e) => {
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
        onMouseDown={(e) => {
          if (isEditMode) {
            e.preventDefault();
            e.stopPropagation();
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
          pt-[18%]
          px-[12%]
          pb-[10%]
          text-[14px]
          leading-[1.3]
          text-neutral-900
          outline-none
        "
      />
    </section>
  );
}

export default Memo;