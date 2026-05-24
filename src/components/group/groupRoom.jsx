import {
  useEffect,
  useRef,
  useState,
} from "react";

import rough from "roughjs/bundled/rough.esm";

import { auth, db } from "../../services/firebase";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  getDocs,
} from "firebase/firestore";

function GroupRoom({
  group,
  setPage,
  setIsGroupOpen,
}) {
  const paperSvgRef =
    useRef(null);

  const [isStudying, setIsStudying] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  const [members, setMembers] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [
    realUsername,
    setRealUsername,
  ] = useState("");

  const user =
    auth.currentUser;

  const username =
    realUsername ||
    "Guest";

  const formatTime = (
    total
  ) => {
    const h = String(
      Math.floor(total / 3600)
    ).padStart(2, "0");

    const m = String(
      Math.floor(
        (total % 3600) / 60
      )
    ).padStart(2, "0");

    const s = String(
      total % 60
    ).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  const getLiveTime = (
    member
  ) => {
    let total =
      member.studyTime || 0;

    if (
      member.studying &&
      member.studyStartTime
    ) {
      total += Math.floor(
        (Date.now() -
          member.studyStartTime) /
          1000
      );
    }

    return total;
  };

  useEffect(() => {
    const loadUsername =
      async () => {
        if (!user?.uid)
          return;

        const usersSnapshot =
          await getDocs(
            collection(
              db,
              "users"
            )
          );

        usersSnapshot.forEach(
          (docItem) => {
            const data =
              docItem.data();

            if (
              data.email ===
              user.email
            ) {
              setRealUsername(
                data.username
              );
            }
          }
        );
      };

    loadUsername();
  }, [user]);

  useEffect(() => {
    if (!paperSvgRef.current)
      return;

    paperSvgRef.current.innerHTML =
      "";

    const rc = rough.svg(
      paperSvgRef.current
    );

    paperSvgRef.current.appendChild(
      rc.rectangle(
        6,
        6,
        848,
        618,
        {
          stroke: "#111",

          strokeWidth: 3,

          roughness: 1.7,

          bowing: 1.4,

          fill: "#fffdf7",

          fillStyle:
            "solid",

          seed: 88,
        }
      )
    );
  }, []);

  useEffect(() => {
    const loadStudyTime =
      async () => {
        if (
          !user ||
          !group?.id
        )
          return;

        const userRef = doc(
          db,
          "groups",
          group.id,
          "members",
          user.uid
        );

        const snap =
          await getDoc(userRef);

        if (snap.exists()) {
          const data =
            snap.data();

          const liveTime =
            getLiveTime(data);

          setSeconds(
            liveTime
          );

          setIsStudying(
            data.studying ||
              false
          );

          await setDoc(
            userRef,
            {
              username,
              online: true,
              updatedAt:
                Date.now(),
            },
            {
              merge: true,
            }
          );
        } else {
          await setDoc(
            userRef,
            {
              username,
              studyTime: 0,
              studying: false,
              studyStartTime:
                null,
              online: true,
              currentTask:
                "대기중",
              createdAt:
                Date.now(),
              updatedAt:
                Date.now(),
            },
            {
              merge: true,
            }
          );

          setSeconds(0);

          setIsStudying(
            false
          );
        }
      };

    loadStudyTime();
  }, [
    group?.id,
    user,
    username,
  ]);
   useEffect(() => {
  let interval;

  if (isStudying) {
    interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  return () => {
    clearInterval(interval);
  };
}, [isStudying]);

  useEffect(() => {
    if (!group?.id) return;

    const membersRef =
      collection(
        db,
        "groups",
        group.id,
        "members"
      );
      

    const unsubscribe =
      onSnapshot(
        membersRef,
        (snapshot) => {
          const data =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setMembers(data);

          const me =
            data.find(
              (m) =>
                m.id ===
                user?.uid
            );

          if (me) {
            setSeconds(
              getLiveTime(me)
            );

            setIsStudying(
              me.studying ||
                false
            );
          }
        }
      );

    return () =>
      unsubscribe();
  }, [
    group?.id,
    user?.uid,
  ]);

  useEffect(() => {
    if (!group?.id) return;

    const q = query(
      collection(
        db,
        "groups",
        group.id,
        "messages"
      ),
      orderBy(
        "createdAt",
        "asc"
      ),
      limit(50)
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {
          const data =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setMessages(data);
        }
      );

    return () =>
      unsubscribe();
  }, [group?.id]);

  const handleToggleStudy =
    async () => {
      if (
        !user ||
        !group?.id
      )
        return;

      const userRef = doc(
        db,
        "groups",
        group.id,
        "members",
        user.uid
      );

      const snap =
        await getDoc(userRef);

      const data =
        snap.exists()
          ? snap.data()
          : {};

      if (data.studying) {
        const finalTime =
          getLiveTime(data);

        await setDoc(
          userRef,
          {
            username,
            studyTime:
              finalTime,
            studying: false,
            studyStartTime:
              null,
            currentTask:
              "대기중",
          },
          {
            merge: true,
          }
        );

        setSeconds(
          finalTime
        );

        setIsStudying(
          false
        );
      } else {
        const savedTime =
          data.studyTime ||
          seconds ||
          0;

        await setDoc(
          userRef,
          {
            username,
            studyTime:
              savedTime,
            studying: true,
            studyStartTime:
              Date.now(),
            currentTask:
              "집중 공부중",
          },
          {
            merge: true,
          }
        );

        setSeconds(
          savedTime
        );

        setIsStudying(
          true
        );
      }
    };

  const sendMessage =
    async () => {
      if (!message.trim())
        return;

      await addDoc(
        collection(
          db,
          "groups",
          group.id,
          "messages"
        ),
        {
          text: message,
          username,
          uid: user.uid,
          createdAt:
            serverTimestamp(),
        }
      );

      setMessage("");
    };

  const handleLeaveGroup =
    async () => {
      if (
        !user ||
        !group?.id
      )
        return;

      try {
        await deleteDoc(
          doc(
            db,
            "groups",
            group.id,
            "members",
            user.uid
          )
        );

        setIsGroupOpen(
          false
        );

        setPage("main");
      } catch (error) {
        console.log(error);
      }
    };

  const totalStudyTime =
    members.reduce(
      (sum, member) =>
        sum +
        getLiveTime(
          member
        ),
      0
    );

  const studyingCount =
    members.filter(
      (member) =>
        member.studying
    ).length;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      <div
        onClick={() =>
          setIsGroupOpen(false)
        }
        className="absolute inset-0 bg-black/30 backdrop-blur-[3px]"
      />

      <div className="relative h-[630px] w-[860px] overflow-hidden">
        <svg
          ref={paperSvgRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 860 630"
        />

        <div className="relative z-10 flex h-full flex-col px-7 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                setPage("main")
              }
              className="text-[34px]"
            >
              ←
            </button>

            <div className="font-['Patrick_Hand'] text-[36px]">
              Study Room
            </div>

            <button
              onClick={() =>
                setIsGroupOpen(false)
              }
              className="text-[32px]"
            >
              ×
            </button>
          </div>

          <div className="mt-3 grid flex-1 grid-cols-[1fr_270px] gap-5 overflow-hidden">
            <div className="flex min-h-0 flex-col gap-4">
              <div className="rounded-[28px] border-[2px] border-black bg-[#fff7ed] p-5">
                <div className="font-['Patrick_Hand'] text-[40px] leading-none">
                  {group?.title ||
                    "Study Group"}
                </div>

                <div className="min-h-[18px] text-[13px] text-black/50">
                  {group.desc ||
                    " "}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[22px] border-[2px] border-black bg-[#dcfce7] p-4 text-center">
                  <div>
                    ONLINE
                  </div>

                  <div className="font-['Patrick_Hand'] text-[34px]">
                    {
                      members.filter(
                        (
                          m
                        ) =>
                          m.online
                      ).length
                    }
                  </div>
                </div>

                <div className="rounded-[22px] border-[2px] border-black bg-[#fde68a] p-4 text-center">
                  <div>
                    STUDYING
                  </div>

                  <div className="font-['Patrick_Hand'] text-[34px]">
                    {
                      studyingCount
                    }
                  </div>
                </div>

                <div className="rounded-[22px] border-[2px] border-black bg-[#dbeafe] p-4 text-center">
                  <div>
                    TOTAL
                  </div>

                  <div className="font-['Patrick_Hand'] text-[24px]">
                    {formatTime(
                      totalStudyTime
                    )}
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 rounded-[30px] border-[2px] border-black bg-[#f8fafc] px-5 pt-5 pb-3 overflow-hidden">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-['Patrick_Hand'] text-[30px]">
                    Live Study Desk
                  </div>

                  <div className="rounded-full border-[2px] border-black bg-white px-3 py-1 text-[12px] font-bold">
                    실시간 공부방
                  </div>
                </div>

                <div
                  className="h-[210px] overflow-y-scroll pr-2"
                  style={{
                    scrollbarWidth:
                      "thin",
                    scrollbarColor:
                      "#c7b39a transparent",
                  }}
                >
                  <div className="grid grid-cols-2 gap-4 content-start">
                    {members.map(
                      (
                        member
                      ) => (
                        <div
                          key={
                            member.id
                          }
                          className={`relative rounded-[26px] border-[2px] border-black p-4 ${
                            member.studying
                              ? "bg-[#fef3c7]"
                              : "bg-white"
                          }`}
                        >
                          <div className="absolute right-4 top-4 text-[28px]">
                            {member.studying
                              ? "🔥"
                              : "☕"}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[2px] border-black bg-[#fbcfe8] text-[24px]">
                              👤
                            </div>

                            <div>
                              <div className="font-bold text-[17px]">
                                {
                                  member.username
                                }
                              </div>

                              <div className="mt-[2px] text-[12px] text-black/55">
                                {member.currentTask ||
                                  "대기중"}
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 font-['Patrick_Hand'] text-[36px]">
                            {formatTime(
                              getLiveTime(
                                member
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-col gap-4">

  {/* My Study Time */}
  <div className="rounded-[26px] border-[2px] border-black bg-[#fde68a] px-5 py-4">
    <div className="flex items-center justify-between gap-4">

      <div>
        <div className="font-['Patrick_Hand'] text-[22px]">
          My Study Time
        </div>

        <div className="mt-1 font-['Patrick_Hand'] text-[32px] leading-none">
          {formatTime(seconds)}
        </div>
      </div>

      <button
        onClick={handleToggleStudy}
        className={`rounded-full border-[2px] border-black px-5 py-3 text-[14px] font-bold whitespace-nowrap ${
          isStudying
            ? "bg-[#fecaca]"
            : "bg-[#bbf7d0]"
        }`}
      >
        {isStudying
          ? "⏹ STOP"
          : "▶ START"}
      </button>

    </div>
  </div>

  {/* Chat */}
  <div className="flex min-h-0 flex-1 flex-col rounded-[28px] border-[2px] border-black bg-white p-4">

    <div className="mb-3 flex items-center gap-2">
      <div className="font-['Patrick_Hand'] text-[30px]">
        Group Chat
      </div>

      <div className="text-[26px]">
        💬
      </div>
    </div>

    <div
      className="
        min-h-0
        flex-1
        overflow-y-auto
        rounded-[20px]
        bg-[#f8f6ef]
        p-4
      "
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="
            mb-3
            rounded-[18px]
            bg-white
            px-4
            py-3
          "
        >
          <div className="text-[12px] font-bold text-[#db2777]">
            {msg.username}
          </div>

          <div className="mt-1 text-[14px] break-words">
            {msg.text}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-3 flex gap-2">
      <input
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="메시지 입력..."
        className="
          h-[46px]
          min-w-0
          flex-1
          rounded-full
          border-[2px]
          border-black
          px-4
          outline-none
        "
      />

      <button
        onClick={sendMessage}
        className="
          h-[46px]
          rounded-full
          border-[2px]
          border-black
          bg-[#fbcfe8]
          px-5
          font-bold
        "
      >
        전송
      </button>
    </div>
  </div>

  {/* Leave */}
  <button
    onClick={handleLeaveGroup}
    className="
      rounded-[22px]
      border-[2px]
      border-black
      bg-[#fecaca]
      px-5
      py-4
      text-[15px]
      font-bold
    "
  >
    그룹 탈퇴
  </button>

</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupRoom;