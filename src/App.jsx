import { useState } from "react";

import Dashboard from "./pages/Dashboard";

function App() {

  const [
    viewMode,
    setViewMode,
  ] = useState("dashboard");

  const [
    user,
    setUser,
  ] = useState(null);

  return (

    <div className="relative">

      {/* 화면 전환 스위치 */}
      <div className="fixed bottom-4 right-4 z-[99999] flex gap-2">

        <button
          onClick={() =>
            setViewMode(
              viewMode === "dashboard"
                ? "test"
                : "dashboard"
            )
          }
          className="
            rounded-full
            bg-black/80
            px-4
            py-2
            text-sm
            font-bold
            text-white
            shadow-lg
            transition-all
            hover:bg-black
          "
        >
          {viewMode === "dashboard"
            ? "Switch to Test Bench 🛠️"
            : "Switch to Dashboard 🏠"}
        </button>

      </div>

      <Dashboard
  user={user}
  setUser={setUser}
/>

    </div>
  );
}

export default App;
