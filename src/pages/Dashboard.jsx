import { useRef, useState } from "react";
import Timer from "../components/timer/Timer";
import TodoList from "../components/todo/TodoList";
import Memo from "../components/memo/Memo";
import Quotes from "../components/quotes/Quotes";
import deskSvg from "../assets/desk.svg";
import windowSvg from "../assets/window.svg";
import Calendar from "../components/calendar/Calendar";
import Draggable from "../utils/Draggable";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";

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
          style={{ width: '28%' }}
        >
          <Calendar onExpandStateChange={setIsCalendarExpanded} />
        </Draggable>
        
        {/* Memo */}
        <Draggable initialLeft="61%" initialTop="18%" className="z-10" style={{ width: '16%' }}>
          <Memo />
        </Draggable>
        
        {/* Quotes */}
        <Draggable initialLeft="80%" initialTop="25%" className="z-10" style={{ width: '18%' }}>
          <Quotes />
        </Draggable>
        
        {/* Timer */}
        <Draggable initialLeft="34%" initialTop="68%" className="z-20" style={{ width: '22%' }}>
          <Timer />
        </Draggable>
        
        {/* Desk */}
        <div className="absolute top-[82%] left-[33%] h-[6%] w-[12%] rotate-[-18deg] rounded-[6px] border-2 border-neutral-700 bg-white" />
        <div className="absolute bottom-[0%] left-[19%] w-[81%] aspect-[1594/390] z-0">
          <img
            src={deskSvg}
            alt="desk"
            className="h-full w-full object-contain"
          />
        </div>
        
        {/* Todo List */}
        <Draggable initialLeft="61%" initialTop="38%" className="z-20" style={{ width: '14.5%' }}>
          <TodoList />
        </Draggable>

        {/* Music Player */}
        <Draggable initialLeft="70%" initialTop="50%" className="z-20" style={{ width: '26%'}}>
          <MusicPlayer />
        </Draggable>
      </main>
    </div>
  );
}

export default Dashboard;
