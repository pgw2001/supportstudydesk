function Timer() {
  return (
    <section className="w-[170px] rotate-[6deg] rounded-[26px] border-2 border-neutral-800 bg-white p-4 shadow-[4px_5px_0_rgba(0,0,0,0.16)]">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          Desk Timer
        </p>
        <p className="mt-3 text-4xl font-semibold tracking-[0.08em] text-neutral-900">
          25:00
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
          <button className="rounded-full border border-neutral-900 px-2 py-1.5">
            Start
          </button>
          <button className="rounded-full border border-neutral-900 px-2 py-1.5">
            Pause
          </button>
          <button className="rounded-full border border-neutral-900 px-2 py-1.5">
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

export default Timer;
