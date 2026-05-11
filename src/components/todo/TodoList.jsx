import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TODO_SEED, getLineCount } from "./TodoUtils";
import TodoItem from "./TodoItem";
import TodoHeader from "./TodoHeader";
import TodoNavigation from "./TodoNavigation";
import { TODO_STYLES } from "./TodoStyles";
import { createTodo, createTodoList, loadTodoData, saveTodoData } from "./TodoStorage";

function TodoList({ className }) {
  const listSvgRef = useRef(null);

  const [todoData, setTodoData] = useState(loadTodoData);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [isWidgetHovered, setIsWidgetHovered] = useState(false); // New state for widget hover
  const todoLists = todoData.lists;
  const currentListIndex = todoData.currentListIndex;
  const currentList = todoLists[currentListIndex];
  const todos = currentList.todos;
  const title = currentList.title;
  const isLastList = currentListIndex === todoLists.length - 1;
  const hasMultipleLists = todoLists.length > 1;

  const updateCurrentList = useCallback((updater) => {
    setTodoData((prev) => ({
      ...prev,
      lists: prev.lists.map((list, index) => (
        index === prev.currentListIndex ? updater(list) : list
      )),
    }));
  }, []);

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
      const next = [...prev, createTodo()];
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
    setTodoData((prev) => {
      const lists = [...prev.lists, createTodoList(prev.lists.length + 1)];
      return {
        ...prev,
        lists,
        currentListIndex: lists.length - 1,
        listCount: lists.length,
      };
    });
    resetInteraction();
  }, [resetInteraction]);

  const goToPreviousList = useCallback((e) => {
    e.stopPropagation();
    setTodoData((prev) => ({
      ...prev,
      currentListIndex: Math.max(prev.currentListIndex - 1, 0),
    }));
    resetInteraction();
  }, [resetInteraction]);

  const goToNextList = useCallback((e) => {
    e.stopPropagation();
    setTodoData((prev) => ({
      ...prev,
      currentListIndex: Math.min(prev.currentListIndex + 1, prev.lists.length - 1),
    }));
    resetInteraction();
  }, [resetInteraction]);

  useEffect(() => {
    saveTodoData({
      lists: todoLists,
      currentListIndex,
    });
  }, [currentListIndex, todoLists]);

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
      <style>{TODO_STYLES}</style>

      <svg
        viewBox="0 0 340 385"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible" }}
      >
        <TodoHeader
          currentListIndex={currentListIndex}
          title={title}
          setTitle={setTitle}
          isEditingTitle={isEditingTitle}
          setIsEditingTitle={setIsEditingTitle}
          addTodo={addTodo}
          totalCount={totalCount}
          completedCount={completedCount}
        />
      </svg>

      <TodoNavigation
        currentListIndex={currentListIndex}
        todoListsLength={todoLists.length}
        isWidgetHovered={isWidgetHovered}
        goToPreviousList={goToPreviousList}
        goToNextList={goToNextList}
        isLastList={isLastList}
        hasMultipleLists={hasMultipleLists}
        createNextTodoList={createNextTodoList}
      />

      <div
        className="todo-list-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(-1)}
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
                key={todo.id}
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
