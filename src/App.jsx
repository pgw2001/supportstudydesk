import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import TestBench from "./pages/TestBench";

function App() {
  const [viewMode, setViewMode] = useState("dashboard"); // 'dashboard' or 'test'
  const [user, setUser] = useState(null);
  
  return (
    <div className="relative">
      {/* 화면 전환 스위치 (개발용) */}
      <div className="fixed bottom-4 right-4 z-[99999] flex gap-2">
        <button 
          onClick={() => setViewMode(viewMode === "dashboard" ? "test" : "dashboard")}
          className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-black transition-all"
        >
          {viewMode === "dashboard" ? "Switch to Test Bench 🛠️" : "Switch to Dashboard 🏠"}
        </button>
      </div>

      {viewMode === "dashboard" ? <Dashboard user={user} setUser={setUser} /> : <TestBench />}
    </div>
  );
}

export default App;
