import Signup from "./Signup";
import FindID from "./FindID";
import FindPW from "./FindPW";
import Login from "./Login";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Clock3,
  CheckSquare,
  StickyNote,
  Palette,
  Settings,
  X,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

import rough from "roughjs";

function Sidebar({
  isOpen,
  setIsOpen,
  setIsStyleOpen,
}) {
  const [selected, setSelected] =
    useState(null);

  const [hoveredIndex, setHoveredIndex] =
    useState(null);

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

  const [isLoginHovered, setIsLoginHovered] =
    useState(false);

  const sidebarSvgRef = useRef(null);

  const menuSvgRefs = useRef([]);

  const loginBtnSvgRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);

      setLoginValue("");

      setPasswordValue("");

      setShowPassword(false);

      setMode("login");
    }
  }, [isOpen]);

  const menus = [
    {
      name: "Timer",
      icon: (
        <Clock3
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      name: "Todo List",
      icon: (
        <CheckSquare
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      name: "Memo",
      icon: (
        <StickyNote
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      name: "Style Bar",
      icon: (
        <Palette
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
    {
      name: "Settings",
      icon: (
        <Settings
          size={18}
          strokeWidth={1.8}
        />
      ),
    },
  ];

  useEffect(() => {
    // Sidebar
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

    // Login Button
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
            ? "rgba(253, 137, 137, 0.71)"
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

    // Menu
    menuSvgRefs.current.forEach(
      (svg, i) => {
        if (!svg) return;

        svg.innerHTML = "";

        const rc = rough.svg(svg);

        const isSelected =
          selected === menus[i].name;

        const isHovered =
          hoveredIndex === i;

        const rect = rc.rectangle(
          3,
          3,
          252,
          52,
          {
            stroke: "#111",

            strokeWidth: isSelected
              ? 2
              : 1.4,

            roughness:
              isSelected || isHovered
                ? 1.6
                : 0.8,

            bowing: 1,

            fill: isSelected
              ? "rgba(255,120,120,0.18)"
              : isHovered
              ? "rgba(253, 137, 137, 0.71)"
              : "rgba(255,255,255,0.98)",

            fillStyle:
              isHovered || isSelected
                ? "hachure"
                : "solid",

            hachureGap: 7,

            fillWeight: 1.2,

            seed: i + 30,
          }
        );

        svg.appendChild(rect);
      });
  }, [
    selected,
    hoveredIndex,
    isLoginHovered,
  ]);

  const handleMenuClick = (
    menuName
  ) => {
    setSelected(menuName);

    if (menuName === "Style Bar") {
      setIsStyleOpen(true);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);

    setSelected(null);

    setLoginValue("");

    setPasswordValue("");

    setShowPassword(false);

    setMode("login");
  };

  const handleLogin = () => {
    if (
      loginValue.trim() === "" ||
      passwordValue.trim() === ""
    ) {
      alert("Please enter your ID and password.");
      return;
    }

    setUser({
      name: loginValue,
      type: "user",
    });

    setLoginValue("");
    setPasswordValue("");
    setShowPassword(false);
    setMode("login");
  };

  const handleGuest = () => {
    setUser({
      name: "Guest",
      type: "guest",
    });

    setLoginValue("");
    setPasswordValue("");
    setShowPassword(false);
    setMode("login");
  };

  const handleLogout = () => {
    setUser(null);

    setLoginValue("");
    setPasswordValue("");
    setShowPassword(false);
    setMode("login");
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
          h-screen w-[320px]
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
            relative ml-auto
            flex h-full w-[290px]
            flex-col
            px-4 py-4
            z-10
          "
          style={{
            transform:
              "rotate(-0.08deg)",
          }}
        >
          {/* Rough Sidebar */}
          <svg
            ref={sidebarSvgRef}
            className="
              absolute inset-0
              h-full w-full
              -z-10
              pointer-events-none
            "
          />

          {/* Header */}
          <div className="relative z-20 flex items-start justify-between">
            {/* Profile */}
            <div
              className="
                flex items-start
                gap-3
              "
            >
              {/* Profile Circle */}
              <div className="relative">
                <div
                  className="
                    flex items-center
                    justify-center

                    h-[62px]
                    w-[62px]

                    rounded-full
                    border-[2px]
                    border-black

                    bg-white
                  "
                  style={{
                    transform:
                      "rotate(-2deg)",
                  }}
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

                {/* Status DOT */}
                <div
                  className={`
                    absolute
                    bottom-[2px]
                    right-[0px]

                    flex items-center
                    justify-center

                    h-[18px]
                    w-[18px]

                    rounded-full
                    border-[2px]
                    border-black

                    ${
                      user &&
                      user.type === "user"
                        ? "bg-[#4ade80]"
                        : "bg-[#f59e0b]"
                    }
                  `}
                >
                  <div
                    className={`
                      h-[5px]
                      w-[5px]
                      rounded-full

                      ${
                        user &&
                        user.type === "user"
                          ? "bg-[#dcfce7]"
                          : "bg-[#fde68a]"
                      }
                    `}
                  />
                </div>
              </div>

              {/* Username */}
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
                    flex items-center
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
                        user &&
                        user.type === "user"
                          ? "bg-[#4ade80]"
                          : "bg-[#f59e0b]"
                      }
                    `}
                  />

                  {user &&
                  user.type === "user"
                    ? "ONLINE"
                    : "GUEST"}
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
              <X
                size={28}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* LOGIN / SIGNUP */}
          {!user &&
          mode === "login" ? (
            <>
              {/* Inputs */}
              <div
                className="
                  relative
                  z-20
                  mt-6
                  flex flex-col
                  gap-4
                "
              >
                {/* Login */}
                <div className="flex flex-col gap-2">
                  <label
                    className="
                      font-['Patrick_Hand']
                      text-[22px]
                    "
                  >
                    Login
                  </label>

                  <input
                    type="text"
                    value={loginValue}
                    onChange={(e) =>
                      setLoginValue(
                        e.target.value
                      )
                    }
                    placeholder="enter your id"
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

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <div className="relative mt-6 z-20">
                <svg
                  ref={loginBtnSvgRef}
                  className="
                    absolute inset-0
                    h-full w-full
                    pointer-events-none
                  "
                  viewBox="0 0 260 50"
                  preserveAspectRatio="none"
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

                  flex justify-center
                  gap-3

                  text-[11px]
                  text-black/35
                "
              >
                <button
                  onClick={() =>
                    setMode("findID")
                  }
                  className="
                    transition
                    hover:text-black
                    hover:underline
                  "
                >
                  Find ID
                </button>

                <span>|</span>

                <button
                  onClick={() =>
                    setMode("findPW")
                  }
                  className="
                    transition
                    hover:text-black
                    hover:underline
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
                    transition
                    hover:text-black
                    hover:underline
                  "
                >
                  Sign Up
                </button>

                <span>|</span>

                <button
                  onClick={handleGuest}
                  className="
                    transition
                    hover:text-black
                    hover:underline
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
            mode === "findID" ? (
            <FindID setMode={setMode} />
          ) : !user &&
            mode === "findPW" ? (
            <FindPW setMode={setMode} />
          ) : (
            <div
              className="
                relative
                z-20

                mt-6

                rounded-[28px]
                border-[2px]
                border-black

                bg-[#fffdf8]

                p-5

                shadow-[4px_4px_0_rgba(0,0,0,0.12)]
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <div
                    className="
                      font-['Patrick_Hand']
                      text-[30px]
                      leading-none
                    "
                  >
                    Welcome back,
                  </div>

                  <div
                    className="
                      mt-2

                      font-['Patrick_Hand']
                      text-[38px]

                      text-[#ef4444]
                      leading-none
                    "
                  >
                    {user.name}
                  </div>
                </div>

                <div
                  className={`
                    h-[14px]
                    w-[14px]

                    rounded-full

                    border-[2px]
                    border-black

                    ${
                      user.type === "user"
                        ? "bg-[#4ade80]"
                        : "bg-[#f59e0b]"
                    }
                  `}
                />
              </div>

              <div
                className="
                  mt-6

                  flex
                  flex-col
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between

                    rounded-[16px]

                    border-[2px]
                    border-black

                    bg-white

                    px-4
                    py-3
                  "
                >
                  <span
                    className="
                      font-['Patrick_Hand']
                      text-[22px]
                    "
                  >
                    Study Time
                  </span>

                  <span
                    className="
                      text-[14px]
                      tracking-[0.2em]
                    "
                  >
                    02:14:32
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between

                    rounded-[16px]

                    border-[2px]
                    border-black

                    bg-white

                    px-4
                    py-3
                  "
                >
                  <span
                    className="
                      font-['Patrick_Hand']
                      text-[22px]
                    "
                  >
                    Focus
                  </span>

                  <span
                    className="
                      text-[14px]
                      tracking-[0.2em]
                    "
                  >
                    HIGH
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="
                  mt-6

                  flex
                  items-center
                  justify-center

                  h-[50px]
                  w-full

                  rounded-[16px]

                  border-[2px]
                  border-black

                  bg-white

                  font-['Patrick_Hand']
                  text-[24px]

                  transition-all

                  hover:bg-[#ffe4e4]
                  hover:translate-y-[2px]

                  active:translate-y-[4px]
                "
              >
                Logout
              </button>
            </div>
          )}

          {/* Menus */}
          {
            mode === "login" && (
              <div
                className="
                  relative
                  z-20

                  mt-8

                  flex flex-col
                  gap-3
                "
              >
                {menus.map(
                  (menu, index) => {
                    return (
                      <button
                        key={menu.name}
                        onClick={() =>
                          handleMenuClick(
                            menu.name
                          )
                        }
                        onMouseEnter={() =>
                          setHoveredIndex(index)
                        }
                        onMouseLeave={() =>
                          setHoveredIndex(null)
                        }
                        className={`
                          relative

                          h-[58px]
                          w-full

                          text-left

                          transition-all
                          duration-200

                          hover:translate-x-[2px]
                          hover:scale-[1.01]

                          ${
                            selected ===
                            menu.name
                              ? "scale-[1.02]"
                              : ""
                          }
                        `}
                        style={{
                          transform:
                            index % 2 === 0
                              ? "rotate(0.1deg)"
                              : "rotate(-0.1deg)",
                        }}
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
                          preserveAspectRatio="none"
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
                          <div className="flex items-center gap-3">
                            <div>
                              {menu.icon}
                            </div>

                            <span
                              className="
                                font-['Patrick_Hand']
                                text-[20px]
                              "
                            >
                              {menu.name}
                            </span>
                          </div>

                          <ChevronRight
                            size={16}
                            strokeWidth={1.8}
                            className="text-black/40"
                          />
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

export default Sidebar;