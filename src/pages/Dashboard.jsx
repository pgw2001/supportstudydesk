import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import StyleBar from "../components/stylebar/StyleBar";
import menubar from "../assets/menubar.svg";

import Timer from "../components/timer/Timer";
import TodoList from "../components/todo/TodoList";
import Memo from "../components/memo/Memo";
import Quotes from "../components/quotes/Quotes";
import deskSvg from "../assets/desk.svg";
import windowSvg from "../assets/window.svg";
import Calendar from "../components/calendar/Calendar";
import PlannerButton from "../components/planner/PlannerButton";
import Draggable from "../utils/Draggable";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // StyleBar 상태
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(1);

  // Calendar 확대 상태
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-visible bg-[#f4f1ec]">
      <main className="relative aspect-[16/9] h-auto w-screen max-h-screen max-w-[calc(100vh*16/9)] overflow-visible bg-[#fcfbf8]">

        {/* 메뉴 버튼 */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-3 right-3 z-[999]"
          >
            <img
              src={menubar}
              alt="menu"
              className="w-8 h-8 opacity-70 hover:opacity-100 transition"
            />
          </button>
        )}

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
          style={{ width: "28%" }}
        >
          <Calendar onExpandStateChange={setIsCalendarExpanded} />
        </Draggable>

        {/* Memo */}
        <Draggable
          initialLeft="61%"
          initialTop="18%"
          className="z-10"
          style={{ width: "16%" }}
        >
          <Memo />
        </Draggable>
        
        {/* Quotes */}
        <Draggable initialLeft="80%" initialTop="25%" className="z-10" style={{ width: '18%' }}>
          <Quotes />
        </Draggable>
        
        {/* Timer */}
        <Draggable
          initialLeft="34%"
          initialTop="auto"
          className="z-20"
          style={{ bottom: "19%" }}
        >
          <Timer />
        </Draggable>
        

        {/* Planner */}
        <Draggable
          initialLeft="70%"
          initialTop="80%"
          className="z-[999]"
          style={{ width: "25%" }}
        >
          <div className="p-2">
            <PlannerButton />
          </div>
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
        <Draggable
          initialLeft="60%"
          initialTop="auto"
          className="z-20"
          style={{
            bottom: "50%",
            right: "28%",
            width: "11%",
          }}
        >
          <TodoList />
        </Draggable>

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          setIsStyleOpen={setIsStyleOpen}
        />

        {/* StyleBar */}
        <StyleBar
          isOpen={isStyleOpen}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          setIsStyleOpen={setIsStyleOpen}
        />

        {/* Music Player */}
        <Draggable initialLeft="70%" initialTop="50%" className="z-20" style={{ width: '26%'}}>
          <MusicPlayer />
        </Draggable>
      </main>
    </div>
  );
}

export default Dashboard;