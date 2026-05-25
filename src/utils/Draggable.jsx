import { useEffect, useRef, useState } from "react";

function Draggable({ children, initialLeft = "0%", initialTop = "0%", className = "", style = {}, disabled = false, onDragEnd }) {
  const [position, setPosition] = useState({ left: initialLeft, top: initialTop });

  useEffect(() => {
  setPosition({
    left: initialLeft,
    top: initialTop,
  });
  }, [initialLeft, initialTop]);

  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0, left: 0, top: 0 });

  const onPointerDown = (e) => {
    // 비활성화 상태면 드래그 방지
    if (disabled) return;

    // 오버레이가 자식 요소 위에 놓여 있어 e.target이 항상 오버레이가 되는 문제를 해결하기 위해
    // 현재 포인터 위치 아래 실제 요소를 확인합니다. 이렇게 하면 오버레이가 이벤트를 가로채더라도
    // 실질적으로 클릭된(또는 눌린) 내부 요소를 기반으로 드래그 허용 여부를 판단할 수 있습니다.
    const underlyingEl = document.elementFromPoint(e.clientX, e.clientY);
    if (underlyingEl && underlyingEl.closest('button, input, textarea, [data-no-drag="true"]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();

    dragging.current = true;
    setIsDragging(true);
    origin.current = {
      x: e.clientX,
      y: e.clientY,
      // 현재 위치를 부모 대비 %로 계산하여 저장
      left: ((rect.left - parentRect.left) / parentRect.width) * 100,
      top: ((rect.top - parentRect.top) / parentRect.height) * 100,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;

    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    
    // 마우스 이동 거리를 부모 너비/높이 대비 % 변화량으로 변환
    const dxPct = ((e.clientX - origin.current.x) / parentRect.width) * 100;
    const dyPct = ((e.clientY - origin.current.y) / parentRect.height) * 100;

    setPosition({ 
      left: `${origin.current.left + dxPct}%`, 
      top: `${origin.current.top + dyPct}%` 
    });
  };

  const onPointerUp = (e) => {
    if (dragging.current && onDragEnd) {
      onDragEnd(position);
    }
    dragging.current = false;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className={`absolute ${className}`}
      style={{ 
        ...style, 
        left: position.left, 
        top: position.top, 
        touchAction: "none", 
        cursor: disabled ? "default" : (isDragging ? "grabbing" : "grab") 
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}

      {/* 배치 수정 모드(disabled=false)일 때만 나타나는 투명 덮개 */}
      {!disabled && (
        <div className="absolute inset-0 z-[9999] bg-transparent cursor-grab active:cursor-grabbing" />
      )}
    </div>
  );
}

export default Draggable;
