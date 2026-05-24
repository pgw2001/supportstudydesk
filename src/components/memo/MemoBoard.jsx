import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import Memo from "./Memo";

const MemoBoard = forwardRef(({ isEditMode }, ref) => {
  const [memos, setMemos] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(localStorage.getItem("memos") ?? "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef(null);

  // 외부(Dashboard)에서 startCreate를 호출할 수 있도록 연결
  useImperativeHandle(ref, () => ({
    startCreate,
  }));

  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggingId || !isEditMode) return;
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const memoWidth = boardRect.width * 0.12;
      const memoHeight = memoWidth * 1.1;
      const x = e.clientX - boardRect.left - dragOffset.x;
      const y = e.clientY - boardRect.top - dragOffset.y;
      const xPercent = (x + memoWidth / 2) / boardRect.width;
      const yPercent = (y + memoHeight / 2) / boardRect.height;

      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === draggingId
            ? { ...memo, xPercent, yPercent }
            : memo
        )
      );
    };

    const handlePointerUp = () => {
      setDraggingId(null);
      setDragOffset({ x: 0, y: 0 });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingId, dragOffset, isEditMode]);

  const startCreate = () => {
    const boardRect = boardRef.current?.getBoundingClientRect();
    
    let initialX = 0.5;
    let initialY = 0.5;

    if (boardRect && boardRect.width > 0 && boardRect.height > 0) {
      // 1. 브라우저 창의 실제 중심점 좌표 (픽셀 단위)
      const windowCenterX = window.innerWidth / 2;
      const windowCenterY = window.innerHeight / 2;

      // 2. MemoBoard 엘리먼트 기준의 상대 좌표로 변환
      const relativeX = windowCenterX - boardRect.left;
      const relativeY = windowCenterY - boardRect.top;

      // 3. 기존 드래그 시스템과 호환되도록 퍼센트(비율) 값으로 변환
      initialX = relativeX / boardRect.width;
      initialY = relativeY / boardRect.height;
    }

    const newMemo = {
      id: Date.now(),
      xPercent: initialX,
      yPercent: initialY,
      text: "",
      rotation: Math.random() * 6 - 3,
    };
    setMemos((prev) => [...prev, newMemo]);
  };

  const updateText = (id, value) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === id ? { ...memo, text: value } : memo))
    );
  };

  const deleteMemo = (id) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
  };

  return (
    <div ref={boardRef} className="relative z-[10001] w-full h-full">
      {/* 메모 */}
      {memos.map((memo) => (
        <div
          key={memo.id}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ display: "contents" }} // 기존 layout 스타일에 영향을 주지 않도록 설정
        >
          <Memo
            memo={memo}
            isEditMode={isEditMode}
            onChange={updateText}
            onDelete={() => deleteMemo(memo.id)}
            onDragStart={(clientX, clientY) => {
              if (!isEditMode) return;
              const boardRect = boardRef.current?.getBoundingClientRect();
              if (!boardRect) return;

              const memoWidth = boardRect.width * 0.12;
              const memoHeight = memoWidth * 1.1;
              const memoLeft = memo.xPercent * boardRect.width - memoWidth / 2;
              const memoTop = memo.yPercent * boardRect.height - memoHeight / 2;

              setDraggingId(memo.id);
              setDragOffset({
                x: clientX - boardRect.left - memoLeft,
                y: clientY - boardRect.top - memoTop,
              });
            }}
          />
        </div>
      ))}
    </div>
  );
});

MemoBoard.displayName = "MemoBoard";
export default MemoBoard;