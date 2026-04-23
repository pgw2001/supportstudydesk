function TodoList() {
  const tasks = [
    { title: "Scene layout", done: true },
    { title: "Window area", done: false },
    { title: "Timer widget", done: false },
    { title: "Todo input", done: false },
  ];

  return (
    <section className="w-[220px] rounded-[18px] border-2 border-neutral-900 bg-white p-4 shadow-[4px_5px_0_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900">Todo</p>
        <button className="rounded-full border border-neutral-900 px-2 py-0.5 text-[11px]">
          +
        </button>
      </div>

      <div className="mt-3 space-y-2 text-xs text-neutral-700">
        {tasks.map((task) => (
          <div key={task.title} className="flex items-center gap-2">
            <span
              className={`grid h-4 w-4 place-items-center rounded-full border border-neutral-900 text-[10px] ${
                task.done ? "bg-neutral-900 text-white" : "bg-white"
              }`}
            >
              {task.done ? "✓" : ""}
            </span>
            <span className={task.done ? "line-through" : ""}>{task.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TodoList;
