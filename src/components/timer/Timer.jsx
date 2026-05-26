import {
  useEffect,
  useState,
} from "react";

import {
  saveUserData,
  loadUserData,
} from "../../services/userData";

import NormalTimer from "./NormalTimer";
import PomodoroTimer from "./PomodoroTimer";

function Timer({
  onTick,
  setDeskTimerDisplay,
  user,
}) {

  const [mode, setMode] =
    useState(
      localStorage.getItem(
        "timer-mode"
      ) || null
    );

  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {

    const loadMode =
      async () => {

        // 진짜 로그아웃
        if (user === null) {

          localStorage.removeItem(
            "timer-mode"
          );

          setMode("normal");

          setIsLoaded(true);

          return;
        }

        // 로그인 복구 중
        if (!user?.uid) {
          return;
        }

        const data =
          await loadUserData(
            user.uid
          );

        setMode(
          data?.timerMode ||
          "normal"
        );

        setIsLoaded(true);
      };

    loadMode();

  }, [user]);

  useEffect(() => {

    if (
      !isLoaded ||
      !mode ||
      !user?.uid ||
      user?.isGuest
    ) {
      return;
    }

    saveUserData(
      user.uid,
      {
        timerMode: mode,
      }
    );

    localStorage.setItem(
      "timer-mode",
      mode
    );

  }, [
    mode,
    user,
    isLoaded,
  ]);

  // mode 로딩 전 렌더 방지
  if (
    !isLoaded ||
    !mode
  ) {
    return null;
  }

  return mode === "normal" ? (

    <NormalTimer
      user={user}

      switchMode={() =>
        setMode("pomodoro")
      }

      onTick={onTick}

      setDeskTimerDisplay={
        setDeskTimerDisplay
      }
    />

  ) : (

    <PomodoroTimer
      user={user}

      switchMode={() =>
        setMode("normal")
      }

      onTick={onTick}

      setDeskTimerDisplay={
        setDeskTimerDisplay
      }
    />

  );
}

export default Timer;