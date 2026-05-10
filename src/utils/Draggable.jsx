import { useRef, useState } from "react";

function Draggable({ children, initialLeft = "0%", initialTop = "0%", className = "", style = {} }) {
  const [position, setPosition] = useState({ left: initialLeft, top: initialTop });
  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0, left: 0, top: 0 });

  const onPointerDown = (e) => {
    // 버튼이나 입력 요소에서는 드래그 시작하지 않음
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('button, input')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();

    dragging.current = true;
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
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className={`absolute ${className}`}
      style={{ 
        ...style, 
        left: position.left, 
        top: position.top, 
        touchAction: "none", 
        cursor: dragging.current ? "grabbing" : "grab" 
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </div>
  );
}

export default Draggable;