import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import menubar from "../assets/menubar.svg";
import { Layout, Check, ImagePlus, RotateCcw, Upload } from "lucide-react";

import Timer from "../components/timer/Timer";
import TodoList from "../components/todo/TodoList";
import Memo from "../components/memo/Memo";
import Quotes from "../components/quotes/Quotes";
import deskSvg from "../assets/desk.svg";
import windowLayerSvg from "/assets/window/window_layer.svg";
import windowGlassLayerSvg from "/assets/window/window_glassLayer.svg"
import Calendar from "../components/calendar/Calendar";
import PlannerButton from "../components/planner/PlannerButton";
import Draggable from "../utils/Draggable";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";
import StudyPlant from "../components/study-plant/StudyPlant";
import Modal from "../components/common/modal";
import { useWindow } from "../components/window/useWindow";

const DEFAULT_WINDOW_BG = "/assets/window/window_bg.png";
const DASHBOARD_ASPECT_RATIO = 16 / 9;
const WINDOW_LAYOUT = {
  leftPercent: -38,
  topPercent: -53,
  widthPercent: 65,
  aspectWidth: 370,
  aspectHeight: 687,
};
const WINDOW_MASK_URL = 'url("/assets/window/mask.svg")';
const WINDOW_MASK_STYLE = {
  WebkitMaskImage: WINDOW_MASK_URL,
  maskImage: WINDOW_MASK_URL,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskMode: "alpha",
  maskMode: "alpha",
};

const getVisibleWindowCrop = () => {
  const viewportWidth = 100 * DASHBOARD_ASPECT_RATIO;
  const viewportHeight = 100;
  const windowWidth = (WINDOW_LAYOUT.widthPercent / 100) * viewportWidth;
  const windowHeight =
    windowWidth * (WINDOW_LAYOUT.aspectHeight / WINDOW_LAYOUT.aspectWidth);
  const windowLeft = (WINDOW_LAYOUT.leftPercent / 100) * viewportWidth;
  const windowTop = (WINDOW_LAYOUT.topPercent / 100) * viewportHeight;
  const visibleLeft = Math.max(0, windowLeft);
  const visibleTop = Math.max(0, windowTop);
  const visibleRight = Math.min(viewportWidth, windowLeft + windowWidth);
  const visibleBottom = Math.min(viewportHeight, windowTop + windowHeight);

  return {
    x: (visibleLeft - windowLeft) / windowWidth,
    y: (visibleTop - windowTop) / windowHeight,
    width: Math.max(0, visibleRight - visibleLeft) / windowWidth,
    height: Math.max(0, visibleBottom - visibleTop) / windowHeight,
  };
};

const WINDOW_VISIBLE_CROP = getVisibleWindowCrop();
const WINDOW_VISIBLE_PREVIEW_STYLE = {
  width: `${100 / WINDOW_VISIBLE_CROP.width}%`,
  height: `${100 / WINDOW_VISIBLE_CROP.height}%`,
  left: `${(-WINDOW_VISIBLE_CROP.x / WINDOW_VISIBLE_CROP.width) * 100}%`,
  top: `${(-WINDOW_VISIBLE_CROP.y / WINDOW_VISIBLE_CROP.height) * 100}%`,
};
const WINDOW_VISIBLE_PREVIEW_ASPECT =
  (WINDOW_VISIBLE_CROP.width * WINDOW_LAYOUT.aspectWidth) /
  (WINDOW_VISIBLE_CROP.height * WINDOW_LAYOUT.aspectHeight);

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 화분별 누적 학습 시간과 현재 책상에 놓인 화분 종류 관리
  const [plantProgress, setPlantProgress] = useState(() => {
    const savedProgress = localStorage.getItem("plantProgress");
    return savedProgress ? JSON.parse(savedProgress) : {
      rose: 0,
      sunflower: 0,
      hydrangea: 0,
      lilyOfTheValley: 0,
      hyacinth: 0
    };
  });
  const [activePlantType, setActivePlantType] = useState(() => {
    return localStorage.getItem("activePlantType") || 'rose';
  });

  // 데이터 변경 시 로컬 스토리지에 자동 저장
  useEffect(() => {
    localStorage.setItem("plantProgress", JSON.stringify(plantProgress));
    localStorage.setItem("activePlantType", activePlantType);
  }, [plantProgress, activePlantType]);

  // 배치 수정 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);

  // StyleBar 상태
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(1);

  // 타이머 틱 핸들러 (메모이제이션)
  const handleTick = useCallback(() => {
    setPlantProgress(prev => ({
      ...prev,
      [activePlantType]: (prev[activePlantType] || 0) + 1
    }));
  }, [activePlantType]);

  // Calendar 확대 상태
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

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
  } = useWindow(DEFAULT_WINDOW_BG);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-visible bg-[#f4f1ec]">
      <main className="relative aspect-[16/9] h-auto w-screen max-h-screen max-w-[calc(100vh*16/9)] overflow-hidden bg-[#fcfbf8]">

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

            {isEditMode && (
              <button
                onClick={openWindowEditor}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-gray-700 shadow-sm transition hover:bg-white"
                title="창 배경 수정"
              >
                <ImagePlus size={18} />
              </button>
            )}
            
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
        <div 
          className={`absolute left-[-38%] top-[-53%] w-[65%] aspect-[370/687] transition-all duration-300 ${isEditMode ? "z-50" : "z-10"}`}
          style={{ pointerEvents: isEditMode ? 'auto' : 'none' }}
        >
          {/* 1. 사용자 배경 레이어 (가장 뒤) */}
          <div className="absolute left-[4%] top-0 h-full w-full z-0 pointer-events-none">
            <div
              ref={windowFrameRef}
              className="absolute inset-0 overflow-hidden"
              style={WINDOW_MASK_STYLE}
            >
              <img
                src={windowBg}
                alt="user window background"
                className="absolute max-w-none select-none"
                style={windowImageStyle}
                draggable={false}
              />
            </div>
            {/* RoughJS 스타일의 외곽선 틀을 배경 레이어에도 추가 */}
            <img
              src={windowLayerSvg}
              alt="window background frame outline"
              className="absolute inset-0 h-full w-full object-contain fill-none"
            />
          </div>
          {/* 2. 유리 레이어 */}
          <img
            src={windowGlassLayerSvg}
            alt="windowGlass"
            className="absolute left-[7%] opacity-60 h-full w-full object-contain z-10 pointer-events-none"
          />
          {/* 3. 창틀 레이어 (가장 앞) */}
          <img
            src={windowLayerSvg}
            alt="window"
            className="absolute left-[10%] h-full w-full object-contain fill-none z-20 pointer-events-none"
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

        <div className="absolute bottom-[0%] left-[17%] w-[100%] aspect-[2244/389] z-0">
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
          <StudyPlant 
            plantProgress={plantProgress} 
            activePlantType={activePlantType} 
            onPlantChange={setActivePlantType} 
          />
        </Draggable>


        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          setIsStyleOpen={setIsStyleOpen}
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
                이미지를 올린 뒤, 미리보기 안에서 드래그해서 창 안 위치를 맞춰주세요.
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
                style={{ aspectRatio: `${WINDOW_VISIBLE_PREVIEW_ASPECT}` }}
              >
                <div
                  className="absolute"
                  style={WINDOW_VISIBLE_PREVIEW_STYLE}
                >
                  <div
                    ref={previewFrameRef}
                    className="absolute left-[4%] top-0 h-full w-full overflow-hidden cursor-grab active:cursor-grabbing touch-none z-10"
                    style={WINDOW_MASK_STYLE}
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
                    alt="window preview frame back"
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
