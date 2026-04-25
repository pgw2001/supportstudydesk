function TodoList() {
  const tasks = [
    { title: "Scene layout", done: true },
    { title: "Window area", done: false },
    { title: "Timer widget", done: false },
    { title: "Todo input and responsive sizing test", done: false },
  ];

  return (
    <section className="w-full rounded-[clamp(12px,1vw,18px)] border-2 border-neutral-900 bg-white p-[clamp(10px,1vw,16px)] shadow-[4px_5px_0_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between gap-[clamp(6px,0.8vw,10px)]">
        <p className="text-[clamp(12px,1vw,16px)] font-semibold text-neutral-900">
          Todo
        </p>
        <button className="grid h-[clamp(18px,1.5vw,24px)] w-[clamp(18px,1.5vw,24px)] shrink-0 place-items-center rounded-full border border-neutral-900 text-[clamp(10px,0.8vw,12px)] leading-none">
          +
        </button>
      </div>

      <div className="mt-[clamp(8px,0.8vw,12px)] flex flex-col gap-[clamp(6px,0.8vw,10px)]">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="flex items-start gap-[clamp(6px,0.8vw,10px)]"
          >
            <span
              className={`mt-[0.2em] grid h-[clamp(12px,1vw,16px)] w-[clamp(12px,1vw,16px)] shrink-0 place-items-center rounded-full border border-neutral-900 text-[clamp(8px,0.7vw,10px)] ${
                task.done ? "bg-neutral-900 text-white" : "bg-white"
              }`}
            >
              {task.done ? "✓" : ""}
            </span>

            <span
              className={`min-w-0 break-words text-[clamp(10px,0.85vw,14px)] leading-[1.35] text-neutral-700 ${
                task.done ? "line-through" : ""
              }`}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TodoList;

