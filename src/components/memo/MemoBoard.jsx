import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import {
  db,
} from "../../services/firebase";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import Memo from "./Memo";

const MemoBoard = forwardRef(({ isEditMode, setMemoCount,user }, ref) => {
  const [memos, setMemos] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(localStorage.getItem("memos") ?? "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [isLoaded, setIsLoaded] =
  useState(false);
  useEffect(() => {

  setMemoCount?.(
    memos.length
  );

  }, [memos]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef(null);

  // 외부(Dashboard)에서 startCreate를 호출할 수 있도록 연결
  useImperativeHandle(ref, () => ({
    startCreate,
  }));

  useEffect(() => {
  const loadMemos = async () => {
    if (!user?.uid || user?.isGuest) {
      setIsLoaded(true);
      return;
    }

    try {
      const memoRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(memoRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        if (Array.isArray(data.memos)) {
          setMemos(data.memos);
        }
        setIsLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoaded(true);
  };

  loadMemos();
}, [user]);

useEffect(() => {

  if (!isLoaded) return;

  // guest는 localStorage만
  if (user?.isGuest) {

    localStorage.setItem(
      "memos",
      JSON.stringify(memos)
    );

    return;
  }

  // 로그아웃 중 저장 금지
  if (!user?.uid) {
    return;
  }

  const saveMemos = async () => {
    try {
      const memoRef = doc(db, "users", user.uid);

      await setDoc(
        memoRef,
        {
          memos,
        },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  saveMemos();
  }, [memos, user]);


  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggingId || !isEditMode) return;
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const memoWidth = boardRect.width * 0.6; // Memo.jsx의 w-[60%]와 맞춤
      const memoHeight = memoWidth * 1.1;

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
      // 메모를 위젯 내부(중앙)에 생성하도록 수정
      // 화면 중심 좌표를 사용하면 위젯이 작을 때 메모가 영역 밖으로 튀어나가 Draggable 덮개 영역을 벗어남
      initialX = 0.5;
      initialY = 0.5;
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
    <div ref={boardRef} className="relative w-full h-full">
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

              const memoWidth = boardRect.width * 0.6;
              const memoHeight = memoWidth * 1.1;
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
    </div>
  );
});

MemoBoard.displayName = "MemoBoard";
export default MemoBoard;