import Signup from "./Signup";
import FindPW from "./FindPW";
import Login from "./Login";
import Guest from "./guest";
import Group from "../group/group";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  X,
} from "lucide-react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase";

import rough from "roughjs";

function Sidebar({
  isOpen,
  setIsOpen,
  deskTimerDisplay,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [mode, setMode] =
    useState("login");

  const [user, setUser] =
    useState(null);

  const [loginValue, setLoginValue] =
    useState("");

  const [passwordValue, setPasswordValue] =
    useState("");

  const [
    isLoginHovered,
    setIsLoginHovered,
  ] = useState(false);

  const [
    isGroupOpen,
    setIsGroupOpen,
  ] = useState(false);

  const sidebarSvgRef = useRef(null);

  const loginBtnSvgRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setLoginValue("");
      setPasswordValue("");
      setShowPassword(false);
      setMode("login");
    }
  }, [isOpen]);

  useEffect(() => {
    if (sidebarSvgRef.current) {
      sidebarSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        sidebarSvgRef.current
      );

      const rect = rc.rectangle(
        4,
        4,
        278,
        window.innerHeight - 8,
        {
          stroke: "#111",

          strokeWidth: 2,

          roughness: 0.8,

          bowing: 1,

          fill:
            "rgba(255,255,255,0.98)",

          fillStyle: "solid",

          seed: 2,
        }
      );

      sidebarSvgRef.current.appendChild(
        rect
      );
    }

    if (loginBtnSvgRef.current) {
      loginBtnSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        loginBtnSvgRef.current
      );

      const rect = rc.rectangle(
        3,
        3,
        248,
        42,
        {
          stroke: "#111",

          strokeWidth: 2,

          roughness: 0.8,

          bowing: 1,

          fill: isLoginHovered
            ? "rgba(253,137,137,0.7)"
            : "rgba(255,255,255,0.98)",

          fillStyle: isLoginHovered
            ? "hachure"
            : "solid",

          hachureGap: 7,

          fillWeight: 1.2,

          seed: 12,
        }
      );

      loginBtnSvgRef.current.appendChild(
        rect
      );
    }
  }, [
    isLoginHovered,
    mode,
    user,
  ]);

  const handleClose = () => {
    setIsOpen(false);

    setLoginValue("");

    setPasswordValue("");

    setShowPassword(false);

    setMode("login");
  };

  const handleLogin = async () => {
    if (
      loginValue.trim() === "" ||
      passwordValue.trim() === ""
    ) {
      alert(
        "Please enter your email and password."
      );

      return;
    }

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          loginValue,
          passwordValue
        );

      const userDoc =
        await getDoc(
          doc(
            db,
            "users",
            userCredential.user.uid
          )
        );

      const userData =
        userDoc.data();

      setUser({
        uid:
          userCredential.user.uid,

        name:
          userData?.username ||
          "User",
      });

      setLoginValue("");
      setPasswordValue("");
      setShowPassword(false);

    } catch (error) {
      console.error(error);

      alert(
        "Login failed. Please check your account."
      );
    }
  };

  const handleGuest = () => {
    setUser({
      name: "Guest",
      isGuest: true,
    });

    setLoginValue("");
    setPasswordValue("");
    setShowPassword(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`
          fixed inset-0 z-[998]
          bg-black/10
          transition-all duration-300

          ${
            isOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 z-[999]

          h-screen
          w-[320px]

          transition-all duration-300 ease-out

          ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div
          className="
            relative
            ml-auto

            flex
            h-full
            w-[290px]

            flex-col

            overflow-visible

            px-4 py-4

            z-10
          "
        >
          {/* Rough Background */}
          <svg
            ref={sidebarSvgRef}
            className="
              absolute inset-0

              h-full
              w-full

              -z-10

              pointer-events-none
            "
          />

          {/* Scroll Area */}
          <div
            className="
              flex-1

              overflow-y-auto
              overflow-x-visible

              overscroll-contain

              pb-4
            "
          >
            {/* Header */}
            <div
              className="
                relative
                z-20

                flex
                items-start
                justify-between
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                {/* Profile */}
                <div className="relative">
                  <div
                    className="
                      flex
                      h-[62px]
                      w-[62px]

                      items-center
                      justify-center

                      rounded-full

                      border-[2px]
                      border-black

                      bg-white
                    "
                  >
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20 21C20 17.6863 16.4183 15 12 15C7.58172 15 4 17.6863 4 21"
                        stroke="black"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="12"
                        cy="8"
                        r="4"
                        stroke="black"
                        strokeWidth="1.7"
                      />
                    </svg>
                  </div>

                  {/* Status Dot */}
                  <div
                    className={`
                      absolute
                      bottom-[2px]
                      right-[0px]

                      h-[18px]
                      w-[18px]

                      rounded-full

                      border-[2px]
                      border-black

                      ${
                        user?.isGuest
                          ? "bg-[#f5b400]"
                          : user
                          ? "bg-[#4ade80]"
                          : "bg-[#9ca3af]"
                      }
                    `}
                  />
                </div>

                {/* User Info */}
                <div className="pt-1">
                  <div
                    className="
                      font-['Patrick_Hand']
                      text-[26px]
                      leading-none
                    "
                  >
                    {user
                      ? user.name
                      : "Username"}
                  </div>

                  <div
                    className="
                      mt-2

                      flex
                      items-center
                      gap-2

                      text-[10px]

                      tracking-[0.3em]

                      text-black/45
                    "
                  >
                    <div
                      className={`
                        h-[6px]
                        w-[6px]

                        rounded-full

                        ${
                          user?.isGuest
                            ? "bg-[#f5b400]"
                            : user
                            ? "bg-[#4ade80]"
                            : "bg-black/30"
                        }
                      `}
                    />

                    {user?.isGuest
                      ? "Guest"
                      : user
                      ? "ONLINE"
                      : "OFFLINE"}
                  </div>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={handleClose}
                className="
                  relative
                  z-20

                  transition

                  hover:rotate-90
                "
              >
                <X size={28} />
              </button>
            </div>

            {/* LOGIN */}
            {!user &&
            mode === "login" ? (
              <>
                {/* Inputs */}
                <div
                  className="
                    relative
                    z-20

                    mt-6

                    flex
                    flex-col

                    gap-4
                  "
                >
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="
                        font-['Patrick_Hand']
                        text-[22px]
                      "
                    >
                      Email
                    </label>

                    <input
                      type="email"
                      value={loginValue}
                      onChange={(e) =>
                        setLoginValue(
                          e.target.value
                        )
                      }
                      placeholder="enter your email"
                      className="
                        h-[46px]

                        border-[2px]
                        border-black/70

                        bg-white

                        px-4

                        text-[16px]

                        outline-none
                      "
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="
                        font-['Patrick_Hand']
                        text-[22px]
                      "
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={passwordValue}
                        onChange={(e) =>
                          setPasswordValue(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key ===
                            "Enter"
                          ) {
                            handleLogin();
                          }
                        }}
                        placeholder="••••••••"
                        className="
                          h-[46px]
                          w-full

                          border-[2px]
                          border-black/70

                          bg-white

                          px-4
                          pr-12

                          text-[16px]

                          outline-none
                        "
                      />
                    </div>
                  </div>
                </div>

                {/* Login Button */}
                <div
                  className="
                    relative
                    mt-6
                    z-20
                  "
                >
                  <svg
                    ref={loginBtnSvgRef}
                    className="
                      absolute
                      inset-0

                      h-full
                      w-full

                      pointer-events-none
                    "
                    viewBox="0 0 260 50"
                  />

                  <button
                    onClick={handleLogin}
                    onMouseEnter={() =>
                      setIsLoginHovered(true)
                    }
                    onMouseLeave={() =>
                      setIsLoginHovered(false)
                    }
                    className="
                      relative
                      z-20

                      h-[48px]
                      w-full

                      font-['Patrick_Hand']
                      text-[22px]
                    "
                  >
                    Login
                  </button>
                </div>

                {/* Links */}
                <div
                  className="
                    relative
                    z-20

                    mt-4

                    flex
                    justify-center

                    gap-3

                    text-[11px]
                    text-black/35
                  "
                >
                  <button
                    onClick={() =>
                      setMode("findPW")
                    }
                    className="
                      transition-all
                      hover:underline
                      hover:text-black/70
                    "
                  >
                    Find PW
                  </button>

                  <span>|</span>

                  <button
                    onClick={() =>
                      setMode("signup")
                    }
                    className="
                      transition-all
                      hover:underline
                      hover:text-black/70
                    "
                  >
                    Sign Up
                  </button>

                  <span>|</span>

                  <button
                    onClick={handleGuest}
                    className="
                      transition-all
                      hover:underline
                      hover:text-black/70
                    "
                  >
                    Guest
                  </button>
                </div>
              </>
            ) : !user &&
              mode === "signup" ? (
              <Signup setMode={setMode} />
            ) : !user &&
              mode === "findPW" ? (
              <FindPW setMode={setMode} />
            ) : null}

            {user?.isGuest ? (
              <Guest
                user={user}
                setUser={setUser}
              />
            ) : user ? (
              <Login
                user={user}
                setUser={setUser}
                setIsGroupOpen={
                  setIsGroupOpen
                }
                deskTimerDisplay={
                deskTimerDisplay}
              />
            ) : null}
          </div>
        </div>
      </div>

      {
        isGroupOpen && (
          <Group
            setIsGroupOpen={
              setIsGroupOpen
            }
          />
        )
      }
    </>
  );
}

export default Sidebar;