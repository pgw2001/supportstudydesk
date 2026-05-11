import { useEffect, useRef, useState, useCallback } from "react";
import rough from "roughjs";

const TODO_SEED = 54321; // Todo 리스트 전용 고정 시드

// 헬퍼 함수를 컴포넌트 외부로 분리하여 의존성 안정화
const getLineCount = (text) => {
  if (!text) return 1;
  const maxWidth = 240; // 실제 가용 너비(245px)에서 여유분을 뺀 기준
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "23.4px 'Comic Sans MS', cursive"; // 실제 적용된 폰트와 크기 기준
  
  const cleanText = text.replace(/\n/g, "");
  let lines = 1;
  let currentLineWidth = 0;

  for (let i = 0; i < cleanText.length; i++) {
    const charWidth = context.measureText(cleanText[i]).width;
    if (currentLineWidth + charWidth > maxWidth) {
      lines++;
      currentLineWidth = charWidth;
    } else {
      currentLineWidth += charWidth;
    }
  }
  return lines;
};

function TodoList({className}) {
  const svgRef = useRef(null);
  const listSvgRef = useRef(null);
  // 5개의 투두 항목을 위한 상태 관리
  const [todos, setTodos] = useState([
    { text: "", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
  ]);

  const [editingIndex, setEditingIndex] = useState(-1);
  // Ref to store the X button elements for direct DOM manipulation
  const xButtonElementsRef = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [title, setTitle] = useState("Todo");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTextClick = useCallback((index) => {
    setEditingIndex(index);
    setHoveredIndex(-1); // 수정 시작 시 호버 상태 초기화
  }, []);

  const addTodo = useCallback(() => {
    setTodos(prev => [...prev, { text: "", completed: false }]);
    setEditingIndex(prev => todos.length); // 새 항목 인덱스로 설정
    setHoveredIndex(-1);
  }, [todos.length]);

  const toggleTodo = useCallback((index) => {
    setTodos(prev => {
      const next = [...prev];
      next[index].completed = !next[index].completed;
      return next;
    });
  }, []);

  const deleteTodo = useCallback((index) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
    setEditingIndex(-1);
    setHoveredIndex(-1);
  }, []);

  // Ref to store the roughjs instance for listSvgRef, so it can be used outside the main useEffect
  const rcListRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && listSvgRef.current) {
        svgRef.current.innerHTML = "";
        listSvgRef.current.innerHTML = "";

        const rc = rough.svg(svgRef.current);
        rcListRef.current = rough.svg(listSvgRef.current); // Store rcList instance

        // 마우스 이동 시 해당 줄의 인덱스 파악
        listSvgRef.current.onmousemove = (e) => {
          // 입력 중(editingIndex !== -1)일 때는 호버 상태를 변경하지 않음 (간섭 차단)
          if (editingIndex !== -1) return;

          const rect = listSvgRef.current.getBoundingClientRect();
          const scale = 340 / rect.width; // SVG viewBox 너비 기준 스케일 계산
          const mouseY = (e.clientY - rect.top) * scale;
          
          let accumulatedHeight = 0;
          let foundIndex = -1;
          for (let i = 0; i < todos.length; i++) {
            const h = getLineCount(todos[i].text) * 45.5;
            if (mouseY >= accumulatedHeight && mouseY < accumulatedHeight + h) {
              foundIndex = i;
              break;
            }
            accumulatedHeight += h;
          }
          
          setHoveredIndex(prev => {
            if (foundIndex !== prev) return foundIndex;
            return prev;
          });
        };

        listSvgRef.current.onmouseleave = () => setHoveredIndex(-1);

        // 1. 고정 배경 그리기 (Paper)
        const rect = rc.rectangle(6.5, 6.5, 327, 372, {
          fill: '#fff',
          fillStyle: 'solid',
          stroke: '#000',
          strokeWidth: 2,
          roughness: 2,
          bowing: 1,
          seed: TODO_SEED
        });
        svgRef.current.appendChild(rect);

        // 2. 제목 영역 (고정)
        if (isEditingTitle) {
          const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
          fo.setAttribute("x", "26");
          fo.setAttribute("y", "20");
          fo.setAttribute("width", "250");
          fo.setAttribute("height", "45");

          const input = document.createElement("input");
          input.value = title;
          input.style.cssText = `
            width: 100%;
            height: 100%;
            font-family: 'Comic Sans MS', cursive;
            font-size: 31.2px;
            font-weight: bold;
            border: none;
            outline: none;
            background: transparent;
            padding: 0;
            margin: 0;
          `;

          const saveTitle = () => {
            setTitle(input.value || "Todo");
            setIsEditingTitle(false);
          };

          input.onkeydown = (e) => {
            if (e.key === 'Enter') saveTitle();
            if (e.key === 'Escape') setIsEditingTitle(false);
          };
          input.onblur = saveTitle;
          input.onpointerdown = (e) => e.stopPropagation();
          input.onmousedown = (e) => e.stopPropagation();

          fo.appendChild(input);
          svgRef.current.appendChild(fo);
          setTimeout(() => input.focus(), 0);
        } else {
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
          svgRef.current.appendChild(titleText);
        }

        // 3. 추가 버튼 (+) (고정)
        const plusCircle = rc.circle(303.6, 49.4, 23.4, {
          stroke: '#000',
          strokeWidth: 1,
          roughness: 1,
          seed: TODO_SEED + 1
        });
        svgRef.current.appendChild(plusCircle);

        const plusLine1 = rc.line(295.8, 49.4, 311.4, 49.4, { strokeWidth: 2, seed: TODO_SEED + 2 });
        const plusLine2 = rc.line(303.6, 41.6, 303.6, 57.2, { strokeWidth: 2, seed: TODO_SEED + 3 });
        svgRef.current.appendChild(plusLine1);
        svgRef.current.appendChild(plusLine2);

        // Plus Button Hitbox (Invisible)
        const plusHitbox = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        plusHitbox.setAttribute("cx", "303.6");
        plusHitbox.setAttribute("cy", "49.4");
        plusHitbox.setAttribute("r", "19.5");
        plusHitbox.setAttribute("fill", "transparent");
        plusHitbox.style.cursor = "pointer";
        plusHitbox.onpointerdown = (e) => {
          e.stopPropagation();
          addTodo();
        };
        plusHitbox.onmousedown = (e) => e.stopPropagation();
        svgRef.current.appendChild(plusHitbox);

        // 5. 진행 상태 표시 (고정 하단)
        const completedCount = todos.filter(todo => todo.completed).length;
        const totalCount = todos.length;
        const isAllDone = totalCount > 0 && completedCount === totalCount;

        const statusText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        statusText.setAttribute("x", "170");
        statusText.setAttribute("y", "370");
        statusText.setAttribute("text-anchor", "middle");
        statusText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 16px; fill: ${isAllDone ? '#2ecc71' : '#888'}; font-weight: bold; pointer-events: none; transition: fill 0.3s;`);
        statusText.textContent = isAllDone ? "🎉 All done!" : `${completedCount} / ${totalCount} done`;
        svgRef.current.appendChild(statusText);

        let currentY = 33.5; // 첫 번째 줄의 기준선(밑줄 위치)

        // 4. 리스트 영역 그리기 (스크롤 가능 영역 내의 SVG)
        todos.forEach((todo, i) => { // hoveredIndex removed from dependency array, so this loop won't re-run on mouse move
          const numLines = getLineCount(todo.text);
          const firstLineY = currentY;
          const totalItemHeight = numLines * 45.5;
          
          // 각 줄마다 밑줄 그리기
          for (let l = 0; l < numLines; l++) {
            const lineY = firstLineY + (l * 45.5);
            const line = rcListRef.current.line(13, lineY, 327, lineY, {
              stroke: '#ccc',
              strokeWidth: 1,
              roughness: 0.5,
              seed: TODO_SEED + i + l + 10
            });
            listSvgRef.current.appendChild(line);
          }

          if (i === editingIndex) {
            // Highlight background when editing (Highlighter effect)
            const highlight = rcListRef.current.rectangle(19.5, firstLineY - 36.4, 245, totalItemHeight, {
              fill: 'rgba(255, 249, 196, 0.8)', // Light yellow highlight
              fillStyle: 'solid',
              stroke: 'none',
              roughness: 1.5,
              seed: TODO_SEED + i + 1000
            });
            listSvgRef.current.appendChild(highlight);

            // Input field using foreignObject
            const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
            fo.setAttribute("x", "19.5");
            fo.setAttribute("y", (firstLineY - 36.4).toString());
            fo.setAttribute("width", "245");
            fo.setAttribute("height", totalItemHeight.toString());

            const input = document.createElement("textarea");
            input.value = todo.text;
            input.style.cssText = `
              width: 100%;
              height: 100%;
              font-family: 'Comic Sans MS', cursive;
              font-size: 23.4px;
              line-height: 45.5px;
              border: none;
              outline: none;
              background: transparent;
              padding: 0;
              margin: 0;
              resize: none;
              overflow: hidden;
              word-break: break-all;
              white-space: pre-wrap;
            `;

            // 입력 중에는 절대로 setTodos를 호출하지 않아 끊김을 방지합니다.
            input.oninput = (e) => {
              const val = e.target.value.replace(/\n/g, ""); // 줄바꿈 문자 제거
              const lines = getLineCount(val);
              const newHeight = lines * 45.5;
              
              // DOM을 직접 조작하여 입력창 높이만 실시간으로 늘려줍니다.
              input.style.height = newHeight + 'px';
              fo.setAttribute("height", newHeight.toString());
            };

            input.onkeydown = (e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // 엔터는 무시하거나 줄바꿈만 방지
                input.blur(); // 엔터 시 저장을 원하시면 blur 호출, 아니면 그냥 두셔도 됩니다.
              }
              if (e.key === 'Escape') setEditingIndex(-1);
            };

            // 오직 다른 곳을 클릭했을 때(blur)만 상태를 저장하고 수정을 종료합니다.
            input.onblur = () => {
              const newTodos = [...todos];
              const finalValue = input.value.replace(/\n/g, "");
              newTodos[i].text = finalValue;
              setTodos(newTodos);
              setEditingIndex(-1);
            };
            input.onpointerdown = (e) => e.stopPropagation();
            input.onmousedown = (e) => e.stopPropagation();

            fo.appendChild(input);
            listSvgRef.current.appendChild(fo);
            setTimeout(() => input.focus(), 0);
          } else {
            if (todo.text) {
              const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
              fo.setAttribute("x", "23.4");
              fo.setAttribute("y", (firstLineY - 36.4).toString());
              fo.setAttribute("width", "245");
              fo.setAttribute("height", totalItemHeight.toString());
              
              const div = document.createElement("div");
              div.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 23.4px; line-height: 45.5px; pointer-events: none; word-break: break-all; white-space: pre-wrap; ${todo.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}`);
              div.textContent = todo.text;
              
              fo.appendChild(div);
              listSvgRef.current.appendChild(fo);
            }

            // Clickable area for text (텍스트 레이어보다 나중에 추가하여 항상 클릭이 가능하도록 함)
            const textHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            textHitbox.setAttribute("x", "19.5");
            textHitbox.setAttribute("y", (firstLineY - 36.4).toString());
            textHitbox.setAttribute("width", "245");
            textHitbox.setAttribute("height", totalItemHeight.toString());
            textHitbox.setAttribute("fill", "transparent");
            textHitbox.style.cursor = "pointer";
            textHitbox.onpointerdown = (e) => {
              e.stopPropagation();
              handleTextClick(i);
            };
            textHitbox.onmousedown = (e) => e.stopPropagation();
            listSvgRef.current.appendChild(textHitbox);
          }

          // Checkbox on the right
          const checkbox = rcListRef.current.rectangle(298.4, firstLineY - 32.5, 23.4, 23.4, {
            roughness: 1.2,
            stroke: '#555',
            fill: todo.completed ? 'rgba(0,0,0,0.1)' : undefined,
            seed: TODO_SEED + i + 20
          });
          listSvgRef.current.appendChild(checkbox);

          // Checkbox Hitbox (Native SVG rect)
          const checkboxHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          checkboxHitbox.setAttribute("x", "298.4");
          checkboxHitbox.setAttribute("y", (firstLineY - 32.5).toString());
          checkboxHitbox.setAttribute("width", "32.5");
          checkboxHitbox.setAttribute("height", "32.5");
          checkboxHitbox.setAttribute("fill", "transparent");
          checkboxHitbox.style.cursor = "pointer";
          checkboxHitbox.onpointerdown = (e) => {
            e.stopPropagation();
            toggleTodo(i);
          };
          checkboxHitbox.onmousedown = (e) => e.stopPropagation();
          listSvgRef.current.appendChild(checkboxHitbox);

          // Checkmark (V shape)
          if (todo.completed) {
            const check1 = rcListRef.current.line(303, firstLineY - 22, 310, firstLineY - 13, { stroke: '#2ecc71', strokeWidth: 3, seed: TODO_SEED + i + 30 });
            const check2 = rcListRef.current.line(310, firstLineY - 13, 320, firstLineY - 28, { stroke: '#2ecc71', strokeWidth: 3, seed: TODO_SEED + i + 40 });
            listSvgRef.current.appendChild(check1);
            listSvgRef.current.appendChild(check2);
          }

          currentY += totalItemHeight;
        });
      }
  }, [todos, editingIndex, title, isEditingTitle, handleTextClick, toggleTodo, addTodo]); // 의존성에서 getLineCount 제거 및 함수 안정화

  // Separate useEffect for drawing/clearing the X button
  useEffect(() => {
    if (!listSvgRef.current || !rcListRef.current) return;

    // Clear previous X button elements
    xButtonElementsRef.current.forEach(el => el.remove());
    xButtonElementsRef.current = [];

    if (hoveredIndex !== -1 && editingIndex === -1) { // Only show X button if not editing
      const todo = todos[hoveredIndex];
      if (!todo) return;

      let currentY = 33.5;
      for (let i = 0; i < hoveredIndex; i++) {
        currentY += getLineCount(todos[i].text) * 45.5;
      }
      const firstLineY = currentY;

      const xPos = 272;
      const xSize = 14;
      const xLine1 = rcListRef.current.line(xPos, firstLineY - 26, xPos + xSize, firstLineY - 12, {
        stroke: '#e74c3c',
        strokeWidth: 2,
        roughness: 1.5,
        seed: TODO_SEED + hoveredIndex + 50
      });
      const xLine2 = rcListRef.current.line(xPos + xSize, firstLineY - 26, xPos, firstLineY - 12, {
        stroke: '#e74c3c',
        strokeWidth: 2,
        roughness: 1.5,
        seed: TODO_SEED + hoveredIndex + 60
      });
      const xHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      xHitbox.setAttribute("x", (xPos - 5).toString());
      xHitbox.setAttribute("y", (firstLineY - 32.5).toString());
      xHitbox.setAttribute("width", (xSize + 10).toString());
      xHitbox.setAttribute("height", "32.5");
      xHitbox.setAttribute("fill", "transparent");
      xHitbox.style.cursor = "pointer";
      xHitbox.onpointerdown = (e) => {
        e.stopPropagation();
        deleteTodo(hoveredIndex);
      };
      xHitbox.onmousedown = (e) => e.stopPropagation();
      listSvgRef.current.appendChild(xLine1);
      listSvgRef.current.appendChild(xLine2);
      listSvgRef.current.appendChild(xHitbox);
      xButtonElementsRef.current = [xLine1, xLine2, xHitbox];
    }
  }, [hoveredIndex, editingIndex, todos, deleteTodo]); // Dependencies for X button

  const totalLines = todos.reduce((acc, todo) => acc + getLineCount(todo.text), 0);
  const listHeight = Math.max(260, totalLines * 45.5 + 40);

  return (
    <div 
      className={className} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '340px', 
        aspectRatio: '340 / 385', 
        overflow: 'hidden' 
      }}
    >
      <style>
        {`
          .todo-list-container::-webkit-scrollbar {
            width: 4px;
          }
          .todo-list-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .todo-list-container::-webkit-scrollbar-thumb {
            background: #dbdbdb;
            border-radius: 10px;
          }
          .todo-list-container {
            scrollbar-width: thin;
            scrollbar-color: #dbdbdb transparent;
          }
        `}
      </style>
      {/* 배경 및 제목 레이어 (고정) */}
      <svg ref={svgRef} viewBox="0 0 340 385" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      </svg>

      {/* 리스트 영역 (스크롤 가능) */}
      <div 
        className="todo-list-container"
        style={{ 
          position: 'absolute', 
          top: '23.5%', // 제목 영역 아래부터 시작하도록 비율 조정
          left: '6%',   // 왼쪽 외곽선 안쪽으로 배치
          right: '8%',  // 오른쪽 외곽선 및 스크롤바 여유 공간 확보
          height: '66%', 
          overflowY: 'auto', 
          overflowX: 'hidden',
          zIndex: 1,
        }}
      >
        <svg ref={listSvgRef} viewBox={`0 0 340 ${listHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        </svg>
      </div>
    </div>
  );
}

export default TodoList;
