import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const TODO_SEED = 54321; // Todo 리스트 전용 고정 시드

function TodoList({className}) {
  const svgRef = useRef(null);
  // 5개의 투두 항목을 위한 상태 관리
  const [todos, setTodos] = useState([
    { text: "", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
  ]);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [title, setTitle] = useState("Todo");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTextClick = (index) => {
    setEditingIndex(index);
  };

  const addTodo = () => {
    if (todos.length < 6) {
      const newTodos = [...todos, { text: "", completed: false }];
      setTodos(newTodos);
      setEditingIndex(newTodos.length - 1);
    }
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  useEffect(() => {
    if (svgRef.current) {
        svgRef.current.innerHTML = "";

        const rc = rough.svg(svgRef.current);

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

        // Plus Button (+)
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

        // Horizontal Lines (Notebook style)
        todos.forEach((todo, i) => {
          const y = 123.5 + (i * 45.5);
          
          // Main line
          const line = rc.line(13, y, 327, y, {
            stroke: '#ccc',
            strokeWidth: 1,
            roughness: 0.5,
            seed: TODO_SEED + i + 10
          });
          svgRef.current.appendChild(line);

          if (i === editingIndex) {
            // Highlight background when editing (Highlighter effect)
            const highlight = rc.rectangle(19.5, y - 36.4, 268.9, 36.4, {
              fill: 'rgba(255, 249, 196, 0.8)', // Light yellow highlight
              fillStyle: 'solid',
              stroke: 'none',
              roughness: 1.5,
              seed: TODO_SEED + i + 1000
            });
            svgRef.current.appendChild(highlight);

            // Input field using foreignObject
            const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
            fo.setAttribute("x", "19.5");
            fo.setAttribute("y", (y - 36.4).toString());
            fo.setAttribute("width", "268.9");
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
            svgRef.current.appendChild(fo);
            setTimeout(() => input.focus(), 0);
          } else {
            // Clickable area for text
            const textHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            textHitbox.setAttribute("x", "19.5");
            textHitbox.setAttribute("y", (y - 36.4).toString());
            textHitbox.setAttribute("width", "268.9");
            textHitbox.setAttribute("height", "36.4");
            textHitbox.setAttribute("fill", "transparent");
            textHitbox.style.cursor = "pointer";
            textHitbox.onpointerdown = (e) => {
              e.stopPropagation();
              handleTextClick(i);
            };
            svgRef.current.appendChild(textHitbox);

            if (todo.text) {
              const todoText = document.createElementNS("http://www.w3.org/2000/svg", "text");
              todoText.setAttribute("x", "23.4");
              todoText.setAttribute("y", y - 13);
              todoText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 23.4px; pointer-events: none; ${todo.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}`);
              todoText.textContent = todo.text;
              svgRef.current.appendChild(todoText);
            }
          }

          // Checkbox on the right
          const checkbox = rc.rectangle(298.4, y - 32.5, 23.4, 23.4, {
            roughness: 1.2,
            stroke: '#555',
            fill: todo.completed ? 'rgba(0,0,0,0.1)' : undefined,
            seed: TODO_SEED + i + 20
          });
          svgRef.current.appendChild(checkbox);

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
          svgRef.current.appendChild(checkboxHitbox);

          // Checkmark (V shape)
          if (todo.completed) {
            const check1 = rc.line(303, y - 22, 310, y - 13, { stroke: '#2ecc71', strokeWidth: 3, seed: TODO_SEED + i + 30 });
            const check2 = rc.line(310, y - 13, 320, y - 28, { stroke: '#2ecc71', strokeWidth: 3, seed: TODO_SEED + i + 40 });
            svgRef.current.appendChild(check1);
            svgRef.current.appendChild(check2);
          }
        });
      }
  }, [todos, editingIndex, title, isEditingTitle]); // todos나 편집 상태가 변경될 때마다 다시 그림

  return (
    <svg ref={svgRef} width="100%" className={className} viewBox="0 0 340 364" preserveAspectRatio="xMidYMid meet">
    </svg>
  );
}

export default TodoList;
