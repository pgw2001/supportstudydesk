import { useState } from "react";
import NormalTimer from "./NormalTimer";
import PomodoroTimer from "./PomodoroTimer";

function Timer() {
  const [mode, setMode] = useState("normal");

  return mode === "normal" ? (
    <NormalTimer switchMode={() => setMode("pomodoro")} />
  ) : (
    <PomodoroTimer switchMode={() => setMode("normal")} />
  );
}

export default Timer;