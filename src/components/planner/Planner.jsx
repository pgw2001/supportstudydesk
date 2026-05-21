import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

import PlannerHeader from "./PlannerHeader";
import PlannerTaskList from "./PlannerTaskList";
import PlannerTimetable from "./PlannerTimetable";
import PlannerComment from "./PlannerComment";
import PlannerProgress from "./PlannerProgress";

function Planner({ onClose }) {
  const svgRef = useRef(null);

  // localStorage 불러오기
  const savedData = JSON.parse(
    localStorage.getItem("planner") || "{}"
  );

  // task
  const [tasks, setTasks] = useState(
    savedData.tasks || []
  );

  // comment
  const [comment, setComment] =
    useState(savedData.comment || "");

  // dday
  const [dday, setDday] = useState(
    savedData.dday || ""
  );

  // timetable
  const [timetable, setTimetable] =
    useState(
      savedData.timetable || {}
    );

  // rough 배경
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
    group.appendChild(
      rc.rectangle(10, 10, 960, 800, {
        roughness: 1.4,
        fill: "#fcfaf5",
        fillStyle: "solid",
        stroke: "#222",
        strokeWidth: 2,
      })
    );

    svg.appendChild(group);
  }, []);

  // 저장
  useEffect(() => {
    localStorage.setItem(
      "planner",
      JSON.stringify({
        tasks,
        comment,
        dday,
        timetable,
      })
    );
  }, [
    tasks,
    comment,
    dday,
    timetable,
  ]);

  // 체크
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
            }
          : task
      )
    );
  };

  // 진행률
  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.done)
            .length /
            tasks.length) *
            100
        );

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">

      {/* 팝업 */}
      <div className="relative h-[820px] w-[980px] max-w-[calc(100vw-40px)]">

        {/* rough 배경 */}
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full"
        />

        {/* 내용 */}
        <div className="absolute inset-0 p-8 overflow-auto">

          {/* 닫기 */}
          <button
            onClick={onClose}
            className="
              absolute
              right-7
              top-5
              text-3xl
              font-bold
            "
          >
            ✕
          </button>

          {/* 헤더 */}
          <PlannerHeader
            totalTime="-- : --"
            dday={dday}
            setDday={setDday}
          />

          {/* 메인 */}
          <div className="mt-6 flex flex-col gap-5">

            {/* task + timetable */}
            <div className="flex gap-5 min-w-0">

              {/* task */}
              <div className="w-[42%] min-w-0">

                <PlannerTaskList
                  tasks={tasks}
                  setTasks={setTasks}
                  toggleTask={toggleTask}
                />

              </div>

              {/* timetable */}
              <div className="flex-1 min-w-0">

                <PlannerTimetable
                  tasks={tasks}
                  timetable={timetable}
                  setTimetable={
                    setTimetable
                  }
                />

              </div>

            </div>

            {/* comment */}
            <div className="min-w-0">
              <PlannerComment
                comment={comment}
                setComment={setComment}
              />
            </div>

            {/* progress */}
            <PlannerProgress
              progress={progress}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Planner;