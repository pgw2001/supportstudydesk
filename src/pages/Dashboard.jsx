import DashboardLayout from "../components/layout/DashboardLayout";
import Timer from "../components/timer/Timer";
import TodoList from "../components/todo/TodoList";
import Memo from "../components/memo/Memo";

function Dashboard() {
  return (
    <DashboardLayout>
      <section className="relative min-h-[760px] overflow-hidden rounded-[12px] border border-neutral-300 bg-[#fcfbf8]">
        <div className="absolute left-[4%] top-[6%] h-[58%] w-[17%]">
          <div className="absolute bottom-0 left-[8%] h-full w-px bg-neutral-700" />
          <div className="absolute bottom-0 left-[20%] h-full w-px bg-neutral-700" />
          <div className="absolute bottom-0 left-[8%] h-[28%] w-[38%] -skew-x-[30deg] border-b border-l border-neutral-700" />
          <div className="absolute bottom-0 left-[20%] h-[28%] w-[38%] -skew-x-[30deg] border-b border-l border-neutral-700" />
        </div>

        <div className="absolute left-[21%] top-[14%] h-[34%] w-[26%] rounded-[4px] border-2 border-neutral-900 bg-white p-3 shadow-[3px_4px_0_rgba(0,0,0,0.14)]">
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
          <div className="mt-2 grid grid-cols-7 border-l border-t border-neutral-900 text-[10px] text-neutral-700">
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

        <div className="absolute left-[50%] top-[18%]">
          <Memo />
        </div>

        <div className="absolute bottom-[22%] left-[24%] h-[14%] w-[8%] rounded-t-[45%] border-2 border-neutral-700 bg-white">
          <div className="absolute -top-[34%] left-[18%] h-[46%] w-[64%] rounded-t-[50%] border-2 border-neutral-700 bg-white" />
        </div>

        <div className="absolute bottom-[19%] left-[34%]">
          <Timer />
        </div>

        <div className="absolute bottom-[21%] left-[46%] h-[15%] w-[8%] rounded-full border-2 border-neutral-800 bg-white">
          <div className="absolute left-1/2 top-[20%] h-[40%] w-px -translate-x-1/2 bg-neutral-900" />
          <div className="absolute left-1/2 top-1/2 h-px w-[26%] bg-neutral-900" />
          <div className="absolute -bottom-[16%] left-[18%] h-[20%] w-px rotate-[18deg] bg-neutral-900" />
          <div className="absolute -bottom-[16%] right-[18%] h-[20%] w-px -rotate-[18deg] bg-neutral-900" />
        </div>

        <div className="absolute bottom-[12%] left-[33%] h-[6%] w-[12%] rotate-[-18deg] rounded-[6px] border-2 border-neutral-700 bg-white" />

        <div className="absolute bottom-[11%] left-[15%] right-[4%] h-[29%] border-r-2 border-t-2 border-neutral-900 bg-white/35" />

        <div className="absolute bottom-[16%] left-[58%] h-[23%] w-[16%] rounded-[8px] border-2 border-neutral-900 bg-white shadow-[3px_4px_0_rgba(0,0,0,0.12)]">
          <div className="mx-auto mt-[8%] h-[48%] w-[82%] rounded-[6px] border-2 border-neutral-900 bg-neutral-950" />
          <div className="mx-auto mt-[3%] h-[24%] w-[75%] rounded-b-[10px] border-2 border-neutral-500 bg-white" />
        </div>

        <div className="absolute bottom-[16%] right-[7%] h-[30%] w-[8%]">
          <div className="absolute bottom-0 right-[12%] h-[18%] w-[44%] rounded-[14px] border-2 border-neutral-700 bg-white" />
          <div className="absolute bottom-[15%] right-[30%] h-[58%] w-px rotate-[22deg] bg-neutral-700" />
          <div className="absolute bottom-[69%] right-[38%] h-[26%] w-[44%] rotate-[20deg] rounded-t-full border-2 border-neutral-700 bg-white" />
        </div>

        <div className="absolute bottom-[16%] right-[28%]">
          <TodoList />
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;
