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

    // 일반 모드(disabled=true)일 때는 버튼/입력창 클릭 시 드래그를 방지하지만,
    // 배치 수정 모드(disabled=false)일 때는 오버레이가 이벤트를 가로채므로 
    // 아래 체크 로직을 통과하여 어디를 잡아도 드래그가 가능해집니다.
    // 다만, data-no-drag 속성이 명시된 영역은 수정 모드에서도 드래그를 막고 싶다면 로직을 유지합니다.
    if (disabled && e.target.closest('button, input, textarea, [data-no-drag="true"]')) {
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
