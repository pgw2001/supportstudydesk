function PlannerProgress({
  progress,
}) {
  return (
    <div className="mt-8">

      <div className="mb-2 flex justify-between font-semibold">

        <span>목표 달성도</span>

        <span>{progress}%</span>

      </div>

      <div className="h-5 overflow-hidden rounded-full border border-neutral-400 bg-neutral-200">

        <div
          className="
            h-full
            bg-[#f4c84c]
            transition-all
          "
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}

export default PlannerProgress;