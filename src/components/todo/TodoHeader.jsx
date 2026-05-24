import React, { useEffect, useRef } from "react";
import rough from "roughjs";
import { TODO_SEED } from "./TodoUtils";

const TodoHeader = ({
  currentListIndex,
  title,
  setTitle,
  isEditingTitle,
  setIsEditingTitle,
  addTodo,
  totalCount,
  completedCount,
}) => {
  const gRef = useRef(null);

  useEffect(() => {
    if (!gRef.current) return;
    gRef.current.innerHTML = "";
    const rc = rough.svg(gRef.current.ownerSVGElement);

    // 1. 고정 배경 그리기
    const rect = rc.rectangle(6.5, 6.5, 327, 372, {
      fill: "#fff",
      fillStyle: "solid",
      stroke: "#000",
      strokeWidth: 2,
      roughness: 2,
      bowing: 1,
      seed: TODO_SEED + currentListIndex * 1000,
    });
    gRef.current.appendChild(rect);

    // 2. 제목 텍스트 (수정 중이 아닐 때만 그림)
    if (!isEditingTitle) {
      const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      titleText.setAttribute("x", "26");
      titleText.setAttribute("y", "65");
      titleText.setAttribute("style", "font-family: 'Comic Sans MS', cursive; font-size: 31.2px; font-weight: bold; cursor: pointer;");
      titleText.textContent = title;
      titleText.onpointerdown = (e) => {
        e.stopPropagation();
        setIsEditingTitle(true);
      };
      titleText.onmousedown = (e) => e.stopPropagation();
      gRef.current.appendChild(titleText);
    }

    // 3. 추가 버튼 (+) 외형
    const plusCircle = rc.circle(303.6, 49.4, 23.4, {
      stroke: "#000", strokeWidth: 1, roughness: 1, seed: TODO_SEED + 1,
    });
    gRef.current.appendChild(plusCircle);
    gRef.current.appendChild(rc.line(295.8, 49.4, 311.4, 49.4, { strokeWidth: 2, seed: TODO_SEED + 2 }));
    gRef.current.appendChild(rc.line(303.6, 41.6, 303.6, 57.2, { strokeWidth: 2, seed: TODO_SEED + 3 }));

    const plusHitbox = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    plusHitbox.setAttribute("cx", "303.6");
    plusHitbox.setAttribute("cy", "49.4");
    plusHitbox.setAttribute("r", "19.5");
    plusHitbox.setAttribute("fill", "transparent");
    plusHitbox.setAttribute("pointer-events", "all");
    plusHitbox.setAttribute("data-no-drag", "true");
    plusHitbox.style.cursor = "pointer";
    plusHitbox.onpointerdown = (e) => {
      e.stopPropagation();
      addTodo();
    };
    plusHitbox.onmousedown = (e) => e.stopPropagation();
    gRef.current.appendChild(plusHitbox);

    // 4. 진행 상태 표시
    const isAllDone = totalCount > 0 && completedCount === totalCount;
    const statusText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    statusText.setAttribute("x", "170");
    statusText.setAttribute("y", "370");
    statusText.setAttribute("text-anchor", "middle");
    statusText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 14px; fill: ${isAllDone ? "#2ecc71" : "#888"}; font-weight: bold; pointer-events: none; transition: fill 0.3s;`);
    statusText.textContent = isAllDone ? "All done!" : `${completedCount} / ${totalCount} done`;
    gRef.current.appendChild(statusText);

  }, [addTodo, completedCount, currentListIndex, isEditingTitle, setIsEditingTitle, title, totalCount]);

  return (
    <g>
      <g ref={gRef} />
      {isEditingTitle && (
        <foreignObject x="26" y="20" width="250" height="45">
          <input
            defaultValue={title}
            data-no-drag="true"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTitle(e.target.value || "Todo");
                setIsEditingTitle(false);
              }
              if (e.key === "Escape") setIsEditingTitle(false);
            }}
            onBlur={(e) => {
              setTitle(e.target.value || "Todo");
              setIsEditingTitle(false);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ width: "100%", height: "100%", fontFamily: "'Comic Sans MS', cursive", fontSize: "31.2px", fontWeight: "bold", border: "none", outline: "none", background: "transparent", padding: 0, margin: 0 }}
          />
        </foreignObject>
      )}
    </g>
  );
};

export default TodoHeader;
