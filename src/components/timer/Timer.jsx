import { useState } from "react";

import NormalTimer from "./NormalTimer";
import PomodoroTimer from "./PomodoroTimer";

function Timer({
  onTick,
  setDeskTimerDisplay,
}) {

  const [mode, setMode] =
    useState("normal");

  return mode === "normal" ? (

    <NormalTimer
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