import Group from "../group/group";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import rough from "roughjs";

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";

import { db } from "../../services/firebase";

import {
  Clock3,
  CheckSquare,
  StickyNote,
  Users,
  ChevronRight,
} from "lucide-react";

function Login({ user, setUser, setIsGroupOpen,deskTimerDisplay, taskCount, }) {

  const [hoveredMenu, setHoveredMenu] =
    useState(null);

  const [
    isLogoutHovered,
    setIsLogoutHovered,
  ] = useState(false);


  // 응원 문구
  const messages = [
    "오늘도 집중해보자.",
    "작은 진전도 큰 성장이다.",
    "지금의 노력이 미래를 만든다.",
    "포기하지 않는 게 가장 중요해.",
    "오늘 한 시간이 내일을 바꾼다.",
    "천천히라도 계속 가자.",
    "지금 하는 공부는 배신하지 않는다.",
    "완벽보다 꾸준함.",
    "조금만 더 집중해보자.",
    "오늘의 몰입이 실력을 만든다.",
  ];

  const [todayMessage, setTodayMessage] =
    useState("");

  // 공부 시간 (초)
  const [focusTime, setFocusTime] =
    useState(0);

  // 목표 시간 (분)
  const [dailyGoal, setDailyGoal] =
    useState(120);


  const [
    goalInput,
    setGoalInput,
  ] = useState("120");

  // 타이머 실행 여부
  const [isRunning, setIsRunning] =
       useState(false);

  // tasks
  const [tasks, setTasks] =
       useState([]);

  const [newTask, setNewTask] =
       useState("");
       
  const [taskTime, setTaskTime] =
       useState("");

  const [editingTaskId, setEditingTaskId] =
       useState(null);

  const [editText, setEditText] =
        useState("");

  const [editTime, setEditTime] =
        useState("");

 const [
   isAddingTask,
   setIsAddingTask,
   ] = useState(false);

  const menuSvgRefs = useRef([]);

  const logoutSvgRef = useRef(null);

  const focusSvgRef =
  useRef(null);

  const taskSvgRef =
  useRef(null);

  const menuList = [
    {
      name: "Timer",
      icon: (
        <Clock3
          size={18}
          strokeWidth={1.8}
        />
      ),
      info: deskTimerDisplay,
    },
    {
      name: "Todo List",
      icon: (
        <CheckSquare
          size={18}
          strokeWidth={1.8}
        />
      ),
      info: `${taskCount} tasks`,
    },

    {
      name: "Memo",
      icon: (
        <StickyNote
          size={18}
          strokeWidth={1.8}
        />
      ),
      info: "12 notes",
    },

    {
      name: "Group",
      icon: (
        <Users
          size={18}
          strokeWidth={1.8}
        />
      ),
      info: "",
    },

    
  ];

  // 랜덤 응원 문구
  useEffect(() => {
    const randomIndex =
      Math.floor(
        Math.random() *
          messages.length
      );

    setTodayMessage(
      messages[randomIndex]
    );
  }, []);

  // 저장된 목표 불러오기
  useEffect(() => {
    if (!user?.uid) return;

    const loadGoal =
      async () => {
        if (!user?.uid){
          return;
        }
        try {
          const userRef = doc(
            db,
            "studyData",
            user.uid
          );

          const snapshot =
            await getDoc(userRef);

          if (snapshot.exists()) {
            const data =
              snapshot.data();

            if (
              data.dailyGoal !== undefined
            ) {
              setDailyGoal(
                data.dailyGoal
              );

              setGoalInput(
                String(
                  data.dailyGoal
                )
              );
            }
            if (data.tasks !== undefined) {
              setTasks(data.tasks);
            }
            if(data.focusTime !== undefined){
              setFocusTime(data.focusTime);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

    loadGoal();
  }, [user]);

  // 타이머
  useEffect(() => {
    if (!isRunning) return;

    const interval =
      setInterval(() => {
        setFocusTime((prev) =>
          prev + 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [isRunning]);
 
  // rough menu
  useEffect(() => {
    menuSvgRefs.current.forEach(
      (svg, i) => {
        if (!svg) return;

        svg.innerHTML = "";

        const rc = rough.svg(svg);

        const isHovered =
          hoveredMenu ===
          menuList[i].name;
        
        const isGroup =
          menuList[i].name === "Group";  

        const rect = rc.rectangle(
          3,
          3,
          250,
          54,
          {
            stroke: "#111",

            strokeWidth:
              isHovered ? 2 : 1.4,

            roughness:
              isHovered ? 1.5 : 0.9,

            bowing: 1,

            fill: isHovered
            ? isGroup
            ? "rgb(107, 233, 250)"
            : "rgb(165, 255, 113)"
            : "rgba(255,255,255,0.98)",

            fillStyle:
              isHovered
                ? "hachure"
                : "solid",

            hachureGap: 7,

            fillWeight: 1.2,

            seed: i + 40,
          }
        );

        svg.appendChild(rect);
      }
    );
    if (focusSvgRef.current) {
  focusSvgRef.current.innerHTML =
    "";

  const rc = rough.svg(
    focusSvgRef.current
  );

  const rect = rc.rectangle(
    3,
    3,
    250,
    350,
    {
      stroke: "#111",
      strokeWidth: 2,
      roughness: 1.2,
      bowing: 1,
      fill: "white",
      fillStyle: "solid",
      seed: 30,
    }
  );

  focusSvgRef.current.appendChild(
    rect
  );
}

if (taskSvgRef.current) {
  taskSvgRef.current.innerHTML =
    "";

  const rc = rough.svg(
    taskSvgRef.current
  );

  const rect = rc.rectangle(
    3,
    3,
    250,
    330,
    {
      stroke: "#111",
      strokeWidth: 2,
      roughness: 1.2,
      bowing: 1,
      fill: "white",
      fillStyle: "solid",
      seed: 40,
    }
  );

  taskSvgRef.current.appendChild(
    rect
  );
}

    if (logoutSvgRef.current) {
      logoutSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        logoutSvgRef.current
      );

      const rect = rc.rectangle(
        3,
        3,
        250,
        48,
        {
          stroke: "#111",

          strokeWidth: 2,

          roughness: 1.1,

          bowing: 1,

          fill: isLogoutHovered
            ? "rgba(255, 178, 178, 0.95)"
            : "rgba(255,255,255,0.98)",

          fillStyle: isLogoutHovered
            ? "hachure"
            : "solid",

          hachureGap: 8,

          fillWeight: 1.1,

          seed: 88,
        }
      );

      logoutSvgRef.current.appendChild(
        rect
      );
    }
  }, [
    hoveredMenu,
    isLogoutHovered,
  ]);

  if (!user) return null;

  // 화면 표시 시간
  const displayHours = String(
    Math.floor(
      focusTime / 3600
    )
  ).padStart(2, "0");

  const displayMinutes = String(
    Math.floor(
      (focusTime % 3600) / 60
    )
  ).padStart(2, "0");

  const displaySeconds = String(
    focusTime % 60
  ).padStart(2, "0");

  // 퍼센트 계산
  const goalSeconds =
    dailyGoal * 60;

  const progress =
    Math.min(
      Math.floor(
        (focusTime /
          goalSeconds) *
          100
      ),
      100
    );
  const saveStudyData =
  async (updatedTasks) => {
    if (!user?.uid) return;

    try {
      const userRef = doc(
        db,
        "studyData",
        user.uid
      );

      await setDoc(
        userRef,
        {
          dailyGoal,
          focusTime,
          tasks: updatedTasks,
        },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
  };
  // Save 버튼
  const handleSaveGoal =
    async () => {
      const value =
        Number(goalInput);

      if (
        isNaN(value) ||
        value <= 0
      ) {
        return;
      }

      // 목표 저장
      setDailyGoal(value);

      // 시간 초기화
      setFocusTime(0);

      // 시작
      setIsRunning(true);

      // firebase 저장
      try {
        const userRef = doc(
          db,
          "studyData",
          user.uid
        );

        await setDoc(
          userRef,
          {
            dailyGoal: value,
            tasks: tasks,
            focusTime: focusTime,
          },
          { merge: true }
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
    <div
      className="
        mt-5
        flex
        flex-col
        gap-2
      "
    >
      {/* MESSAGE */}
      <div
        className="
          font-['Patrick_Hand']
          text-[24px]
          leading-none
        "
      >
        {todayMessage}
      </div>

      {/* TODAY FOCUS */}
<section
  className="
    relative

    h-[360px]
  "
>
  <svg
    ref={focusSvgRef}
    className="
      absolute inset-0
      h-full w-full
      pointer-events-none
    "
    viewBox="0 0 260 360"
  />

  <div className="relative z-10 px-4 py-4">
        {/* TITLE */}
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Clock3
            size={18}
            strokeWidth={1.8}
          />

          <span
            className="
              font-['Patrick_Hand']
              text-[18px]
            "
          >
            Today Focus
          </span>
        </div>

        {/* TIME */}
        <div
          className="
            mt-4
            flex
            items-center
            justify-between
          "
        >
          <div
            className="
              font-['Patrick_Hand']
              text-[26px]
              leading-none
              tracking-wide
            "
          >
            {displayHours}h{" "}
            {displayMinutes}m{" "}
            {displaySeconds}s
          </div>

          {/* GRAPH */}
          <div
            className="
              flex
              items-end
              gap-[5px]
            "
          >
            <div className="h-[10px] w-[5px] rounded-full bg-black/10" />
            <div className="h-[18px] w-[5px] rounded-full bg-[#4ade80]" />
            <div className="h-[34px] w-[5px] rounded-full bg-[#4ade80]" />
            <div className="h-[22px] w-[5px] rounded-full bg-black/10" />
            <div className="h-[36px] w-[5px] rounded-full bg-black/10" />
          </div>
        </div>

        {/* GOAL INPUT */}
        <div className="mt-5">
          <div
            className="
              mb-2
              font-['Patrick_Hand']
              text-[18px]
            "
          >
            Study Goal
          </div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <input
              type="number"
              disabled={isRunning}
              value={goalInput}
              onChange={(e) =>
                setGoalInput(
                  e.target.value
                )
              }
              className="
                h-[38px]
                w-[90px]

                rounded-[6px]

                border-[2px]
                border-black

                px-3

                outline-none

                disabled:bg-black/5
                disabled:text-black/40
              "
            />

            <span
              className="
                font-['Patrick_Hand']
                text-[18px]
              "
            >
              m
            </span>

            {!isRunning ? (
              <button
                type="button"
                onClick={
                  handleSaveGoal
                }
                className="
                  rounded-[6px]

                  border-[2px]
                  border-black

                  bg-[#4ade80]

                  px-3
                  py-1

                  font-['Patrick_Hand']
                  text-[16px]
                "
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                }}
                className="
                  rounded-[6px]

                  border-[2px]
                  border-black

                  bg-[#ffb3b3]

                  px-3
                  py-1

                  font-['Patrick_Hand']
                  text-[16px]
                "
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* GOAL */}
        <div className="mt-5">
          <div
            className="
              mb-2

              flex
              items-center
              justify-between

              font-['Patrick_Hand']
              text-[18px]
            "
          >
            <span>
              Daily Goal
            </span>

            <span>
              {progress}%
            </span>
          </div>

          <div
            className="
              h-[7px]

              overflow-hidden

              rounded-full

              bg-black/10
            "
          >
            <div
              className="
                h-full

                rounded-full

                bg-[#4ade80]

                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div
            className="
              mt-2

              text-[13px]
              text-black/50
            "
          >
            목표 :
            {" "}
            {dailyGoal}분
            </div>
          </div>
        </div>
      </section>
      {/* TASKS */}
<section
  className="
    relative

    h-[340px]
  "
>
  <svg
    ref={taskSvgRef}
    className="
      absolute inset-0

      h-full
      w-full

      pointer-events-none
    "
    viewBox="0 0 260 340"
  />

  <div
    className="
      relative
      z-10

      px-4
      py-4
    "
  >
  <div className="relative z-10">
    {/* title */}
    <div
      className="
        flex
        items-center
        justify-between
      "
    >
      <div
        className="
          font-['Patrick_Hand']

          text-[24px]

          tracking-[1px]
        "
      >
        Today’s Tasks
      </div>

      <div
        className="
          rotate-[-8deg]

          text-[20px]

          text-[#4ade80]
        "
      >
        ✦
      </div>
    </div>

    {/* empty */}
    {tasks.length === 0 && (
      <div
        className="
          mt-6

          rounded-[8px]

          border-2
          border-dashed
          border-black/15

          py-4

          text-center

          font-['Patrick_Hand']

          text-[20px]

          text-black/30
        "
      >
        No Tasks Yet ✎
      </div>
    )}

    {/* task list */}
<div
  className="
    mt-4

    flex
    flex-col

    gap-3

    max-h-[120px]

    overflow-y-auto

    pr-1
  "
>
  {tasks.map((task) => (
    <div
      key={task.id}
      className="
        group
        flex
        items-center
        justify-between
        rounded-[8px]
        px-2
        py-2
        transition-all
        hover:bg-[#4ade80]/10
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        {/* checkbox */}
        <button
          onClick={() => {
            const updatedTasks =
              tasks.map((t) =>
                t.id === task.id
                  ? {
                      ...t,
                      completed:
                        !t.completed,
                    }
                  : t
              );

            setTasks(updatedTasks);

            saveStudyData(
              updatedTasks
            );
          }}
          className={`
            flex
            h-[18px]
            w-[18px]
            items-center
            justify-center
            rounded-[5px]
            border-[2px]
            border-black
            transition-all
            ${
              task.completed
                ? "bg-[#4ade80]"
                : "bg-white"
            }
          `}
        />

        {/* TEXT + EDIT MODE */}
        <div
          className="
            flex
            flex-col
            gap-1
          "
        >
          {editingTaskId ===
          task.id ? (
            <>
              <input
                value={editText}
                onChange={(e) =>
                  setEditText(
                    e.target.value
                  )
                }
                className="
                  h-[30px]
                  w-[120px]
                  rounded-[6px]
                  border-[2px]
                  border-black
                  px-2
                  text-[13px]
                  outline-none
                "
              />

              <input
                type="time"
                value={editTime}
                onChange={(e) =>
                  setEditTime(
                    e.target.value
                  )
                }
                className="
                  h-[30px]
                  rounded-[6px]
                  border-[2px]
                  border-black
                  px-2
                  text-[12px]
                  outline-none
                "
              />

              <button
                onClick={() => {
                  const updatedTasks =
                    tasks.map((t) =>
                      t.id ===
                      task.id
                        ? {
                            ...t,
                            text:
                              editText,
                            time:
                              editTime,
                          }
                        : t
                    );

                  setTasks(
                    updatedTasks
                  );

                  saveStudyData(
                    updatedTasks
                  );

                  setEditingTaskId(
                    null
                  );
                }}
                className="
                  rounded-[6px]
                  bg-[#4ade80]
                  px-2
                  py-[2px]
                  text-[12px]
                "
              >
                Save
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span
                  className={`
                    text-[15px]
                    transition-all
                    ${
                      task.completed
                        ? "text-black/30 line-through"
                        : ""
                    }
                  `}
                >
                  {task.text}
                </span>

                {task.time && (
                  <span
                    className="
                      rounded-full
                      bg-[#4ade80]/15
                      px-2
                      py-[2px]
                      text-[11px]
                      text-[#16a34a]
                    "
                  >
                    {task.time}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pl-[2px]">
                <button
                  onClick={() => {
                    setEditingTaskId(
                      task.id
                    );

                    setEditText(
                      task.text
                    );

                    setEditTime(
                      task.time ||
                        ""
                    );
                  }}
                  className="
                    text-[11px]
                    text-black/35
                    transition-all
                    hover:text-[#4ade80]
                  "
                >
                  edit
                </button>

                <button
                  onClick={() => {
                    const updatedTasks =
                      tasks.filter(
                        (t) =>
                          t.id !==
                          task.id
                      );

                    setTasks(
                      updatedTasks
                    );

                    saveStudyData(
                      updatedTasks
                    );
                  }}
                  className="
                    text-[11px]
                    text-black/25
                    transition-all
                    hover:text-red-500
                  "
                >
                  delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

{/* input */}
<div className="mt-4 flex flex-col gap-2">
  {/* task input */}
  <input
    value={newTask}
    onChange={(e) =>
      setNewTask(
        e.target.value
      )
    }
    placeholder="Write a task..."
    className="
      h-[38px]

      w-full

      rounded-[8px]

      border-[2px]
      border-black

      px-3

      outline-none
    "
  />

  {/* bottom row */}
  <div
    className="
      flex
      items-start
      gap-2
      flex-wrap
    "
  >
    {/* time */}
    <input
      type="time"
      value={taskTime}
      onChange={(e) =>
        setTaskTime(
          e.target.value
        )
      }
      className="
        h-[38px]

        flex-1

        rounded-[8px]

        border-[2px]
        border-black

        px-2

        outline-none
      "
    />

    {/* add */}
    <button
      onClick={() => {
        if (!newTask.trim())
          return;

        const updatedTasks = [
          ...tasks,
          {
            id: Date.now(),
            text: newTask,
            time: taskTime,
            completed: false,
          },
        ];

        setTasks(updatedTasks);

        saveStudyData(
          updatedTasks
        );

        setNewTask("");

        setTaskTime("");
      }}
      className="
        h-[38px]

        rounded-[8px]

        border-[2px]
        border-black

        bg-[#4ade80]

        px-4

        font-medium

        transition-all

        hover:rotate-[-2deg]
      "
    >
      Add
    </button>
  </div>
</div>

</div>
</div>
</section>

{/* MENUS */}
<nav
  className="
    flex
    flex-col

    gap-3
  "
>
  {menuList.map(
    (item, index) => (
      <button
        key={item.name}

  onClick={() => {
    if (item.name === "Group") {
      setIsGroupOpen(
        (prev) => !prev
      );
    }
  }}

  onMouseEnter={() =>
    setHoveredMenu(
      item.name
    )
  }

  onMouseLeave={() =>
    setHoveredMenu(null)
  }

  className="
    relative

    h-[58px]
    w-full
  "
      >
        <svg
          ref={(el) =>
            (menuSvgRefs.current[
              index
            ] = el)
          }
          className="
            absolute inset-0
            h-full w-full
            pointer-events-none
          "
          viewBox="0 0 260 58"
        />

        <div
          className="
            relative

            flex h-full
            items-center
            justify-between

            px-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            {item.icon}

            <span
              className="
                font-['Patrick_Hand']
                text-[18px]
              "
            >
              {item.name}
            </span>
          </div>

          <div
            className="
              flex
              items-start
              gap-2
            "
          >
            {item.info && (
              <span
                className="
                  font-['Patrick_Hand']
                  text-[16px]
                  text-black/75
                "
              >
                {item.info}
              </span>
            )}

            <ChevronRight
              size={16}
              className="text-black/35"
            />
          </div>
        </div>
      </button>
    )
  )}
</nav>

{/* LOGOUT */}
<div
  className="
    relative

    mt-2

    h-[52px]
    w-full
  "
>
  <svg
    ref={logoutSvgRef}
    className="
      absolute inset-0

      h-full
      w-full

      pointer-events-none
    "
    viewBox="0 0 260 54"
  />

  <button
    onClick={async () => {
  if (user?.uid) {
    try {
      // studyData 저장
      const userRef = doc(
        db,
        "studyData",
        user.uid
      );

      await setDoc(
        userRef,
        {
          dailyGoal,
          focusTime,
          tasks,
        },
        { merge: true }
      );

      // 그룹 offline 처리
      const groupsSnapshot =
        await getDocs(
          collection(
            db,
            "groups"
          )
        );

      for (const groupDoc of groupsSnapshot.docs) {
        await setDoc(
          doc(
            db,
            "groups",
            groupDoc.id,
            "members",
            user.uid
          ),
          {
            online: false,
            studying: false,
            updatedAt:
              Date.now(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (user?.isGuest) {
  localStorage.removeItem(
    "support-study-desk:todo-lists"
  );
}
setTasks([]);
setUser(null);
}}

    onMouseEnter={() =>
      setIsLogoutHovered(true)
    }

    onMouseLeave={() =>
      setIsLogoutHovered(false)
    }

    className="
      relative
      z-10

      h-full
      w-full

      font-['Patrick_Hand']
      text-[20px]
    "
  >
    Logout
  </button>
</div>

<div className="h-[30px]" />
    </div>
  </>
);
}

export default Login;