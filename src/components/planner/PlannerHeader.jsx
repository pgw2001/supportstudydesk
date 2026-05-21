function PlannerHeader({
  totalTime,
  dday,
  setDday,
}) {

  // 디데이 계산
  const calculateDday = () => {
    if (!dday) return "";

    const today = new Date();
    const target = new Date(dday);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff =
      target - today;

    const days = Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );

    if (days > 0) {
      return `D-${days}`;
    }

    if (days === 0) {
      return "D-Day";
    }

    return `D+${Math.abs(days)}`;
  };

  return (
    <div className="flex items-end justify-between">

      {/* 왼쪽 */}
      <div>

        <h1 className="text-5xl font-black">
          Today's plan
        </h1>

        <p className="mt-2 text-neutral-500">
          {new Date().toLocaleDateString(
            "ko-KR"
          )}
        </p>

      </div>

      {/* 오른쪽 */}
      <div className="flex gap-10">

        {/* 공부 시간 */}
        <div>

          <p className="text-sm">
            Total Time
          </p>

          <h2 className="mt-1 text-3xl font-black">
            {totalTime}
          </h2>

        </div>

        {/* 디데이 */}
        <div>

          <p className="text-sm">
            D-Day
          </p>

          <input
            type="date"
            value={dday}
            onChange={(e) =>
              setDday(e.target.value)
            }
            className="
              mt-1
              rounded-lg
              border
              border-neutral-300
              bg-white
              px-2
              py-1
              outline-none
            "
          />

          <div
            className="
              mt-2
              text-2xl
              font-black
            "
          >
            {calculateDday()}
          </div>

        </div>

      </div>

    </div>
  );
}

export default PlannerHeader;