import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import rough from "roughjs";
import { TODO_SEED, getLineCount } from "./TodoUtils";
import TodoItem from "./TodoItem";

function TodoList({className}) {
  const svgRef = useRef(null);
  const listSvgRef = useRef(null);

  // 5揶쏆뮇????紐???????袁る립 ?怨밴묶 ?온??
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

  const handleTextClick = useCallback((index) => {
    setEditingIndex(index);
    setHoveredIndex(-1); // ??륁젟 ??뽰삂 ???紐껋쒔 ?怨밴묶 ?λ뜃由??
  }, []);

  const addTodo = useCallback(() => {
    setTodos(prev => {
      const next = [...prev, { text: "", completed: false }];
      setEditingIndex(next.length - 1);
      return next;
    });
    setHoveredIndex(-1);
  }, []);

  const toggleTodo = useCallback((index) => {
    setTodos(prev => {
      const next = [...prev];
      next[index] = { ...next[index], completed: !next[index].completed };
      return next;
    });
  }, []);

  const deleteTodo = useCallback((index) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
    setEditingIndex(-1);
    setHoveredIndex(-1);
  }, []);

  // Ref to store the roughjs instance for listSvgRef, so it can be used outside the main useEffect
  // 筌띾뜆?????猷?揶쏅Ŋ? 嚥≪뮇彛?
  const handleMouseMove = useCallback((e) => {
    if (editingIndex !== -1) return;
    if (!e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scale = 340 / rect.width;
    // ??쎄쾿嚥??袁⑺뒄(scrollTop)???酉鍮??SVG ??????類μ넇???ル슦紐당몴???댁뱽 ????됰뮸??덈뼄.
    const mouseY = (e.clientY - rect.top + e.currentTarget.scrollTop) * scale;

    let itemTop = 45 - 36.4;
    let foundIndex = -1;
    for (let i = 0; i < todos.length; i++) {
      const h = getLineCount(todos[i].text) * 45.5;
      if (mouseY >= itemTop && mouseY < itemTop + h) {
        foundIndex = i;
        break;
      }
      itemTop += h;
    }

    setHoveredIndex(prev => {
      if (foundIndex !== prev) return foundIndex;
      return prev;
    });
  }, [editingIndex, todos]);

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  useEffect(() => {

    if (svgRef.current) {
      svgRef.current.innerHTML = "";
      const rc = rough.svg(svgRef.current);

      // 1. ?⑥쥙??獄쏄퀗瑗?域밸챶?곫묾?(Paper)
      const rect = rc.rectangle(6.5, 6.5, 327, 372, {
        fill: '#fff', fillStyle: 'solid', stroke: '#000', strokeWidth: 2, roughness: 2, bowing: 1, seed: TODO_SEED
      });
      svgRef.current.appendChild(rect);

      // 2. ??뺛걠 ?怨몃열 (?⑥쥙??
      if (isEditingTitle) {
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("x", "26"); fo.setAttribute("y", "20"); fo.setAttribute("width", "250"); fo.setAttribute("height", "45");
        const input = document.createElement("input");
        input.value = title;
        input.style.cssText = `width: 100%; height: 100%; font-family: 'Comic Sans MS', cursive; font-size: 31.2px; font-weight: bold; border: none; outline: none; background: transparent; padding: 0; margin: 0;`;
        const saveTitle = () => { setTitle(input.value || "Todo"); setIsEditingTitle(false); };
        input.onkeydown = (e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setIsEditingTitle(false); };
        input.onblur = saveTitle;
        input.onpointerdown = (e) => e.stopPropagation();
        input.onmousedown = (e) => e.stopPropagation();
        input.dataset.noDrag = "true";
        fo.appendChild(input);
        svgRef.current.appendChild(fo);
        setTimeout(() => input.focus(), 0);
      } else {
        const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        titleText.setAttribute("x", "26"); titleText.setAttribute("y", "65");
        titleText.setAttribute("style", "font-family: 'Comic Sans MS', cursive; font-size: 31.2px; font-weight: bold; cursor: pointer;");
        titleText.textContent = title;
        titleText.onpointerdown = (e) => { e.stopPropagation(); setIsEditingTitle(true); };
        titleText.onmousedown = (e) => e.stopPropagation();
        svgRef.current.appendChild(titleText);
      }

      // 3. ?곕떽? 甕곌쑵??(+) (?⑥쥙??
      const plusCircle = rc.circle(303.6, 49.4, 23.4, { stroke: '#000', strokeWidth: 1, roughness: 1, seed: TODO_SEED + 1 });
      svgRef.current.appendChild(plusCircle);
      const plusLine1 = rc.line(295.8, 49.4, 311.4, 49.4, { strokeWidth: 2, seed: TODO_SEED + 2 });
      const plusLine2 = rc.line(303.6, 41.6, 303.6, 57.2, { strokeWidth: 2, seed: TODO_SEED + 3 });
      svgRef.current.appendChild(plusLine1);
      svgRef.current.appendChild(plusLine2);
      const plusHitbox = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      plusHitbox.setAttribute("cx", "303.6"); plusHitbox.setAttribute("cy", "49.4"); plusHitbox.setAttribute("r", "19.5");
      plusHitbox.setAttribute("fill", "transparent"); plusHitbox.style.cursor = "pointer";
      plusHitbox.setAttribute("pointer-events", "all");
      plusHitbox.setAttribute("data-no-drag", "true");
      plusHitbox.onpointerdown = (e) => { e.stopPropagation(); addTodo(); };
      plusHitbox.onmousedown = (e) => e.stopPropagation();
      svgRef.current.appendChild(plusHitbox);

      // 5. 筌욊쑵六??怨밴묶 ??뽯뻻 (?⑥쥙????롫뼊)
      const isAllDone = totalCount > 0 && completedCount === totalCount;
      const statusText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      statusText.setAttribute("x", "170"); statusText.setAttribute("y", "370"); statusText.setAttribute("text-anchor", "middle");
      statusText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 14px; fill: ${isAllDone ? '#2ecc71' : '#888'}; font-weight: bold; pointer-events: none; transition: fill 0.3s;`);
      statusText.textContent = isAllDone ? "???All done!" : `${completedCount} / ${totalCount} done`;
      svgRef.current.appendChild(statusText);
    }
  }, [completedCount, totalCount, isEditingTitle, title, addTodo]);

  const totalLines = todos.reduce((acc, t) => acc + getLineCount(t.text), 0);
  const listHeight = Math.max(260, totalLines * 45.5 + 60);

  const todoPositions = useMemo(() => {
    return todos.map((_, index) =>
      45 + todos
        .slice(0, index)
        .reduce((height, todo) => height + getLineCount(todo.text) * 45.5, 0)
    );
  }, [todos]);
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
      {/* 獄쏄퀗瑗?獄???뺛걠 ??됱뵠??(?⑥쥙?? */}
      <svg ref={svgRef} viewBox="0 0 340 385" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      </svg>

      {/* ?귐딅뮞???怨몃열 (??쎄쾿嚥?揶쎛?? */}
      <div 
        className="todo-list-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(-1)}
        style={{ 
          position: 'absolute', 
          top: '23.5%', // ??뺛걠 ?怨몃열 ?袁⑥삋?봔????뽰삂??롫즲嚥???쑴??鈺곌퀣??
          left: '6%',   // ??긱걹 ?硫몃궦????됥걹??곗쨮 獄쏄퀣??
          right: '8%',  // ??삘뀲筌??硫몃궦??獄???쎄쾿嚥▲끇而???? ?⑤벀而??類ｋ궖
          height: '66%', 
          overflowY: 'auto', 
          overflowX: 'hidden',
          zIndex: 1,
        }}
      >
        <svg viewBox={`0 0 340 ${listHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <g ref={listSvgRef}>
            {todos.map((todo, i) => {
              return (
                <TodoItem 
                  key={i}
                  todo={todo}
                  index={i}
                  firstLineY={todoPositions[i]}
                  isEditing={i === editingIndex}
                  isHovered={i === hoveredIndex}
                  handleTextClick={handleTextClick}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  setTodos={setTodos}
                  setEditingIndex={setEditingIndex}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default TodoList;
