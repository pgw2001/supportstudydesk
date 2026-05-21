import { useEffect, useState } from "react";
import TimerFrame from "./TimerFrame";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase";

function NormalTimer({ switchMode, onTick,deskTimerTime,setDeskTimerTime }) {
  const [time, setTime] =
  useState(deskTimerTime || 0);
  const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
  const loadTimer = async () => {
    if (!auth.currentUser) return;

    const docRef = doc(
      db,
      "users",
      auth.currentUser.uid
    );

    const snap =
      await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();

      if (data.deskTimerTime !== undefined) {
      setTime(data.deskTimerTime);

        if (setDeskTimerTime) {
        setDeskTimerTime(
        data.deskTimerTime
        );
        }
    }

      if (data.timerRunning) {
        setIsRunning(
          data.timerRunning
        );
      }
    }
  };

  loadTimer();
}, []);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  // 시간이 실제로 변경될 때만 화분 성장에 반영 (Strict Mode 중복 호출 방지)
  useEffect(() => {
  console.log("time:", time);

  if (setDeskTimerTime) {
    setDeskTimerTime(time);
  }
  }, [time]);

  useEffect(() => {
  const saveTimer = async () => {
    if (!auth.currentUser) return;

    await setDoc(
      doc(
        db,
        "users",
        auth.currentUser.uid
      ),
      {
        deskTimerTime: time,
        timerRunning: isRunning,
      },
      { merge: true }
    );
  };

  saveTimer();
}, [time, isRunning]);

  const formatTime = () => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  return (
    <TimerFrame>
      {/* 제목 */}
      <text
        x="170"
        y="30"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="2"
        fill="#737373"
      >
        DESK TIMER
      </text>

      {/* 모드 변경 */}
      <g
        onClick={switchMode}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: "pointer" }}
      >
        <rect
          x="258"
          y="14"
          width="56"
          height="22"
          rx="11"
          fill="#f5f5f5"
          stroke="black"
          strokeWidth="1.5"
        />

        <text
          x="286"
          y="28"
          textAnchor="middle"
          fontSize="9"
          pointerEvents="none"
        >
          POMO
        </text>
      </g>

      {/* 시간 */}
      <text
        x="170"
        y="102"
        textAnchor="middle"
        fontSize="38"
        fontWeight="600"
        letterSpacing="3"
        fill="#171717"
      >
        {formatTime()}
      </text>

      {/* START */}
      <g
        onClick={() => setIsRunning(true)}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: "pointer" }}
      >
        <rect
          x="36"
          y="170"
          width="82"
          height="34"
          rx="17"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        <text
          x="77"
          y="191"
          textAnchor="middle"
          fontSize="12"
          pointerEvents="none"
        >
          START
        </text>
      </g>

      {/* PAUSE */}
      <g
        onClick={() => setIsRunning(false)}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: "pointer" }}
      >
        <rect
          x="129"
          y="170"
          width="82"
          height="34"
          rx="17"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        <text
          x="170"
          y="191"
          textAnchor="middle"
          fontSize="12"
          pointerEvents="none"
        >
          PAUSE
        </text>
      </g>

      {/* RESET */}
      <g
        onClick={async () => {
      setIsRunning(false);
      setTime(0);

      if (auth.currentUser) {
      await setDoc(
      doc(
        db,
        "users",
        auth.currentUser.uid
      ),
      {
        deskTimerTime: 0,
        timerRunning: false,
      },
      { merge: true }
        );
       }
      }}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: "pointer" }}
      >
        <rect
          x="222"
          y="170"
          width="82"
          height="34"
          rx="17"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        <text
          x="263"
          y="191"
          textAnchor="middle"
          fontSize="12"
          pointerEvents="none"
        >
          RESET
        </text>
      </g>
    </TimerFrame>
  );
}

export default NormalTimer;