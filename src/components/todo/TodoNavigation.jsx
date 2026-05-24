import React, { useEffect, useRef } from "react";
import rough from "roughjs";
import { TODO_SEED } from "./TodoUtils";

const TodoNavigation = ({
  currentListIndex,
  todoListsLength,
  isWidgetHovered,
  goToPreviousList,
  goToNextList,
  isLastList,
  hasMultipleLists,
  createNextTodoList,
}) => {
  const gRef = useRef(null);

  useEffect(() => {
    if (!gRef.current) return;
    gRef.current.innerHTML = "";

    const svgElement = gRef.current.closest('svg');
    if (!svgElement) return;
    const rc = rough.svg(svgElement);

    const arrowOpacity = isWidgetHovered ? "1" : "0";
    const arrowTransition = "opacity 0.2s";

    // 왼쪽 화살표
    if (currentListIndex > 0) {
      const prevTriangle = rc.polygon([[-36, 192.5], [-4, 172.5], [-4, 212.5]], {
        fill: "#fff", fillStyle: "solid", stroke: "#000", strokeWidth: 1, roughness: 1.5, seed: TODO_SEED + currentListIndex + 100,
      });
      prevTriangle.setAttribute("style", `pointer-events: none; opacity: ${arrowOpacity}; transition: ${arrowTransition};`);
      gRef.current.appendChild(prevTriangle);
    }

    // 오른쪽 화살표
    if (currentListIndex < todoListsLength - 1) {
      const nextTriangle = rc.polygon([[344, 172.5], [344, 212.5], [376, 192.5]], {
        fill: "#fff", fillStyle: "solid", stroke: "#000", strokeWidth: 1, roughness: 1.5, seed: TODO_SEED + currentListIndex + 101,
      });
      nextTriangle.setAttribute("style", `pointer-events: none; opacity: ${arrowOpacity}; transition: ${arrowTransition};`);
      gRef.current.appendChild(nextTriangle);
    }
  }, [currentListIndex, todoListsLength, isWidgetHovered]);

  return (
    <>
      <svg
        viewBox="0 0 340 385"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 2 }}
      >
        <g ref={gRef} />
      </svg>
      {isLastList ? (
        <>
          {hasMultipleLists && (
            <button type="button" aria-label="Previous todo list" className="todo-list-switch" data-no-drag="true" onPointerDown={goToPreviousList} style={{ left: "-46px", cursor: "pointer" }} />
          )}
          <button type="button" aria-label="Create todo list" className="todo-list-create" data-no-drag="true" onPointerDown={createNextTodoList}>
            +
          </button>
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
            style={{ left: "-46px", cursor: currentListIndex === 0 ? "default" : "pointer" }}
          />
          <button
            type="button"
            aria-label="Next todo list"
            className="todo-list-switch"
            data-no-drag="true"
            onPointerDown={goToNextList}
            style={{ right: "-46px", cursor: "pointer" }}
          />
        </>
      )}
    </>
  );
};

export default TodoNavigation;