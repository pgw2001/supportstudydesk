import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

import PlannerHeader from "./PlannerHeader";
import PlannerTaskList from "./PlannerTaskList";
import PlannerTimetable from "./PlannerTimetable";
import PlannerComment from "./PlannerComment";
import PlannerProgress from "./PlannerProgress";

function Planner({ onClose }) {
  const svgRef = useRef(null);

  const savedData = JSON.parse(
  localStorage.getItem("planner") || "{}"
);

const [tasks, setTasks] = useState(
  savedData.tasks || []
);

const [comment, setComment] =
  useState(savedData.comment || "");

const [dday, setDday] = useState(
  savedData.dday || ""
);

const [blocks, setBlocks] = useState(
  savedData.blocks || []
);

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

    // 메인 배경
    group.appendChild(
      rc.rectangle(10, 10, 980, 680, {
        roughness: 1.5,
        fill: "#fcfaf5",
        fillStyle: "solid",
        stroke: "#222",
        strokeWidth: 2,
      })
    );

    svg.appendChild(group);
  }, []);


  // localStorage 저장
  useEffect(() => {
    localStorage.setItem(
      "planner",
      JSON.stringify({
        tasks,
        comment,
        dday,
        blocks,
        timetable,
      })
    );
  }, [tasks, comment, dday, blocks, timetable]);

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

      {/* 메인 */}
      <div className="relative h-[700px] w-[1000px]">

        {/* rough 배경 */}
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
              right-8
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

          {/* 메인 컨텐츠 */}
          <div className="mt-8 flex gap-8">

            {/* 좌측 */}
            <div className="w-[58%]">

              <PlannerTaskList
                tasks={tasks}
                setTasks={setTasks}
                toggleTask={toggleTask}
                setBlocks={setBlocks}
              />

              <PlannerComment
                comment={comment}
                setComment={setComment}
              />

            </div>

            {/* 우측 timetable */}
            <PlannerTimetable
              tasks={tasks}
              timetable={timetable}
              setTimetable={setTimetable}
            />

          </div>

          {/* 진행률 */}
          <PlannerProgress
            progress={progress}
          />

        </div>
      </div>
    </div>
  );
}

export default Planner;