import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const TODO_SEED = 54321; // Todo 리스트 전용 고정 시드

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
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [title, setTitle] = useState("Todo");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTextClick = (index) => {
    setEditingIndex(index);
  };

  const addTodo = () => {
    const newTodos = [...todos, { text: "", completed: false }];
    setTodos(newTodos);
    setEditingIndex(newTodos.length - 1);
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    setEditingIndex(-1);
    setHoveredIndex(-1);
  };

  useEffect(() => {
    if (svgRef.current && listSvgRef.current) {
        svgRef.current.innerHTML = "";
        listSvgRef.current.innerHTML = "";

        const rc = rough.svg(svgRef.current);
        const rcList = rough.svg(listSvgRef.current);

        // 마우스 이동 시 해당 줄의 인덱스 파악
        listSvgRef.current.onmousemove = (e) => {
          const rect = listSvgRef.current.getBoundingClientRect();
          const scale = 340 / rect.width; // SVG viewBox 너비 기준 스케일 계산
          const mouseY = (e.clientY - rect.top) * scale;
          
          const index = Math.floor(mouseY / 45.5);
          if (index !== hoveredIndex && index >= 0 && index < todos.length) {
            setHoveredIndex(index);
          } else if (index < 0 || index >= todos.length) {
            setHoveredIndex(-1);
          }
        };

        listSvgRef.current.onmouseleave = () => setHoveredIndex(-1);

        // 1. 고정 배경 그리기 (Paper)
        const rect = rc.rectangle(6.5, 6.5, 327, 351, {
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
        svgRef.current.appendChild(plusHitbox);

        // 5. 진행 상태 표시 (고정 하단)
        const completedCount = todos.filter(todo => todo.completed).length;
        const totalCount = todos.length;
        const isAllDone = totalCount > 0 && completedCount === totalCount;

        const statusText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        statusText.setAttribute("x", "318");
        statusText.setAttribute("y", "350");
        statusText.setAttribute("text-anchor", "end");
        statusText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 14px; fill: ${isAllDone ? '#2ecc71' : '#888'}; font-weight: bold; pointer-events: none; transition: fill 0.3s;`);
        statusText.textContent = isAllDone ? "🎉 All done!" : `${completedCount} / ${totalCount} done`;
        svgRef.current.appendChild(statusText);

        // 4. 리스트 영역 그리기 (스크롤 가능 영역 내의 SVG)
        todos.forEach((todo, i) => {
          // y 좌표를 리스트 SVG 기준으로 조정 (첫 번째 줄이 리스트 영역 상단에 오도록)
          const y = 33.5 + (i * 45.5);
          
          // Main line
          const line = rcList.line(13, y, 327, y, {
            stroke: '#ccc',
            strokeWidth: 1,
            roughness: 0.5,
            seed: TODO_SEED + i + 10
          });
          listSvgRef.current.appendChild(line);

          if (i === editingIndex) {
            // Highlight background when editing (Highlighter effect)
            const highlight = rcList.rectangle(19.5, y - 36.4, 245, 36.4, {
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
            fo.setAttribute("y", (y - 36.4).toString());
            fo.setAttribute("width", "245");
            fo.setAttribute("height", "36.4");

            const input = document.createElement("input");
            input.value = todo.text;
            input.style.cssText = `
              width: 100%;
              height: 100%;
              font-family: 'Comic Sans MS', cursive;
              font-size: 23.4px;
              border: none;
              outline: none;
              background: transparent;
              padding: 0;
              margin: 0;
            `;

            const save = () => {
              const newTodos = [...todos];
              newTodos[i].text = input.value;
              setTodos(newTodos);
              setEditingIndex(-1);
            };

            input.onkeydown = (e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') setEditingIndex(-1);
            };
            input.onblur = save;

            fo.appendChild(input);
            listSvgRef.current.appendChild(fo);
            setTimeout(() => input.focus(), 0);
          } else {
            // Clickable area for text
            const textHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            textHitbox.setAttribute("x", "19.5");
            textHitbox.setAttribute("y", (y - 36.4).toString());
            textHitbox.setAttribute("width", "245");
            textHitbox.setAttribute("height", "36.4");
            textHitbox.setAttribute("fill", "transparent");
            textHitbox.style.cursor = "pointer";
            textHitbox.onpointerdown = (e) => {
              e.stopPropagation();
              handleTextClick(i);
            };
            listSvgRef.current.appendChild(textHitbox);

            if (todo.text) {
              const todoText = document.createElementNS("http://www.w3.org/2000/svg", "text");
              todoText.setAttribute("x", "23.4");
              todoText.setAttribute("y", y - 13);
              todoText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 23.4px; pointer-events: none; ${todo.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}`);
              todoText.textContent = todo.text;
              listSvgRef.current.appendChild(todoText);
            }
          }

          // 6. Delete button (X) - 마우스 오버 시에만 표시
          if (i === hoveredIndex) {
            const xPos = 272;
            const xSize = 14;
            const xLine1 = rcList.line(xPos, y - 26, xPos + xSize, y - 12, {
              stroke: '#e74c3c',
              strokeWidth: 2,
              roughness: 1.5,
              seed: TODO_SEED + i + 50
            });
            const xLine2 = rcList.line(xPos + xSize, y - 26, xPos, y - 12, {
              stroke: '#e74c3c',
              strokeWidth: 2,
              roughness: 1.5,
              seed: TODO_SEED + i + 60
            });
            listSvgRef.current.appendChild(xLine1);
            listSvgRef.current.appendChild(xLine2);

            const xHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            xHitbox.setAttribute("x", (xPos - 5).toString());
            xHitbox.setAttribute("y", (y - 32.5).toString());
            xHitbox.setAttribute("width", (xSize + 10).toString());
            xHitbox.setAttribute("height", "32.5");
            xHitbox.setAttribute("fill", "transparent");
            xHitbox.style.cursor = "pointer";
            xHitbox.onpointerdown = (e) => {
              e.stopPropagation();
              deleteTodo(i);
            };
            listSvgRef.current.appendChild(xHitbox);
          }

          // Checkbox on the right
          const checkbox = rcList.rectangle(298.4, y - 32.5, 23.4, 23.4, {
            roughness: 1.2,
            stroke: '#555',
            fill: todo.completed ? 'rgba(0,0,0,0.1)' : undefined,
            seed: TODO_SEED + i + 20
          });
          listSvgRef.current.appendChild(checkbox);

          // Checkbox Hitbox (Native SVG rect)
          const checkboxHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          checkboxHitbox.setAttribute("x", "298.4");
          checkboxHitbox.setAttribute("y", (y - 32.5).toString());
          checkboxHitbox.setAttribute("width", "32.5");
          checkboxHitbox.setAttribute("height", "32.5");
          checkboxHitbox.setAttribute("fill", "transparent");
          checkboxHitbox.style.cursor = "pointer";
          checkboxHitbox.onpointerdown = (e) => {
            e.stopPropagation();
            toggleTodo(i);
          };
          listSvgRef.current.appendChild(checkboxHitbox);

          // Checkmark (V shape)
          if (todo.completed) {
            const check1 = rcList.line(303, y - 22, 310, y - 13, { stroke: '#2ecc71', strokeWidth: 3, seed: TODO_SEED + i + 30 });
            const check2 = rcList.line(310, y - 13, 320, y - 28, { stroke: '#2ecc71', strokeWidth: 3, seed: TODO_SEED + i + 40 });
            listSvgRef.current.appendChild(check1);
            listSvgRef.current.appendChild(check2);
          }
        });
      }
  }, [todos, editingIndex, hoveredIndex, title, isEditingTitle]); // todos나 편집/호버 상태가 변경될 때마다 다시 그림

  const listHeight = Math.max(260, todos.length * 45.5 + 40);

  return (
    <div 
      className={className} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '340px', 
        aspectRatio: '340 / 364', 
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
      <svg ref={svgRef} viewBox="0 0 340 364" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      </svg>

      {/* 리스트 영역 (스크롤 가능) */}
      <div 
        className="todo-list-container"
        style={{ 
          position: 'absolute', 
          top: '24.7%', // 제목 영역 아래부터 시작하도록 비율 조정
          left: '6%',   // 왼쪽 외곽선 안쪽으로 배치
          right: '8%',  // 오른쪽 외곽선 및 스크롤바 여유 공간 확보
          height: '71%', 
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
