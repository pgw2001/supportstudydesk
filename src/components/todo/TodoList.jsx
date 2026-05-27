import {
  saveUserData,
  loadUserData,
} from "../../services/userData";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import rough from "roughjs";
import { TODO_SEED, getLineCount } from "./TodoUtils";
import TodoItem from "./TodoItem";

const createEmptyTodos = () => [
  { text: "", completed: false },
  { text: "", completed: false },
  { text: "", completed: false },
  { text: "", completed: false },
  { text: "", completed: false },
];

const createTodoList = (number = 1) => ({
  title: number === 1 ? "Todo" : `Todo ${number}`,
  todos: createEmptyTodos(),
});

function TodoList({ className,setTaskCount,user }) {
  const svgRef = useRef(null);
  const listSvgRef = useRef(null);
  const deleteSvgRef = useRef(null);

  const isResettingRef =
  useRef(false);

  const [todoLists, setTodoLists] = useState(() => [createTodoList()]);
  const [isLoaded, setIsLoaded] =
  useState(false);
  useEffect(() => {

  const fetchTodoLists =
  async () => {

    if (!user) {

      isResettingRef.current =
        true;

      setIsLoaded(false);

      setTodoLists([
        createTodoList(),
      ]);

      setCurrentListIndex(0);


      return;
    }

    const data =
      await loadUserData(
        user.uid
      );

if (data?.todoLists) {

  setTodoLists(
    data.todoLists
  );

} else {

  setTodoLists([
    createTodoList(),
  ]);
}

if (
  typeof data?.currentListIndex
  === "number"
) {

  setCurrentListIndex(
    data.currentListIndex
  );

} else {

  setCurrentListIndex(0);
}
setIsLoaded(true);
    };

  fetchTodoLists();

}, [user]);
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [isWidgetHovered, setIsWidgetHovered] = useState(false); // New state for widget hover
  const [isOverListArea, setIsOverListArea] = useState(false); // track mouse over the list area
  const currentList = todoLists[currentListIndex];
  const todos = currentList.todos;
  const title = currentList.title;
  const isLastList = currentListIndex === todoLists.length - 1;
  const hasMultipleLists = todoLists.length > 1;

  const updateCurrentList = useCallback((updater) => {
    setTodoLists((prev) =>
      prev.map((list, index) => (
        index === currentListIndex ? updater(list) : list
      ))
    );
  }, [currentListIndex]);

  const setTodos = useCallback((updater) => {
    updateCurrentList((list) => ({
      ...list,
      todos: typeof updater === "function" ? updater(list.todos) : updater,
    }));
  }, [updateCurrentList]);

  const setTitle = useCallback((nextTitle) => {
    updateCurrentList((list) => ({ ...list, title: nextTitle }));
  }, [updateCurrentList]);

  const resetInteraction = useCallback(() => {
    setEditingIndex(-1);
    setHoveredIndex(-1);
    setIsEditingTitle(false);
  }, []);

  const handleTextClick = useCallback((index) => {
    setEditingIndex(index);
    setHoveredIndex(-1);
  }, []);

  const addTodo = useCallback(() => {
    setTodos((prev) => {
      const next = [...prev, { text: "", completed: false }];
      setEditingIndex(next.length - 1);
      return next;
    });
    setHoveredIndex(-1);
  }, [setTodos]);

  const toggleTodo = useCallback((index) => {
    setTodos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], completed: !next[index].completed };
      return next;
    });
  }, [setTodos]);

  const deleteTodo = useCallback((index) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
    resetInteraction();
  }, [resetInteraction, setTodos]);

  const createNextTodoList = useCallback((e) => {
    e.stopPropagation();
    setTodoLists((prev) => {
      const next = [...prev, createTodoList(prev.length + 1)];
      setCurrentListIndex(next.length - 1);
      return next;
    });
    resetInteraction();
  }, [resetInteraction]);

  const deleteCurrentList = useCallback((e) => {
    e.stopPropagation();
    setTodoLists((prev) => {
      if (prev.length <= 1) return [createTodoList()];
      const next = prev.filter((_, i) => i !== currentListIndex);
      const newIndex = Math.min(currentListIndex, Math.max(0, next.length - 1));
      setCurrentListIndex(newIndex);
      return next;
    });
    resetInteraction();
  }, [currentListIndex, resetInteraction]);

  const goToPreviousList = useCallback((e) => {
    e.stopPropagation();
    setCurrentListIndex((prev) => Math.max(prev - 1, 0));
    resetInteraction();
  }, [resetInteraction]);

  const goToNextList = useCallback((e) => {
    e.stopPropagation();
    setCurrentListIndex((prev) => Math.min(prev + 1, todoLists.length - 1));
    resetInteraction();
  }, [resetInteraction, todoLists.length]);

  const handleMouseMove = useCallback((e) => {
    if (editingIndex !== -1) return;
    if (!e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scale = 340 / rect.width;
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

    setHoveredIndex((prev) => (foundIndex !== prev ? foundIndex : prev));
  }, [editingIndex, todos]);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  //Todo갯수 세기(재현)
  useEffect(() => {
  const count =
    todoLists.reduce(
      (total, list) =>
        total +
        list.todos.filter(
          (todo) =>
            todo.text.trim() !== "" &&
            !todo.completed
        ).length,
      0
    );

  setTaskCount?.(count);

  }, [todoLists, setTaskCount]);

  useEffect(() => {
    if (!svgRef.current) return;

    svgRef.current.innerHTML = "";
    const rc = rough.svg(svgRef.current);

    const rect = rc.rectangle(6.5, 6.5, 327, 372, {
      fill: "#fff",
      fillStyle: "solid",
      stroke: "#000",
      strokeWidth: 2,
      roughness: 2,
      bowing: 1,
      seed: TODO_SEED + currentListIndex * 1000,
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
      input.dataset.noDrag = "true";
      input.style.cssText = "width: 100%; height: 100%; font-family: 'Comic Sans MS', 'Pretendard', cursive; font-size: 31.2px; font-weight: bold; border: none; outline: none; background: transparent; padding: 0; margin: 0;";

      const saveTitle = () => {
        setTitle(input.value || "Todo");
        setIsEditingTitle(false);
      };

      input.onkeydown = (e) => {
        if (e.key === "Enter") saveTitle();
        if (e.key === "Escape") setIsEditingTitle(false);
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
      titleText.setAttribute("style", "font-family: 'Comic Sans MS', 'Pretendard', cursive; font-size: 31.2px; font-weight: bold; cursor: pointer;");
      titleText.textContent = title;
      titleText.onpointerdown = (e) => {
        e.stopPropagation();
        setIsEditingTitle(true);
      };
      titleText.onmousedown = (e) => e.stopPropagation();
      svgRef.current.appendChild(titleText);
    }

    const plusCircle = rc.circle(303.6, 49.4, 23.4, {
      stroke: "#000",
      strokeWidth: 1,
      roughness: 1,
      seed: TODO_SEED + 1,
    });
    svgRef.current.appendChild(plusCircle);
    svgRef.current.appendChild(rc.line(295.8, 49.4, 311.4, 49.4, { strokeWidth: 2, seed: TODO_SEED + 2 }));
    svgRef.current.appendChild(rc.line(303.6, 41.6, 303.6, 57.2, { strokeWidth: 2, seed: TODO_SEED + 3 }));

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
    svgRef.current.appendChild(plusHitbox);

    const isAllDone = totalCount > 0 && completedCount === totalCount;
    const statusText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    statusText.setAttribute("x", "170");
    statusText.setAttribute("y", "370");
    statusText.setAttribute("text-anchor", "middle");
    statusText.setAttribute("style", `font-family: 'Comic Sans MS', 'Pretendard', cursive; font-size: 14px; fill: ${isAllDone ? "#2ecc71" : "#888"}; font-weight: bold; pointer-events: none; transition: fill 0.3s;`);
    statusText.textContent = isAllDone ? "All done!" : `${completedCount} / ${totalCount} done`;
    svgRef.current.appendChild(statusText);

    // Rough.js 스타일의 삼각형 이동 버튼 그리기
    const arrowOpacity = isWidgetHovered ? "1" : "0";
    const arrowTransition = "opacity 0.2s";

    // 왼쪽 화살표 (이전 리스트) - currentListIndex가 0보다 클 때만 표시
    if (currentListIndex > 0) {
      const prevTriangle = rc.polygon([[-36, 192.5], [-4, 172.5], [-4, 212.5]], {
        fill: "#fff",
        fillStyle: "solid",
        stroke: "#000",
        strokeWidth: 1,
        roughness: 1.5,
        seed: TODO_SEED + currentListIndex + 100,
      });
      prevTriangle.setAttribute("style", `pointer-events: none; opacity: ${arrowOpacity}; transition: ${arrowTransition};`);
      svgRef.current.appendChild(prevTriangle);
    }

    // 오른쪽 화살표 (다음 리스트) - 마지막 리스트가 아닐 때만 표시
    if (currentListIndex < todoLists.length - 1) {
      const nextTriangle = rc.polygon([[344, 172.5], [344, 212.5], [376, 192.5]], {
        fill: "#fff",
        fillStyle: "solid",
        stroke: "#000",
        strokeWidth: 1,
        roughness: 1.5,
        seed: TODO_SEED + currentListIndex + 101,
      });
      nextTriangle.setAttribute("style", `pointer-events: none; opacity: ${arrowOpacity}; transition: ${arrowTransition};`);
      svgRef.current.appendChild(nextTriangle);
    }
  }, [addTodo, completedCount, currentListIndex, isEditingTitle, setTitle, title, totalCount, isWidgetHovered, todoLists.length]);

  useEffect(() => {
    if (!deleteSvgRef.current) return;
    const el = deleteSvgRef.current;
    el.innerHTML = "";
    const rc = rough.svg(el);

    // post-it background sized for 25x40 SVG
    const rect = rc.rectangle(2, 2, 21, 36, {
      fill: "#fff3b0",
      fillStyle: "solid",
      stroke: "#000",
      strokeWidth: 1.4,
      roughness: 2,
      bowing: 1,
      seed: TODO_SEED + 500 + currentListIndex,
    });
    el.appendChild(rect);

    // little curl/fold
    const fold = rc.polygon([[14,2],[24,2],[24,10]], {
      fill: "#fff7d0",
      fillStyle: "solid",
      stroke: "#000",
      strokeWidth: 0.9,
      roughness: 1.2,
      seed: TODO_SEED + 600 + currentListIndex,
    });
    el.appendChild(fold);

    // X mark
    const x1 = rc.line(7, 16, 18, 28, { stroke: "#000", strokeWidth: 1.9, roughness: 1.5, seed: TODO_SEED + 700 + currentListIndex });
    const x2 = rc.line(18, 16, 7, 28, { stroke: "#000", strokeWidth: 1.9, roughness: 1.5, seed: TODO_SEED + 800 + currentListIndex });
    el.appendChild(x1);
    el.appendChild(x2);

    // add subtle shadow path behind
    const shadow = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    shadow.setAttribute("x", "2");
    shadow.setAttribute("y", "32");
    shadow.setAttribute("width", "21");
    shadow.setAttribute("height", "5");
    shadow.setAttribute("fill", "rgba(0,0,0,0.06)");
    shadow.setAttribute("pointer-events", "none");
    el.appendChild(shadow);

    return () => {
      // cleanup if component unmounts
    };
  }, [deleteSvgRef, isWidgetHovered, isOverListArea, hasMultipleLists, currentListIndex]);

  useEffect(() => {

  if (
    !isLoaded ||
    !user ||
    !user?.uid ||
    user?.isGuest
  ) {

    isResettingRef.current =
    false;

    return;
  }

  saveUserData(
    user.uid,
    {
      todoLists,
      currentListIndex,
    }
  );

  }, [
  todoLists,
  currentListIndex,
  user,
  ]);

  const totalLines = todos.reduce((acc, todo) => acc + getLineCount(todo.text), 0);
  const listHeight = Math.max(260, totalLines * 45.5 + 60);

  const todoPositions = useMemo(() => (
    todos.map((_, index) =>
      45 + todos
        .slice(0, index)
        .reduce((height, todo) => height + getLineCount(todo.text) * 45.5, 0)
    )
  ), [todos]);

  return (
    <div
      className={`${className} todo-list-widget-root`}
      onMouseEnter={() => setIsWidgetHovered(true)}
      onMouseLeave={() => setIsWidgetHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "340px",
        aspectRatio: "340 / 385",
        overflow: "visible",
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
          .todo-list-switch {
            position: absolute;
            top: 50%;
            z-index: 4;
            border: 0;
            background: transparent;
            padding: 0;
            opacity: 0; /* Hide by default */
            transition: opacity 0.2s;
            transform: translateY(-50%);
            width: 40px; /* Increased width for larger triangle */
            height: 50px; /* Increased height for larger triangle */
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .todo-list-widget-root:hover .todo-list-switch {
            opacity: 1; /* Show on hover */
          }
          .todo-list-switch:disabled {
            opacity: 0.25;
            cursor: default;
          }
          .todo-list-triangle-left,
          .todo-list-triangle-right {
            display: block;
            width: 0; /* These spans are no longer drawing the triangles */
            height: 0; /* They will be hidden */
            overflow: hidden; /* Ensure they don't take up space */
            pointer-events: none; /* Ensure clicks go to the button */
            /* filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.22)); */ /* Rough.js will handle shadow */
          }
          .todo-list-create {
            position: absolute;
            right: -32px;
            top: 49%;
            z-index: 4;
            width: 25px;
            height: 25px;
            border-radius: 999px;
            border: none;
            background: rgba(216, 216, 216, 0.4);
            color: transparent;
            transform: translateY(-50%);
            cursor: pointer;
            box-shadow: 1px 2px 0 rgba(0, 0, 0, 0.18);
            opacity: 0;
            transition: opacity 0.2s;
          }
          /* Delete post-it style button */
          .todo-list-delete {
            position: absolute;
            /* 위치: SVG의 우측 상단 플러스 버튼 위에 오도록 비율로 설정 */
            right: 10%;
            top: 8%;
            z-index: 6;
            width: 20px;
            height: 44px; /* 세로로 긴 포스트잇 */
            border-radius: 6px;
            border: none;
            background: #fff3b0; /* post-it color */
            color: #222;
            transform: translateY(8px); /* start slightly down */
            cursor: pointer;
            box-shadow: 1px 2px 0 rgba(0, 0, 0, 0.18);
            opacity: 0;
            transition: transform 0.28s cubic-bezier(.2,.9,.2,1), opacity 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            pointer-events: auto;
          }
          .todo-list-delete.visible {
            transform: translateY(0);
            opacity: 1;
          }
          .todo-list-delete:hover {
            transform: translateY(-6px);
          }
          .todo-list-widget-root:hover .todo-list-create {
            opacity: 1;
          }
          .todo-list-create::before,
          .todo-list-create::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            background: #555;
            border: none;
            transform: translate(-50%, -50%);
            box-sizing: border-box;
          }
          .todo-list-create::before {
            width: 12px;
            height: 2px;
          }
          .todo-list-create::after {
            width: 2px;
            height: 12px;
          }
          .todo-list-delete-svg {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
            transition: transform 0.28s cubic-bezier(.2,.9,.2,1), opacity 0.18s;
            pointer-events: none;
          }
          .todo-list-delete-svg.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
          }
        `}
      </style>

      {/* draw rough.js post-it with X inside */}
      {/** draw/update delete button svg */}
      <style dangerouslySetInnerHTML={{__html: ''}} />

      {isLastList ? (
        <>
          {hasMultipleLists && (
            <button
              type="button"
              aria-label="Previous todo list"
              className="todo-list-switch"
              data-no-drag="true"
              onPointerDown={goToPreviousList}
              style={{ left: "-26px", cursor: "pointer" }}
            >
            </button>
          )}
          <button
            type="button"
            aria-label="Create todo list"
            className="todo-list-create"
            data-no-drag="true"
            onPointerDown={createNextTodoList}
          >
            +
          </button>
          {/* delete button rendered as rough.js SVG (outside list area) */}
        </>
      ) : (
        <>
          <button
            type="button"
            aria-label="Previous todo list"
            className="todo-list-switch"
            data-no-drag="true"
            disabled={currentListIndex === 0}
            onPointerDown={goToPreviousList}
            style={{ left: "-46px", cursor: currentListIndex === 0 ? "default" : "pointer" }} /* Increased margin */
          >
          </button>
          <button
            type="button"
            aria-label="Next todo list"
            className="todo-list-switch"
            data-no-drag="true"
            onPointerDown={goToNextList}
            style={{ right: "-46px", cursor: "pointer" }} /* Increased margin */
          >
          </button>
        </>
      )}

      <svg
        ref={svgRef}
        viewBox="0 0 340 385"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible" }}
      />

      {/* Rough.js delete button SVG placed outside the todo rectangle (top-right) */}
      <svg
        ref={deleteSvgRef}
        viewBox="0 0 25 40"
        className={`todo-list-delete-svg ${isWidgetHovered && !isOverListArea && hasMultipleLists ? 'visible' : ''}`}
        onPointerDown={(e) => { e.stopPropagation(); deleteCurrentList(e); }}
        data-no-drag="true"
        style={{ position: 'absolute', right: '8px', top: '-30px', width: '25px', height: '40px', zIndex: -1, cursor: 'pointer', overflow: 'visible', transformOrigin: 'center' }}
      />

      <div
        className="todo-list-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsOverListArea(true)}
        onMouseLeave={() => {
          setHoveredIndex(-1);
          setIsOverListArea(false);
        }}
        style={{
          position: "absolute",
          top: "23.5%",
          left: "6%",
          right: "8%",
          height: "66%",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 1,
        }}
      >
        <svg viewBox={`0 0 340 ${listHeight}`} style={{ width: "100%", height: "auto", display: "block" }}>
          <g ref={listSvgRef}>
            {todos.map((todo, i) => (
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
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default TodoList;
