import { useRef, useState } from "react";
import Timer from "../components/timer/Timer";
import TodoList from "../components/todo/TodoList";
import Memo from "../components/memo/Memo";
import deskSvg from "../assets/desk.svg";
import windowSvg from "../assets/window.svg";
import Calendar from "../components/calendar/Calendar";
import Draggable from "../utils/Draggable";

function Dashboard() {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f1ec]">
      <main className="relative aspect-[16/9] h-auto w-screen max-h-screen max-w-[calc(100vh*16/9)] overflow-hidden bg-[#fcfbf8]">
        {/* Window */}
        <div className="absolute left-[0%] top-[0%] w-[30%] aspect-[370/687] z-0">
          <img
            src={windowSvg}
            alt="window"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Calendar */}
        <Draggable 
          initialLeft="8%" 
          initialTop="7%" 
          className={isCalendarExpanded ? "z-[9999]" : "z-20"}
        >
          <Calendar onExpandStateChange={setIsCalendarExpanded} />
        </Draggable>
        
        {/* Memo */}
        <Draggable initialLeft="60%" initialTop="18%" className="z-10">
          <Memo />
        </Draggable>
        
        {/* Timer */}
        <Draggable initialLeft="34%" initialTop="auto" className="z-20" style={{ bottom: '19%' }}>
          <Timer />
        </Draggable>
        
        {/* 자명종 시계 */}
        <div className="absolute bottom-[21%] left-[46%] h-[10%] w-[6%] rounded-full border-2 border-neutral-800 bg-white z-20">
            <div className="absolute left-1/2 top-[20%] h-[40%] w-px -translate-x-1/2 bg-neutral-900" />
            <div className="absolute left-1/2 top-1/2 h-px w-[26%] bg-neutral-900" />
            <div className="absolute -bottom-[16%] left-[18%] h-[20%] w-px rotate-[18deg] bg-neutral-900" />
            <div className="absolute -bottom-[16%] right-[18%] h-[20%] w-px -rotate-[18deg] bg-neutral-900" />
        </div>
        
        {/* Desk */}
        <div className="absolute bottom-[12%] left-[33%] h-[6%] w-[12%] rotate-[-18deg] rounded-[6px] border-2 border-neutral-700 bg-white" />
        <div className="absolute bottom-[0%] left-[19%] w-[81%] aspect-[1594/390] z-0">
          <img
            src={deskSvg}
            alt="desk"
            className="h-full w-full object-contain"
          />
        </div>
        
        {/* Monitor */}
          <div className="absolute bottom-[20%] left-[58%] h-[23%] w-[16%] rounded-[8px] border-2 border-neutral-900 bg-white shadow-[3px_4px_0_rgba(0,0,0,0.12)]">
            <div className="mx-auto mt-[8%] h-[48%] w-[82%] rounded-[6px] border-2 border-neutral-900 bg-neutral-950" />
            <div className="mx-auto mt-[3%] h-[24%] w-[75%] rounded-b-[10px] border-2 border-neutral-500 bg-white" />
          </div>
        
        {/* Desk Lamp */}
        <div className="absolute bottom-[16%] right-[7%] h-[30%] w-[8%] z-20">
          <div className="h-[30%] w-[8%]">
            <div className="absolute bottom-0 right-[12%] h-[18%] w-[44%] rounded-[14px] border-2 border-neutral-700 bg-white" />
            <div className="absolute bottom-[15%] right-[30%] h-[58%] w-px rotate-[22deg] bg-neutral-700" />
            <div className="absolute bottom-[69%] right-[38%] h-[26%] w-[44%] rotate-[20deg] rounded-t-full border-2 border-neutral-700 bg-white" />
          </div>
        </div>
        
        {/* Todo List */}
        <Draggable initialLeft="60%" initialTop="auto" className="z-20" style={{ bottom: '50%', right: '28%', width: '11%' }}>
          <TodoList />
        </Draggable>
      </main>
    </div>
  );
}

export default Dashboard;
