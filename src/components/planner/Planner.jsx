import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

function Planner({ onClose }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const svgRef = useRef(null);
  const roughGroupRef = useRef(null);

  // 오늘 날짜
  const today = new Date().toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }
  );

  // rough 배경 생성
  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    svg.innerHTML = "";

    const rc = rough.svg(svg);

    const group = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    // 메인 종이
    const rect = rc.rectangle(
      8,
      8,
      504,
      654,
      {
        roughness: 2.2,
        stroke: "#222",
        strokeWidth: 2,
        fill: "#f8f3e8",
        fillStyle: "solid",
      }
    );

    // 그림자 느낌
    const shadow = rc.rectangle(
      16,
      16,
      504,
      654,
      {
        roughness: 2,
        stroke: "rgba(0,0,0,0.15)",
        strokeWidth: 3,
      }
    );

    group.appendChild(shadow);
    group.appendChild(rect);

    svg.appendChild(group);

    roughGroupRef.current = group;
  }, []);

  // 저장 함수
  const saveToLocalStorage = () => {
    localStorage.setItem(
      "planner",
      JSON.stringify({todos, input})
    );
  };

  // localStorage 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(
      "planner"
    );

    if (saved) {
      const parsed = JSON.parse(saved);

      setTodos(parsed.todos || []);
      setInput(parsed.input || "");
    }
  }, []);

  // 컴포넌트 언마운트 시 저장
  useEffect(() => {
    return () => {
      saveToLocalStorage();
    };
  }, [todos, input]);

  // 추가
  const addTodo = () => {
    if (!input.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: input,
        done: false,
      },
    ]);

    setInput("");
  };

  // 체크
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              done: !todo.done,
            }
          : todo
      )
    );
  };

  // 삭제
  const deleteTodo = (id) => {
    setTodos(
      todos.filter((todo) => todo.id !== id)
    );
  };

  // 진행률
  const completed = todos.filter(
    (todo) => todo.done
  ).length;

  const progress =
    todos.length === 0
      ? 0
      : Math.round(
          (completed / todos.length) * 100
        );

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">

      {/* 컨테이너 */}
      <div className="relative h-[670px] w-[520px]">

        {/* 배경 */}
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full"
        />

        {/* 내용 */}
        <div className="absolute inset-0 p-10">

        {/* 닫기 */}
        <button
            onClick={onClose}
            className="
              absolute
              right-7
              top-5
              text-2xl
              font-bold
            "
        >   
            ✕
        </button>

          {/* 날짜 */}
          <h2 className="mb-8 text-3xl font-bold text-neutral-800">
            {today}
          </h2>

          {/* 입력 */}
          <div className="mb-8 flex gap-3">
            <input
              type="text"
              value={input}
              placeholder="할 일을 입력하세요"
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && addTodo()
              }
              className="
                flex-1
                border-b-2
                border-neutral-700
                bg-transparent
                px-2
                py-2
                outline-none
              "
            />

            <button
              onClick={addTodo}
              className="
                rounded-xl
                border-2
                border-neutral-800
                bg-[#f5ecd7]
                px-4
                py-2
                font-semibold
                transition
                hover:scale-105
              "
            >
              추가
            </button>
          </div>

          {/* 리스트 */}
          <div className="mb-10 max-h-[360px] space-y-4 overflow-y-auto pr-2">

            {todos.length === 0 && (
              <p className="text-neutral-400">
                아직 작성된 할 일이 없습니다.
              </p>
            )}

            {todos.map((todo) => (
              <div
                key={todo.id}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border-2
                  border-neutral-300
                  bg-white/70
                  px-4
                  py-3
                "
              >

                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() =>
                    toggleTodo(todo.id)
                  }
                  className="h-4 w-4"
                />

                <span
                  className={`
                    flex-1
                    text-lg
                    ${
                      todo.done
                        ? "text-neutral-400 line-through"
                        : ""
                    }
                  `}
                >
                  {todo.text}
                </span>

                <button
                  onClick={() =>
                    deleteTodo(todo.id)
                  }
                  className="
                    text-sm
                    text-red-500
                  "
                >
                  삭제
                </button>

              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-2 flex justify-between text-sm font-semibold">
            <span>목표 달성도</span>
            <span>{progress}%</span>
          </div>

          {/* 게이지 */}
          <div className="h-5 overflow-hidden rounded-full border-2 border-neutral-800 bg-[#ddd4bb]">
            <div
              className="
                h-full
                bg-[#f4c84c]
                transition-all
                duration-300
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Planner;