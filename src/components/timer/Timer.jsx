import { useState } from "react";
import NormalTimer from "./NormalTimer";
import PomodoroTimer from "./PomodoroTimer";

function Timer({ onTick }) {
  const [mode, setMode] = useState("normal");

  return mode === "normal" ? (
    <NormalTimer switchMode={() => setMode("pomodoro")} onTick={onTick} />
  ) : (
    <PomodoroTimer switchMode={() => setMode("normal")} onTick={onTick} />
  );
}

export default Timer;