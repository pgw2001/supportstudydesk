import { useState, useCallback, useEffect, useRef } from "react";
import { Check, CloudRain, ImagePlus, Layout, RotateCcw, Upload } from "lucide-react";
import Sidebar from "../components/sidebar/Sidebar";
import Timer from "../components/timer/Timer";
import TodoList from "../components/todo/TodoList";
import Memo from "../components/memo/Memo";
import Quotes from "../components/quotes/Quotes";
import Calendar from "../components/calendar/Calendar";
import PlannerButton from "../components/planner/PlannerButton";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";
import StudyPlant from "../components/study-plant/StudyPlant";
import Modal from "../components/common/modal";
import Draggable from "../utils/Draggable";
import { useWindow } from "../components/window/useWindow";
import RainyWindowOverlay from "../components/window/RainyWindowOverlay";
import { getLocalDateString } from "../utils/dateUtils";
import menubar from "../assets/menubar.svg";
import deskSvg from "../assets/desk.svg";
import windowLayerSvg from "/assets/window/window_layer.svg";
import windowGlassLayerSvg from "/assets/window/window_glassLayer.svg";

const DEFAULT_WINDOW_BG = "/assets/window/window_bg.png";
const WIDGET_POSITIONS_KEY = "widgetPositions";

const DEFAULT_POSITIONS = {
  calendar: { left: "28%", top: "8%" },
  memo: { left: "61%", top: "18%" },
  quotes: { left: "80%", top: "25%" },
  timer: { left: "34%", top: "auto" }, // style에서 bottom 사용 중
  planner: { left: "70%", top: "80%" },
  todo: { left: "60%", top: "auto" }, // style에서 bottom, right 사용 중
  music: { left: "70%", top: "50%" },
  plant: { left: "45%", top: "68%" },
};

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const [widgetPositions, setWidgetPositions] = useState(() => {
    const saved = localStorage.getItem(WIDGET_POSITIONS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_POSITIONS;
  });

  const handleDragEnd = (id, pos) => {
    setWidgetPositions(prev => {
      const next = { ...prev, [id]: pos };
      localStorage.setItem(WIDGET_POSITIONS_KEY, JSON.stringify(next));
      return next;
    });
  };


  // 화분별 누적 학습 시간과 현재 책상에 놓인 화분 종류 관리
  const [plantProgress, setPlantProgress] = useState(() => {
    const savedProgress = localStorage.getItem("plantProgress");

    return savedProgress
      ? JSON.parse(savedProgress)
      : {
          rose: 0,
          sunflower: 0,
          hydrangea: 0,
          lilyOfTheValley: 0,
          hyacinth: 0,
        };
  });

  const [activePlantType, setActivePlantType] = useState(() => {
    return localStorage.getItem("activePlantType") || "rose";
  });

  useEffect(() => {
    localStorage.setItem("plantProgress", JSON.stringify(plantProgress));
    localStorage.setItem("activePlantType", activePlantType);
  }, [plantProgress, activePlantType]);

  // 일간 공부 시간 데이터 관리 (성장 화분 방식과 동일)
  const [dailyStudyTime, setDailyStudyTime] = useState(() => {
    const saved = localStorage.getItem("dailyStudyTime");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("dailyStudyTime", JSON.stringify(dailyStudyTime));
  }, [dailyStudyTime]);

  const handleTick = useCallback(() => {
    const todayStr = getLocalDateString(new Date());
    setDailyStudyTime(prev => ({
      ...prev,
      [todayStr]: (prev[todayStr] || 0) + 1
    }));

    setPlantProgress((prev) => ({
      ...prev,
      [activePlantType]: (prev[activePlantType] || 0) + 1,
    }));
  }, [activePlantType]);
  
  const [
  deskTimerDisplay,
  setDeskTimerDisplay,
  ] = useState("00:00");

  const [taskCount, setTaskCount] =
  useState(0);

  const {
    fileInputRef,
    windowBg,
    isWindowModalOpen,
    draftBg,
    openWindowEditor,
    closeWindowEditor,
    applyWindowBackground,
    resetDraftWindowBackground,
    draftScale,
    updateDraftScale,
    minScale,
    maxScale,
    triggerFilePicker,
    handleWindowBgChange,
    previewPointerHandlers,
    windowFrameRef,
    previewFrameRef,
    windowImageStyle,
    previewImageStyle,
    windowMaskStyle,
    previewContainerStyle,
    windowButtonStyle,
    previewAspect,
    isWindowRainEnabled,
    setIsWindowRainEnabled,
    windowRainIntensity,
    setWindowRainIntensity,
  } = useWindow(DEFAULT_WINDOW_BG);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-visible bg-[#f4f1ec]">
      <main className="relative aspect-[16/9] h-auto w-screen max-h-screen max-w-[calc(100vh*16/9)] overflow-hidden bg-[#fcfbf8]">
        {/* 비 효과 활성 시 화면 전체를 우중충하고 흐리게 만드는 분위기 레이어 */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-1000 z-[1000]"
          style={{
            backgroundColor: isWindowRainEnabled 
              ? `rgba(35, 45, 65, ${0.05 + windowRainIntensity * 0.12})` 
              : "transparent",
            backdropFilter: isWindowRainEnabled 
              ? `brightness(${1 - windowRainIntensity * 0.1}) saturate(${1 - windowRainIntensity * 0.3})` 
              : "none",
            WebkitBackdropFilter: isWindowRainEnabled 
              ? `brightness(${1 - windowRainIntensity * 0.1}) saturate(${1 - windowRainIntensity * 0.3})` 
              : "none",
          }}
        />
        {!isSidebarOpen && (
          <div className="absolute top-3 right-3 z-[999] flex gap-2">
            <button
              onClick={() => setIsEditMode((prev) => !prev)}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition ${
                isEditMode
                  ? "bg-green-500 text-white"
                  : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
              title={isEditMode ? "배치 완료" : "배치 수정"}
            >
              {isEditMode ? <Check size={20} /> : <Layout size={20} />}
            </button>

            {isEditMode && (
              <button
                onClick={openWindowEditor}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition hover:bg-white"
                title="창 배경 수정"
              >
                <ImagePlus size={18} />
              </button>
            )}

            <button onClick={() => setIsSidebarOpen(true)}>
              <img
                src={menubar}
                alt="menu"
                className="h-8 w-8 opacity-70 transition hover:opacity-100"
              />
            </button>
          </div>
        )}

        <div 
          className="group absolute left-[-38%] top-[-53%] aspect-[370/687] w-[65%] transition-all duration-300 z-[1]"
          style={{ pointerEvents: "auto" }}
        >
          <div className="absolute left-[4%] top-0 h-full w-full z-0 pointer-events-none">
            {/* 배경과 비 레이어를 하나의 마스크 컨테이너로 통합 */}
            <div
              ref={windowFrameRef}
              className="absolute inset-0 overflow-hidden"
              style={windowMaskStyle}
            >
              <img
                src={windowBg}
                alt="user window background"
                className="absolute max-w-none select-none"
                style={windowImageStyle}
                draggable={false}
              />
              {/* 비 레이어를 배경 이미지 바로 위에 배치 */}
              <RainyWindowOverlay 
                enabled={isWindowRainEnabled} 
                intensity={windowRainIntensity}
              />
            </div>

            <img
              src={windowLayerSvg}
              alt="window background frame outline"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>

          <img
            src={windowGlassLayerSvg}
            alt="window glass"
            className="absolute left-[7%] z-10 h-full w-full object-contain opacity-60 pointer-events-none"
          />
          <img
            src={windowLayerSvg}
            alt="window front frame"
            className="absolute left-[10%] z-20 h-full w-full object-contain pointer-events-none"
          />

          <div
            className="absolute inset-0 z-30 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <div className="absolute z-30 flex flex-col items-center gap-3" style={windowButtonStyle}>
              <button
                type="button"
                onClick={() => setIsWindowRainEnabled((prev) => !prev)}
                className={`pointer-events-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 font-['Patrick_Hand'] text-sm shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-[3px] transition ${
                  isWindowRainEnabled
                    ? "border-black/15 bg-white/90 text-black"
                    : "border-black/10 bg-[#f7f3eb]/88 text-black/70"
                }`}
                title={isWindowRainEnabled ? "비 끄기" : "비 켜기"}
              >
                <CloudRain size={16} />
                <span>{isWindowRainEnabled ? "Rain Off" : "Rain On"}</span>
              </button>

              {isWindowRainEnabled && (
                <div className="pointer-events-auto flex flex-col items-center gap-1 rounded-2xl border border-black/10 bg-white/80 p-3 shadow-sm backdrop-blur-md">
                  <div className="flex w-full justify-between px-1 font-['Patrick_Hand'] text-[10px] text-black/50">
                    <span>Light</span>
                    <span>Heavy</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={windowRainIntensity}
                    onChange={(e) => setWindowRainIntensity(parseFloat(e.target.value))}
                    className="h-1.5 w-24 cursor-pointer appearance-none rounded-lg bg-black/10 accent-black"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Draggable
          initialLeft={widgetPositions.calendar.left}
          initialTop={widgetPositions.calendar.top}
          onDragEnd={(pos) => handleDragEnd("calendar", pos)}
          className={isCalendarExpanded ? "z-[9999]" : "z-20"}
          style={{ width: "28%" }}
          disabled={!isEditMode}
        >
          <Calendar 
            onExpandStateChange={setIsCalendarExpanded} 
            dailyStudyTime={dailyStudyTime}
          />
        </Draggable>

        <Draggable
          initialLeft={widgetPositions.memo.left}
          initialTop={widgetPositions.memo.top}
          onDragEnd={(pos) => handleDragEnd("memo", pos)}
          className="z-10"
          style={{ width: "16%" }}
          disabled={!isEditMode}
        >
          <Memo />
        </Draggable>

        <Draggable
          initialLeft={widgetPositions.quotes.left}
          initialTop={widgetPositions.quotes.top}
          onDragEnd={(pos) => handleDragEnd("quotes", pos)}
          className="z-10"
          style={{ width: "18%" }}
          disabled={!isEditMode}
        >
          <Quotes />
        </Draggable>

        <Draggable
          initialLeft={widgetPositions.timer.left}
          initialTop={widgetPositions.timer.top}
          onDragEnd={(pos) => handleDragEnd("timer", pos)}
          className="z-20"
          style={
            widgetPositions.timer.top === "auto"
              ? { bottom: "19%" }
              : {}
          }
          disabled={!isEditMode}
        >
          <Timer
          onTick={handleTick}
          onPomoTick={handleTick} 
          onPomodoroTick={handleTick}
          setDeskTimerDisplay={
          setDeskTimerDisplay
          }
          />
        </Draggable>

        <Draggable
          initialLeft={widgetPositions.planner.left}
          initialTop={widgetPositions.planner.top}
          onDragEnd={(pos) => handleDragEnd("planner", pos)}
          className="z-[30]"
          style={{ width: "25%" }}
          disabled={!isEditMode}
        >
          <div className="p-2">
            <PlannerButton />
          </div>
        </Draggable>

        <div className="absolute top-[82%] left-[33%] h-[6%] w-[12%] rotate-[-18deg] rounded-[6px] border-2 border-neutral-700 bg-white" />

        <div className="absolute bottom-[0%] left-[17%] z-0 aspect-[2244/389] w-[100%]">
          <img src={deskSvg} alt="desk" className="h-full w-full object-contain" />
        </div>

        <Draggable
          initialLeft={widgetPositions.todo.left}
          initialTop={widgetPositions.todo.top}
          onDragEnd={(pos) => handleDragEnd("todo", pos)}
          className="z-20"
          style={{
            ...(widgetPositions.todo.top === "auto" ? { bottom: "50%", right: "28%" } : {}),
            width: "11%",
          }}
          disabled={!isEditMode}
        >
          <TodoList setTaskCount={setTaskCount} />
        </Draggable>

        <Draggable
          initialLeft={widgetPositions.music.left}
          initialTop={widgetPositions.music.top}
          onDragEnd={(pos) => handleDragEnd("music", pos)}
          className="z-20"
          style={{ width: "26%" }}
          disabled={!isEditMode}
        >
          <MusicPlayer />
        </Draggable>

        <Draggable
          initialLeft={widgetPositions.plant.left}
          initialTop={widgetPositions.plant.top}
          onDragEnd={(pos) => handleDragEnd("plant", pos)}
          className="z-30"
          disabled={!isEditMode}
        >
          <StudyPlant
            plantProgress={plantProgress}
            activePlantType={activePlantType}
            onPlantChange={setActivePlantType}
          />
        </Draggable>

        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          deskTimerDisplay={deskTimerDisplay}
          taskCount={taskCount}
          deskTimerTime={dailyStudyTime[getLocalDateString(new Date())] || 0}
        />

        <Modal
          isOpen={isWindowModalOpen}
          onClose={closeWindowEditor}
          title="창 배경 꾸미기"
          width="min(92vw, 720px)"
          className="font-['Patrick_Hand']"
        >
          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleWindowBgChange}
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-black/65">
                이미지를 올린 뒤 미리보기 안에서 드래그해서 위치를 맞춰주세요.
              </p>
              <button
                type="button"
                onClick={triggerFilePicker}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-[#f7efe2] px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-[#f3e6d3]"
              >
                <Upload size={16} />
                이미지 불러오기
              </button>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-[#f8f3ea] p-5">
              <div
                className="mx-auto relative w-full max-w-[220px] overflow-hidden rounded-[24px] border border-black/10 bg-white"
                style={{ aspectRatio: `${previewAspect}` }}
              >
                <div className="absolute" style={previewContainerStyle}>
                  <div
                    ref={previewFrameRef}
                    className="absolute left-[4%] top-0 h-full w-full overflow-hidden cursor-grab touch-none active:cursor-grabbing"
                    style={windowMaskStyle}
                    {...previewPointerHandlers}
                  >
                    <img
                      src={draftBg}
                      alt="window preview"
                      className="absolute max-w-none select-none pointer-events-none"
                      style={previewImageStyle}
                      draggable={false}
                    />
                  </div>
                  <img
                    src={windowLayerSvg}
                    alt="window preview back frame"
                    className="absolute left-[4%] h-full w-full object-contain pointer-events-none"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-black/65">
                  <span>배경 배율</span>
                  <span>{draftScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={minScale}
                  max={maxScale}
                  step="0.01"
                  value={draftScale}
                  onChange={(event) => updateDraftScale(Number(event.target.value))}
                  className="w-full accent-[#2f7d32]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetDraftWindowBackground}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm transition hover:bg-black/5"
              >
                <RotateCcw size={16} />
                기본 배경으로 되돌리기
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeWindowEditor}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm transition hover:bg-black/5"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={applyWindowBackground}
                  className="rounded-full bg-[#2f7d32] px-4 py-2 text-sm text-white transition hover:bg-[#27682a]"
                >
                  적용
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default Dashboard;
