import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { TODO_SEED, getLineCount } from './TodoUtils';

const TodoItem = ({ 
  todo, index, firstLineY, isEditing, isHovered,
  handleTextClick, toggleTodo, deleteTodo, setTodos, setEditingIndex
}) => {
  const gRef = useRef(null);
  const numLines = getLineCount(todo.text);
  const totalItemHeight = numLines * 45.5;

  useEffect(() => {
    if (!gRef.current) return;
    gRef.current.innerHTML = "";
    const rc = rough.svg(gRef.current.ownerSVGElement);

    // 1. 밑줄 그리기
    for (let l = 0; l < numLines; l++) {
      const lineY = firstLineY + (l * 45.5);
      const line = rc.line(13, lineY, 327, lineY, {
        stroke: '#ccc', strokeWidth: 1, roughness: 0.5, seed: TODO_SEED + index + l + 10
      });
      line.setAttribute("style", "pointer-events: none;");
      gRef.current.appendChild(line);
    }

    // 2. 하이라이트 (수정 중일 때)
    if (isEditing) {
      const highlight = rc.rectangle(19.5, firstLineY - 36.4, 245, totalItemHeight, {
        fill: 'rgba(255, 249, 196, 0.8)', fillStyle: 'solid', stroke: 'none', roughness: 1.5, seed: TODO_SEED + index + 1000
      });
      highlight.setAttribute("style", "pointer-events: none;");
      gRef.current.appendChild(highlight);
    }

    // 3. 텍스트 표시 영역 (수정 중이 아닐 때)
    if (!isEditing) {
      const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
      fo.setAttribute("x", "23.4");
      fo.setAttribute("y", (firstLineY - 36.4).toString());
      fo.setAttribute("width", "245");
      fo.setAttribute("height", totalItemHeight.toString());

      if (todo.text) {
        const div = document.createElement("div");
        div.setAttribute("style", `font-family: 'Comic Sans MS', 'Pretendard', cursive; font-size: 23.4px; line-height: 45.5px; pointer-events: none; word-break: break-all; white-space: pre-wrap; ${todo.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}`);
        div.textContent = todo.text;
        fo.appendChild(div);
        gRef.current.appendChild(fo);
      }
    }

    // 4. 체크박스 외형
    const checkbox = rc.rectangle(298.4, firstLineY - 32.5, 23.4, 23.4, {
      roughness: 1.2, stroke: '#555', fill: todo.completed ? 'rgba(0,0,0,0.1)' : undefined, seed: TODO_SEED + index + 20
    });
    checkbox.setAttribute("style", "pointer-events: none;");
    gRef.current.appendChild(checkbox);

    // 5. 체크마크 (V)
    if (todo.completed) {
      const check1 = rc.line(303, firstLineY - 22, 310, firstLineY - 13, { stroke: '#2ecc71', strokeWidth: 3, seed: TODO_SEED + index + 30 });
      const check2 = rc.line(310, firstLineY - 13, 320, firstLineY - 28, { stroke: '#2ecc71', strokeWidth: 3, seed: TODO_SEED + index + 40 });
      check1.setAttribute("style", "pointer-events: none;");
      check2.setAttribute("style", "pointer-events: none;");
      gRef.current.appendChild(check1);
      gRef.current.appendChild(check2);
    }

    // 6. 삭제 버튼 (X) - 호버 시 표시
    if (isHovered && !isEditing) {
      const xPos = 272; const xSize = 14;
      const xLine1 = rc.line(xPos, firstLineY - 26, xPos + xSize, firstLineY - 12, { stroke: '#e74c3c', strokeWidth: 2, roughness: 1.5, seed: TODO_SEED + index + 50 });
      const xLine2 = rc.line(xPos + xSize, firstLineY - 26, xPos, firstLineY - 12, { stroke: '#e74c3c', strokeWidth: 2, roughness: 1.5, seed: TODO_SEED + index + 60 });
      xLine1.setAttribute("style", "pointer-events: none;");
      xLine2.setAttribute("style", "pointer-events: none;");
      gRef.current.appendChild(xLine1);
      gRef.current.appendChild(xLine2);

      const xHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      xHitbox.setAttribute("x", (xPos - 5).toString()); xHitbox.setAttribute("y", (firstLineY - 32.5).toString());
      xHitbox.setAttribute("width", (xSize + 10).toString()); xHitbox.setAttribute("height", "32.5");
      xHitbox.setAttribute("fill", "white"); xHitbox.setAttribute("fill-opacity", "0");
      xHitbox.setAttribute("pointer-events", "all");
      xHitbox.setAttribute("data-no-drag", "true");
      xHitbox.style.cursor = "pointer";
      xHitbox.onpointerdown = (e) => { e.stopPropagation(); deleteTodo(index); };
      xHitbox.onmousedown = (e) => e.stopPropagation();
      gRef.current.appendChild(xHitbox);
    }

    // --- 최상단 클릭 히트박스 레이어 (중요: 가장 마지막에 추가) ---

    // 텍스트 클릭 히트박스 (입력 모드 진입용)
    if (!isEditing) {
      const textHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      textHitbox.setAttribute("x", "19.5");
      textHitbox.setAttribute("y", (firstLineY - 36.4).toString());
      textHitbox.setAttribute("width", "245");
      textHitbox.setAttribute("height", totalItemHeight.toString());
      textHitbox.setAttribute("fill", "#fff");
      textHitbox.setAttribute("fill-opacity", "0");
      textHitbox.setAttribute("pointer-events", "all");
      textHitbox.setAttribute("data-no-drag", "true");
      textHitbox.style.cursor = "pointer";
      textHitbox.onpointerdown = (e) => { e.stopPropagation(); handleTextClick(index); };
      textHitbox.onmousedown = (e) => e.stopPropagation();
      gRef.current.appendChild(textHitbox);
    }

    // 체크박스 클릭 히트박스
    const checkboxHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    checkboxHitbox.setAttribute("x", "298.4");
    checkboxHitbox.setAttribute("y", (firstLineY - 32.5).toString());
    checkboxHitbox.setAttribute("width", "32.5");
    checkboxHitbox.setAttribute("height", "32.5");
    checkboxHitbox.setAttribute("fill", "#fff");
    checkboxHitbox.setAttribute("fill-opacity", "0");
    checkboxHitbox.setAttribute("pointer-events", "all");
    checkboxHitbox.setAttribute("data-no-drag", "true");
    checkboxHitbox.style.cursor = "pointer";
    checkboxHitbox.onpointerdown = (e) => {
      e.stopPropagation();
      toggleTodo(index);
    };
    checkboxHitbox.onmousedown = (e) => e.stopPropagation();
    gRef.current.appendChild(checkboxHitbox);
  }, [todo, firstLineY, isEditing, isHovered, numLines, totalItemHeight, index, deleteTodo, toggleTodo, handleTextClick]);

  return (
    <g>
      <g ref={gRef} />
      {!isEditing && (
        <rect
          x="19.5"
          y={firstLineY - 36.4}
          width="245"
          height={totalItemHeight}
          fill="transparent"
          pointerEvents="all"
          data-no-drag="true"
          style={{ cursor: 'pointer' }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleTextClick(index);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      )}
      <rect
        x="298.4"
        y={firstLineY - 32.5}
        width="32.5"
        height="32.5"
        fill="transparent"
        pointerEvents="all"
        data-no-drag="true"
        style={{ cursor: 'pointer' }}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleTodo(index);
        }}
        onMouseDown={(e) => e.stopPropagation()}
      />
      {isEditing && (
        <foreignObject x="19.5" y={firstLineY - 36.4} width="245" height={totalItemHeight}>
          <textarea
            value={todo.text}
            autoFocus
            onInput={(e) => {
              e.target.style.height = (getLineCount(e.target.value) * 45.5) + 'px';
            }}
            onChange={(e) => {
              const val = e.target.value.replace(/\n/g, "");
              setTodos(prev => {
                const next = [...prev];
                next[index] = { ...next[index], text: val };
                return next;
              });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
              if (e.key === 'Escape') setEditingIndex(-1);
            }}
            onBlur={() => setEditingIndex(-1)}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            data-no-drag="true"
            style={{
              width: '100%', height: '100%', fontFamily: "'Comic Sans MS', 'Pretendard', cursive",
              fontSize: '23.4px', lineHeight: '45.5px', border: 'none', outline: 'none',
              background: 'transparent', padding: 0, margin: 0, resize: 'none',
              overflow: 'hidden', wordBreak: 'break-all', whiteSpace: 'pre-wrap'
            }}
          />
        </foreignObject>
      )}
    </g>
  );
};

export default TodoItem;
