import { useState, useCallback } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import menubar from "../assets/menubar.svg";
import { Layout, Check } from "lucide-react";

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
import StudyPlant from "../components/study-plant/StudyPlant";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [totalFocusTime, setTotalFocusTime] = useState(0);

  // 배치 수정 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);

  // StyleBar 상태
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(1);

  // 타이머 틱 핸들러 (메모이제이션)
  const handleTick = useCallback(() => {
    setTotalFocusTime(prev => prev + 1);
  }, []);

  // Calendar 확대 상태
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-visible bg-[#f4f1ec]">
      <main className="relative aspect-[16/9] h-auto w-screen max-h-screen max-w-[calc(100vh*16/9)] overflow-visible bg-[#fcfbf8]">

        {/* 메뉴 버튼 */}
        {!isSidebarOpen && (
          <div className="absolute top-3 right-3 z-[999] flex gap-2">
            {/* 배치 수정 버튼 */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition shadow-sm ${
                isEditMode ? "bg-green-500 text-white" : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
              title={isEditMode ? "배치 완료" : "배치 수정"}
            >
              {isEditMode ? <Check size={20} /> : <Layout size={20} />}
            </button>
            
            <button
              onClick={() => setIsSidebarOpen(true)}
              className=""
            >
              <img
                src={menubar}
                alt="menu"
                className="w-8 h-8 opacity-70 hover:opacity-100 transition"
              />
            </button>
          </div>
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
          initialLeft="28%"
          initialTop="8%"
          className={isCalendarExpanded ? "z-[9999]" : "z-20"}
          style={{ width: "28%" }}
          disabled={!isEditMode}
        >
          <Calendar onExpandStateChange={setIsCalendarExpanded} />
        </Draggable>

        {/* Memo */}
        <Draggable
          initialLeft="61%"
          initialTop="18%"
          className="z-10"
          style={{ width: "16%" }}
          disabled={!isEditMode}
        >
          <Memo />
        </Draggable>
        
        {/* Quotes */}
        <Draggable initialLeft="80%" initialTop="25%" className="z-10" style={{ width: '18%' }} disabled={!isEditMode}>
          <Quotes />
        </Draggable>
        
        {/* Timer */}
        <Draggable
          initialLeft="34%"
          initialTop="auto"
          className="z-20"
          style={{ bottom: "19%" }}
          disabled={!isEditMode}
        >
          <Timer onTick={handleTick} />
        </Draggable>
        

        {/* Planner */}
        <Draggable
          initialLeft="70%"
          initialTop="80%"
          className="z-[999]"
          style={{ width: "25%" }}
          disabled={!isEditMode}
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
          disabled={!isEditMode}
        >
          <TodoList />
        </Draggable>

        {/* Music Player */}
        <Draggable initialLeft="70%" initialTop="50%" className="z-20" style={{ width: '26%'}} disabled={!isEditMode}>
          <MusicPlayer />
        </Draggable>

        {/* Study-Plant: 다시 Draggable로 감싸고 z-index를 높여 클릭 우선순위 확보 */}
        <Draggable initialLeft="45%" initialTop="68%" className="z-30" disabled={!isEditMode}>
          <StudyPlant focusTime={totalFocusTime} />
        </Draggable>


        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          setIsStyleOpen={setIsStyleOpen}
        />

      </main>
    </div>
  );
}

export default Dashboard;