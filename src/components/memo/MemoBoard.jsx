import { useEffect, useRef, useState } from "react";
import Memo from "./Memo";
import MemoHolder from "./MemoHolder";

function MemoBoard({ isEditMode }) {
  const [memos, setMemos] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = JSON.parse(
        localStorage.getItem("memos") ?? "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [draggingId, setDraggingId] = useState(null);

  const [dragOffset, setDragOffset] = useState({
    x: 0,
    y: 0,
  });

  const boardRef = useRef(null);

  // 저장
  useEffect(() => {
    localStorage.setItem(
      "memos",
      JSON.stringify(memos)
    );
  }, [memos]);

  // 드래그 이동
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggingId || !isEditMode) return;

      const boardRect =
        boardRef.current?.getBoundingClientRect();

      if (!boardRect) return;

      const memoWidth =
        boardRect.width * 0.12;

      const memoHeight =
        memoWidth * 1.1;

      const x =
        e.clientX -
        boardRect.left -
        dragOffset.x;

      const y =
        e.clientY -
        boardRect.top -
        dragOffset.y;

      const xPercent =
        (x + memoWidth / 2) /
        boardRect.width;

      const yPercent =
        (y + memoHeight / 2) /
        boardRect.height;

      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === draggingId
            ? {
                ...memo,
                xPercent,
                yPercent,
              }
            : memo
        )
      );
    };

    const handlePointerUp = () => {
      setDraggingId(null);

      setDragOffset({
        x: 0,
        y: 0,
      });
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, [draggingId, dragOffset, isEditMode]);

  // 메모 생성
  const startCreate = () => {
    const newMemo = {
      id: Date.now(),

      // 진짜 정중앙
      xPercent: 0.5,
      yPercent: 0.5,

      text: "",
      rotation: Math.random() * 6 - 3,
    };

    setMemos((prev) => [...prev, newMemo]);
  };

  // 텍스트 수정
  const updateText = (id, value) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id
          ? {
              ...memo,
              text: value,
            }
          : memo
      )
    );
  };

  // 삭제
  const deleteMemo = (id) => {
    setMemos((prev) =>
      prev.filter((memo) => memo.id !== id)
    );
  };

  return (
    <div
      ref={boardRef}
      className="
        relative
        z-[10001]
        w-full
        h-full
      "
    >
      {/* 홀더 */}
      <div
        className="absolute"
        style={{
          left: "175%",
          top: "42%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <MemoHolder onStart={startCreate} />
      </div>

      {/* 메모 */}
      {memos.map((memo) => (
        <Memo
          key={memo.id}
          memo={memo}
          isEditMode={isEditMode}
          onChange={updateText}
          onDelete={() => deleteMemo(memo.id)}
          onDragStart={(clientX, clientY) => {
            if (!isEditMode) return;

            const boardRect =
              boardRef.current?.getBoundingClientRect();

            if (!boardRect) return;

            const memoWidth =
              boardRect.width * 0.12;

            const memoHeight =
              memoWidth * 1.1;

            const memoLeft =
              memo.xPercent *
                boardRect.width -
              memoWidth / 2;

            const memoTop =
              memo.yPercent *
                boardRect.height -
              memoHeight / 2;

            setDraggingId(memo.id);

            setDragOffset({
              x:
                clientX -
                boardRect.left -
                memoLeft,

              y:
                clientY -
                boardRect.top -
                memoTop,
            });
          }}
        />
      ))}
    </div>
  );
}

export default MemoBoard;