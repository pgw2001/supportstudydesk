import { useState } from "react";

const COLORS = [
  "#f8d7e8",
  "#d9e8ff",
  "#fff0b3",
  "#d8f5d0",
  "#ffd8b3",
];

function PlannerTaskList({
  tasks,
  setTasks,
  toggleTask,
  setBlocks,
}) {
  const [subject, setSubject] =
    useState("");

  const [text, setText] = useState("");

  const [color, setColor] = useState(
    COLORS[0]
  );

  // 추가
  const addTask = () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      subject,
      text,
      done: false,
      color,
    };

    setTasks([...tasks, newTask]);

    // timetable block도 생성
    setBlocks((prev) => [
      ...prev,
      {
        id: Date.now(),
        subject,
        color,
        top: 100,
        height: 80,
      },
    ]);

    setSubject("");
    setText("");
  };

  // 삭제
  const deleteTask = (id) => {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );

    setBlocks((prev) =>
      prev.filter((block) => block.id !== id)
    );
  };

  return (
    <div>

      <h2 className="mb-4 text-2xl font-bold">
        Task
      </h2>

      {/* 입력 */}
      <div className="mb-5 flex gap-2">

        <input
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
          placeholder="과목"
          className="
            w-[90px]
            rounded-lg
            border
            px-2
            py-2
          "
        />

        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="할 일"
          className="
            flex-1
            rounded-lg
            border
            px-3
            py-2
          "
        />

        {/* 색상 선택 */}
        <div className="flex items-center gap-1">

          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`
                h-6
                w-6
                rounded-full
                border-2
                ${
                  color === c
                    ? "border-black"
                    : "border-transparent"
                }
              `}
              style={{
                backgroundColor: c,
              }}
            />
          ))}

        </div>

        <button
          onClick={addTask}
          className="
            rounded-lg
            bg-black
            px-4
            py-2
            text-white
          "
        >
          추가
        </button>

      </div>

      {/* 리스트 */}
      <div className="space-y-3">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="
              flex
              items-center
              rounded-xl
              border
              border-neutral-300
              bg-white/60
              px-4
              py-3
            "
          >

            {/* 태그 */}
            <div className="w-[120px]">

              <span
                className="
                  rounded-full
                  px-3
                  py-1
                  text-sm
                  font-semibold
                "
                style={{
                  backgroundColor: task.color,
                }}
              >
                {task.subject}
              </span>

            </div>

            {/* 내용 */}
            <div
              className={`
                flex-1
                text-lg
                ${
                  task.done
                    ? "line-through text-neutral-400"
                    : ""
                }
              `}
            >
              {task.text}
            </div>

            {/* 체크 */}
            <input
              type="checkbox"
              checked={task.done}
              onChange={() =>
                toggleTask(task.id)
              }
              className="mr-3 h-5 w-5"
            />

            {/* 삭제 */}
            <button
              onClick={() =>
                deleteTask(task.id)
              }
              className="text-red-500"
            >
              ✕
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default PlannerTaskList;