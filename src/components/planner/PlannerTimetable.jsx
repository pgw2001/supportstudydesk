function PlannerTimetable({
  tasks,
  timetable,
  setTimetable,
}) {

  // 시간
  const hours = [
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "00",
  ];

  // 현재 선택된 과목
  const selectedTask =
    tasks.find((t) => !t.done) || tasks[0];

  // 셀 클릭
  const handleCellClick = (
    row,
    col
  ) => {
    const key = `${row}-${col}`;

    setTimetable((prev) => {
      // 이미 칠해져있으면 제거
      if (prev[key]) {
        const updated = { ...prev };

        delete updated[key];

        return updated;
      }

      if (!selectedTask) return prev;

      // 새로 칠하기
      return {
        ...prev,
        [key]: {
          subject:
            selectedTask.subject,
          color:
            selectedTask.color,
        },
      };
    });
  };

  return (
    <div className="flex-1">

      <h2 className="mb-4 text-2xl font-bold">
        Timetable
      </h2>

      {/* 현재 선택 */}
      <div className="mb-3 text-sm text-neutral-500">

        현재 과목 :

        <span
          className="
            ml-2
            rounded-full
            px-3
            py-1
            font-semibold
          "
          style={{
            backgroundColor:
              selectedTask?.color,
          }}
        >
          {selectedTask?.subject ||
            "과목 없음"}
        </span>

      </div>

      {/* 표 */}
      <div
        className="
          grid
          border
          border-neutral-400
          bg-white/60
        "
        style={{
          gridTemplateColumns:
            "60px repeat(6, 1fr)",
        }}
      >

        {/* 상단 */}
        <div className="border-b border-r p-2" />

        {[0, 10, 20, 30, 40, 50].map(
          (minute) => (
            <div
              key={minute}
              className="
                border-b
                border-r
                p-2
                text-center
                text-sm
                font-semibold
              "
            >
              {minute}
            </div>
          )
        )}

        {/* 시간표 */}
        {hours.map((hour, row) => (
          <>
            {/* 시간 */}
            <div
              key={hour}
              className="
                flex
                items-center
                justify-center
                border-b
                border-r
                text-sm
                font-bold
              "
            >
              {hour}
            </div>

            {/* 10분칸 */}
            {[...Array(6)].map((_, col) => {

              const key = `${row}-${col}`;

              const cell =
                timetable[key];

              return (
                <button
                  key={key}
                  onClick={() =>
                    handleCellClick(
                      row,
                      col
                    )
                  }
                  className="
                    h-[22px]
                    border-b
                    border-r
                    transition
                    hover:opacity-80
                  "
                  style={{
                    backgroundColor:
                      cell?.color ||
                      "transparent",
                  }}
                  title={
                    cell?.subject || ""
                  }
                />
              );
            })}
          </>
        ))}

      </div>

    </div>
  );
}

export default PlannerTimetable;