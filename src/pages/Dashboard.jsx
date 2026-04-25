import Timer from "../components/timer/Timer";
import TodoList from "../components/todo/TodoList";
import Memo from "../components/memo/Memo";
import deskSvg from "../assets/desk.svg";
import windowSvg from "../assets/window.svg";


function Dashboard() {
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
        <div className="absolute left-[30%] top-[7%] h-[53%] w-[26%] rounded-[4px] border-2 border-neutral-900 bg-white p-3 shadow-[3px_4px_0_rgba(0,0,0,0.14)] z-10">
          <div className="mx-auto mb-2 h-3 w-3 rounded-full border-2 border-red-700 bg-red-500" />
          <div className="border-b-2 border-neutral-900 pb-2">
            <p className="text-4xl leading-none text-neutral-900">April</p>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-medium">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className={`border border-neutral-900 py-1 ${
                    day === "SUN" ? "bg-red-500 text-white" : "bg-neutral-900 text-white"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-7 border-l border-t border-neutral-900 text-[10px] text-neutral-700 z-20">
            {Array.from({ length: 35 }, (_, index) => (
              <div
                key={index + 1}
                className="flex aspect-square items-start justify-start border-b border-r border-neutral-900 p-1"
              >
                {index < 30 ? index + 1 : ""}
              </div>
            ))}
          </div>
        </div>
        
        {/* Memo */}
        <div className="absolute left-[60%] top-[18%] z-10">
            <Memo />
        </div>
        
        {/* Timer */}
        <div className="absolute bottom-[19%] left-[34%] z-20">
          <Timer />
        </div>
        
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
        <div className="absolute bottom-[20%] left-[58%] h-[23%] w-[16%] rounded-[8px] border-2 border-neutral-900 bg-white shadow-[3px_4px_0_rgba(0,0,0,0.12)] z-20">
          <div className="mx-auto mt-[8%] h-[48%] w-[82%] rounded-[6px] border-2 border-neutral-900 bg-neutral-950" />
          <div className="mx-auto mt-[3%] h-[24%] w-[75%] rounded-b-[10px] border-2 border-neutral-500 bg-white" />
        </div>
        
        {/* Desk Lamp */}
        <div className="absolute bottom-[16%] right-[7%] h-[30%] w-[8%] z-20">
          <div className="absolute bottom-0 right-[12%] h-[18%] w-[44%] rounded-[14px] border-2 border-neutral-700 bg-white" />
          <div className="absolute bottom-[15%] right-[30%] h-[58%] w-px rotate-[22deg] bg-neutral-700" />
          <div className="absolute bottom-[69%] right-[38%] h-[26%] w-[44%] rotate-[20deg] rounded-t-full border-2 border-neutral-700 bg-white" />
        </div>
        
        {/* Todo List */}
        <div className="absolute left-[60%] bottom-[50%] right-[28%] w-[11%] z-20">
          <TodoList />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
