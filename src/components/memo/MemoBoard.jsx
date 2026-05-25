import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import Memo from "./Memo";

const MEMO_COLOR_PALETTE = [
  { fill: "#ffd93b", stroke: "#987a00" }, // 노란색
  { fill: "#ffcccc", stroke: "#cc9999" }, // 연한 분홍
  { fill: "#ccf0ff", stroke: "#99c0cc" }, // 연한 하늘
  { fill: "#ccffcc", stroke: "#99cc99" }, // 연한 초록
];

const MemoBoard = forwardRef(({ isEditMode }, ref) => {
  const [memos, setMemos] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(localStorage.getItem("memos") ?? "[]");
      // Ensure all loaded memos have a color property (migration for legacy data)
      return Array.isArray(saved) 
        ? saved.map(memo => ({
            ...memo,
            color: memo.color || MEMO_COLOR_PALETTE[0]
          }))
        : [];
    } catch {
      return [];
    }
  });

  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // 새 메모 생성 대기 상태 (마우스 따라다니는 모드)
  const [pendingMemo, setPendingMemo] = useState(null);

  const boardRef = useRef(null);

  // 화면 클릭 시 대기 중인 메모를 실제로 배치
  const handlePlaceMemo = useCallback(() => {
    if (pendingMemo) {
      setMemos((prev) => [...prev, { ...pendingMemo, id: Date.now() }]);
      setPendingMemo(null);
    }
  }, [pendingMemo]);

  const startCreate = useCallback((e) => {
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const randomColor = MEMO_COLOR_PALETTE[Math.floor(Math.random() * MEMO_COLOR_PALETTE.length)];

    // 즉시 생성하지 않고 '배치 대기' 상태로 만듦
    setPendingMemo({
      id: "preview",
      xPercent: (e.clientX - boardRect.left) / boardRect.width,
      yPercent: (e.clientY - boardRect.top) / boardRect.height,
      text: "",
      color: randomColor,
      rotation: Math.random() * 6 - 3,
    });
  }, []);

  // 외부(Dashboard)에서 startCreate를 호출할 수 있도록 연결
  useImperativeHandle(ref, () => ({
    startCreate,
  }), [startCreate]);

  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      // 전체 화면에서의 메모 크기 비율 조정 (기존 대비 약 10%)
      const memoWidth = Math.max(boardRect.width * 0.1, 150);
      const memoHeight = Math.max(memoWidth * 1.1, 110);

      // 1. 새 메모 생성 중일 때 (마우스 따라다니기)
      if (pendingMemo) {
        const xPercent = (e.clientX - boardRect.left) / boardRect.width;
        const yPercent = (e.clientY - boardRect.top) / boardRect.height;
        
        setPendingMemo(prev => ({
          ...prev,
          xPercent,
          yPercent
        }));
        return;
      }

      // 2. 기존 메모 드래그 중일 때
      if (!draggingId || !isEditMode) return;

      let x = e.clientX - boardRect.left - dragOffset.x;
      let y = e.clientY - boardRect.top - dragOffset.y;

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
      if (draggingId) {
        setDraggingId(null);
        setDragOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerdown", handlePlaceMemo);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerdown", handlePlaceMemo);
    };
  }, [draggingId, dragOffset, isEditMode, pendingMemo, handlePlaceMemo]);

  const updateText = (id, value) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === id ? { ...memo, text: value } : memo))
    );
  };

  const deleteMemo = (id) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
  };

  return (
    <div 
      ref={boardRef} 
      className={`relative w-full h-full ${pendingMemo ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'}`}
    >
      {/* 메모 */}
      {memos.map((memo, index) => (
          <Memo
            key={memo.id}
            memo={memo}
            index={index}
            isEditMode={isEditMode}
            onChange={updateText}
            onDelete={() => deleteMemo(memo.id)}
            onDragStart={(clientX, clientY) => {
              if (!isEditMode) return;
              const boardRect = boardRef.current?.getBoundingClientRect();
              if (!boardRect) return;

              // 클릭 시 크기 계산 동기화
              const memoWidth = Math.max(boardRect.width * 0.1, 150);
              const memoHeight = Math.max(memoWidth * 1.1, 110);
              const memoLeft = memo.xPercent * boardRect.width - memoWidth / 2;
              const memoTop = memo.yPercent * boardRect.height - memoHeight / 2;

              // 드래그 시작 시 해당 메모를 배열의 맨 뒤로 이동시켜 
              // 레이어 순서(zIndex)를 최상단으로 올림
              setMemos((prev) => {
                const target = prev.find((m) => m.id === memo.id);
                if (!target) return prev;
                const others = prev.filter((m) => m.id !== memo.id);
                return [...others, target];
              });

              setDraggingId(memo.id);
              setDragOffset({
                x: clientX - boardRect.left - memoLeft,
                y: clientY - boardRect.top - memoTop,
              });
            }}
          />
      ))}

      {/* 배치 대기 중인 미리보기 메모 */}
      {pendingMemo && (
        <Memo
          memo={pendingMemo}
          isPreview={true}
          isEditMode={false}
          onChange={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
});

MemoBoard.displayName = "MemoBoard";
export default MemoBoard;