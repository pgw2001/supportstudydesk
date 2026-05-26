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

      <Dashboard
        user={user}
        setUser={setUser}
      />

    </div>
  );
}

export default App;
