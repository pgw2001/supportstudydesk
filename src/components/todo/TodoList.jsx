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

  const handleTextClick = (index) => {
    const newText = prompt("할 일을 입력하세요:", todos[index].text);
    if (newText !== null) {
      const newTodos = [...todos];
      newTodos[index].text = newText;
      setTodos(newTodos);
    }
  };

  const addTodo = () => {
    if (todos.length < 6) { // 최대 6개까지만 확장 가능하도록 제한 (디자인 유지)
      setTodos([...todos, { text: "", completed: false }]);
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

        const rect = rc.rectangle(5,5,100,140,{
          fill: '#fff',
          fillStyle: 'solid',
          stroke: '#000',
          strokeWidth: 2,
          roughness: 2,
          bowing: 1,
          seed: TODO_SEED
        });
        svgRef.current.appendChild(rect);

        // Title: "Todo"
        const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        titleText.setAttribute("x", "15");
        titleText.setAttribute("y", "25");
        titleText.setAttribute("style", "font-family: 'Comic Sans MS', cursive; font-size: 12px; font-weight: bold;");
        titleText.textContent = "Todo";
        svgRef.current.appendChild(titleText);

        // Plus Button (+)
        const plusCircle = rc.circle(90, 20, 12, {
          stroke: '#000',
          strokeWidth: 1,
          roughness: 1,
          seed: TODO_SEED + 1
        });
        svgRef.current.appendChild(plusCircle);

        const plusLine1 = rc.line(86, 20, 94, 20, { strokeWidth: 1, seed: TODO_SEED + 2 });
        const plusLine2 = rc.line(90, 16, 90, 24, { strokeWidth: 1, seed: TODO_SEED + 3 });
        svgRef.current.appendChild(plusLine1);
        svgRef.current.appendChild(plusLine2);

        // Plus Button Hitbox (Invisible)
        const plusHitbox = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        plusHitbox.setAttribute("cx", "90");
        plusHitbox.setAttribute("cy", "20");
        plusHitbox.setAttribute("r", "8");
        plusHitbox.setAttribute("fill", "transparent");
        plusHitbox.style.cursor = "pointer";
        plusHitbox.onpointerdown = (e) => {
          e.stopPropagation();
          addTodo();
        };
        svgRef.current.appendChild(plusHitbox);

        // Horizontal Lines (Notebook style)
        todos.forEach((todo, i) => {
          const y = 45 + (i * 20);
          
          // Main line
          const line = rc.line(10, y, 100, y, {
            stroke: '#ccc',
            strokeWidth: 1,
            roughness: 0.5,
            seed: TODO_SEED + i + 10
          });
          svgRef.current.appendChild(line);

          // Clickable area for text (Native SVG rect for reliable clicking)
          const textHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          textHitbox.setAttribute("x", "10");
          textHitbox.setAttribute("y", (y - 15).toString());
          textHitbox.setAttribute("width", "70");
          textHitbox.setAttribute("height", "15");
          textHitbox.setAttribute("fill", "transparent");
          textHitbox.style.cursor = "pointer";
          textHitbox.onpointerdown = (e) => {
            e.stopPropagation();
            handleTextClick(i);
          };
          svgRef.current.appendChild(textHitbox);

          // User input text
          if (todo.text) {
            const todoText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            todoText.setAttribute("x", "12");
            todoText.setAttribute("y", y - 4);
            todoText.setAttribute("style", `font-family: 'Comic Sans MS', cursive; font-size: 8px; pointer-events: none; ${todo.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}`);
            todoText.textContent = todo.text;
            svgRef.current.appendChild(todoText);
          }

          // Checkbox on the right
          const checkbox = rc.rectangle(85, y - 12, 8, 8, {
            roughness: 1.5,
            stroke: '#555',
            fill: todo.completed ? 'rgba(0,0,0,0.1)' : undefined,
            seed: TODO_SEED + i + 20
          });
          svgRef.current.appendChild(checkbox);

          // Checkbox Hitbox (Native SVG rect)
          const checkboxHitbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          checkboxHitbox.setAttribute("x", "85");
          checkboxHitbox.setAttribute("y", (y - 12).toString());
          checkboxHitbox.setAttribute("width", "8");
          checkboxHitbox.setAttribute("height", "8");
          checkboxHitbox.setAttribute("fill", "transparent");
          checkboxHitbox.style.cursor = "pointer";
          checkboxHitbox.onpointerdown = (e) => {
            e.stopPropagation();
            toggleTodo(i);
          };
          svgRef.current.appendChild(checkboxHitbox);

          // Checkmark (X shape)
          if (todo.completed) {
            const check1 = rc.line(86, y - 11, 92, y - 5, { stroke: '#2ecc71', strokeWidth: 1.5, seed: TODO_SEED + i + 30 });
            const check2 = rc.line(92, y - 11, 86, y - 5, { stroke: '#2ecc71', strokeWidth: 1.5, seed: TODO_SEED + i + 40 });
            svgRef.current.appendChild(check1);
            svgRef.current.appendChild(check2);
          }
        });
      }
  }, [todos]); // todos가 변경될 때마다 다시 그림

  return (
    <svg ref={svgRef} width="100%" className={className} viewBox="0 0 110 150" preserveAspectRatio="xMidYMid meet">
    </svg>
  );
}

export default TodoList;
