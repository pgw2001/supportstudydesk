import Timer from "../components/timer/Timer";
import TodoList from "../components/todo/TodoList";
import Memo from "../components/memo/Memo";

function Dashboard() {
  return (
    <div className="p-4">
      <h1>Study Desk</h1>

      <div className="grid grid-cols-2 gap-4">
        <Timer />
        <Memo />
      </div>

      <div className="mt-4">
        <TodoList />
      </div>
    </div>
  );
}

export default Dashboard;
