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
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    origin.current = {
      x: e.clientX,
      y: e.clientY,
      left: e.currentTarget.offsetLeft,
      top: e.currentTarget.offsetTop,
    };
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    setPosition({ left: origin.current.left + dx, top: origin.current.top + dy });
  };

  const onPointerUp = (e) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className={`absolute ${className}`}
      style={{ ...style, left: position.left, top: position.top, touchAction: "none", cursor: "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </div>
  );
}

export default Draggable;