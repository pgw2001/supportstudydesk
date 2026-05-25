import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import rough from 'roughjs';

const MODAL_SEED = 1234; // 일관된 RoughJS 드로잉을 위한 고유 시드

// 포스트잇 플래그 컴포넌트
const TabFlag = ({ label, isActive, onClick, color = "#fff", seedOffset = 0 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = "";
      const rc = rough.svg(svgRef.current);
      const rect = rc.rectangle(2, 2, 76, 26, {
        fill: color,
        fillStyle: 'solid',
        stroke: '#000',
        strokeWidth: 1.5,
        roughness: 1.2,
        seed: MODAL_SEED + seedOffset
      });
      svgRef.current.appendChild(rect);
    }
  }, [color, seedOffset]);

  return (
    <div 
      onClick={onClick}
      className={`relative w-20 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 
        ${isActive ? '-translate-y-1 z-10' : 'translate-y-1 opacity-80 hover:translate-y-0'}`}
    >
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 80 30" preserveAspectRatio="none" />
      <span className="relative z-10 text-xs font-bold truncate px-2 select-none">
        {label}
      </span>
    </div>
  );
};

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  tabs = [], // [{ id, label, content, color, title }] 형태의 배열
  activeTabId,
  onTabChange,
  width = "300px", // 기본 너비
  height = "auto", // 기본 높이 (콘텐츠에 따라 조절)
  className = "", // 내부 콘텐츠 div에 추가할 클래스
  style = {}, // 추가: 외부에서 전달된 인라인 스타일 지원
}) => {
  const containerRef = useRef(null); // RoughJS 드로잉의 기준이 될 메인 컨테이너
  const svgRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // 탭 관련 상태 관리
  const [localActiveTabId, setLocalActiveTabId] = useState(tabs[0]?.id);
  const currentTabId = activeTabId || localActiveTabId;
  
  const currentTab = tabs.find(t => t.id === currentTabId) || tabs[0];
  const displayTitle = tabs.length > 0 ? (currentTab?.title || currentTab?.label) : title;
  const displayContent = tabs.length > 0 ? currentTab?.content : children;

  const handleTabClick = (id) => {
    if (onTabChange) onTabChange(id);
    else setLocalActiveTabId(id);
  };

  // 핸들러가 항상 최신 위치를 참조할 수 있도록 하되, 핸들러 자체는 재생성되지 않게 Ref를 사용합니다.
  const positionRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // 모달이 다시 열릴 때 위치 초기화 (중앙에서 시작하도록)
  useEffect(() => {
    if (!isOpen) {
      setPosition({ x: 0, y: 0 });
      positionRef.current = { x: 0, y: 0 };
    }
  }, [isOpen]);

  const handlePointerDown = useCallback((e) => {
    // 닫기 버튼이나 입력창 클릭 시에는 드래그 방지
    if (e.target.closest('button') || e.target.closest('input')) return;
    
    isDragging.current = true;
    // position 상태 대신 positionRef를 사용하여 핸들러의 의존성을 제거합니다 (안정성 확보)
    dragStart.current = { 
      x: e.clientX - positionRef.current.x, 
      y: e.clientY - positionRef.current.y 
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []); // 의존성 제거: 핸들러가 절대 바뀌지 않음

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    
    const nextX = e.clientX - dragStart.current.x;
    const nextY = e.clientY - dragStart.current.y;
    
    positionRef.current = { x: nextX, y: nextY };
    setPosition({ x: nextX, y: nextY });
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (isDragging.current) {
      isDragging.current = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  }, []);

  // 컨테이너의 실제 크기를 측정하는 함수
  const measureContainer = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      // RoughJS 스트로크가 잘리지 않도록 약간의 버퍼 추가
      const buffer = 6;
      const newWidth = offsetWidth + buffer;
      const newHeight = offsetHeight + buffer;
      
      setContainerDimensions(prev => {
        // 실제 크기 변화가 1px 미만이면 업데이트하지 않음 (무한 루프 방지)
        if (Math.abs(prev.width - newWidth) < 1 && Math.abs(prev.height - newHeight) < 1) return prev;
        return { width: newWidth, height: newHeight };
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // ResizeObserver를 사용하여 실제 박스 크기 변화만 감지
    const resizeObserver = new ResizeObserver(measureContainer);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, measureContainer]);

  // 컨테이너 크기가 변경될 때 RoughJS를 다시 그립니다.
  useEffect(() => {
    if (isOpen && svgRef.current && containerDimensions.width > 0 && containerDimensions.height > 0) {
      svgRef.current.innerHTML = ""; // 이전 드로잉 제거
      const rc = rough.svg(svgRef.current);

      // RoughJS 사각형 그리기 (viewBox 내부에 3px 마진을 두어 스트로크가 잘리지 않도록 함)
      const rect = rc.rectangle(
        3, // x
        3, // y
        containerDimensions.width - 6, // width
        containerDimensions.height - 6, // height
        {
          fill: '#fff', // 흰색 배경
          fillStyle: 'solid',
          stroke: '#000', // 검은색 테두리
          strokeWidth: 2,
          roughness: 1.5,
          bowing: 1,
          seed: MODAL_SEED
        }
      );
      svgRef.current.appendChild(rect);
    }
  }, [isOpen, containerDimensions]);

  if (!isOpen) return null;

  // width/height prop이 Tailwind 클래스인지 직접적인 CSS 값인지 판별
  const isTailwindWidth = typeof width === 'string' && (width.startsWith('w-') || width.startsWith('max-w-'));
  const isTailwindHeight = typeof height === 'string' && (height.startsWith('h-') || height.startsWith('max-h-') || height.startsWith('min-h-') || height === 'auto');

  return createPortal(
    <div
      className="fixed inset-0 z-[1000000] flex items-center justify-center pointer-events-none p-4"
    >
      <div
        ref={containerRef} // 이 div의 크기를 측정하여 RoughJS를 그립니다.
        className={`relative flex flex-col p-4 pointer-events-auto ${className}`}
        style={{
          width: isTailwindWidth ? undefined : width,
          height: isTailwindHeight ? undefined : height,
          minWidth: "100px", // 최소 너비
          minHeight: "100px", // 최소 높이
          transform: `translate(${position.x}px, ${position.y}px)`,
          touchAction: 'none', // 터치 드래그를 위한 필수 설정
          fontFamily: "'Comic Sans MS', 'Pretendard', cursive",
          ...style, // 전달받은 스타일(fontFamily 등)을 적용하여 기본 폰트를 덮어씌움
        }}
      >
        {/* RoughJS 배경 SVG */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full -z-10 overflow-visible"
          viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}
          preserveAspectRatio="none"
        />

        {/* 포스트잇 플래그 탭 영역 */}
        {tabs.length > 0 && (
          <div className="absolute -top-[27px] left-2 flex gap-0.5 items-end">
            {tabs.map((tab, index) => (
              <TabFlag
                key={tab.id}
                label={tab.label}
                isActive={currentTabId === tab.id}
                color={tab.color}
                seedOffset={index * 10}
                onClick={() => handleTabClick(tab.id)}
              />
            ))}
          </div>
        )}

        {/* 드래그 핸들 영역: 제목과 X버튼이 있는 상단 바에서만 드래그 가능 */}
        <div
          data-no-drag="true" // 부모 Draggable(Dashboard)이 이 영역의 클릭을 무시하도록 설정
          className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp} // 드래그 도중 중단되는 예외 상황 대응
        >
          {displayTitle ? (
            <h3 className="text-lg font-semibold leading-none">{displayTitle}</h3>
          ) : (
            <div /> // 제목이 없을 때도 닫기 버튼 배치를 위해 공간 유지
          )}

          <button
            onClick={onClose}
            className="text-xl font-bold text-black hover:scale-110 hover:text-red-500 transition-all px-1 leading-none"
          >
            ✕
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-grow overflow-auto">
          {displayContent}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;