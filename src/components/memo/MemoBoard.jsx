import { useEffect, useState } from "react";
import Memo from "./Memo";
import MemoHolder from "./MemoHolder";

function MemoBoard() {
  const [memos, setMemos] = useState([]);
  const [draggingId, setDraggingId] = useState(null);

  // 저장된 메모 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("memos");

    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // 저장
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  // 드래그 이동
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingId) return;

      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === draggingId
            ? {
                ...memo,
                x: e.clientX - 100,
                y: e.clientY - 110,
              }
            : memo
        )
      );
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId]);

  // 새 메모 생성
  const createMemo = (e) => {
    const newMemo = {
      id: Date.now(),
      x: e.clientX - 100,
      y: e.clientY - 110,
      text: "",
      rotation: Math.random() * 6 - 3,
    };

    setMemos((prev) => [...prev, newMemo]);
    setDraggingId(newMemo.id);
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

  return (
    <div className="relative">
      {/* 포스트잇 홀더 */}
      <div className="relative z-50">
        <MemoHolder onCreate={createMemo} />
      </div>

      {/* 메모들 */}
      {memos.map((memo) => (
        <Memo
          key={memo.id}
          memo={memo}
          onChange={updateText}
          onDragStart={() => setDraggingId(memo.id)}
        />
      ))}
    </div>
  );
}

export default MemoBoard;