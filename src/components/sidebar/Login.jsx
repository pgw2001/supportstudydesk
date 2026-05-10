import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import rough from "roughjs";

function Login({
  setUser,
  setMode,
}) {
  const [loginValue, setLoginValue] =
    useState("");

  const [passwordValue,
    setPasswordValue] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [isLoginHovered,
    setIsLoginHovered] =
    useState(false);

  const loginBtnSvgRef =
    useRef(null);

  useEffect(() => {
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
            ? "rgba(253,137,137,0.72)"
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
  }, [isLoginHovered]);

  const handleLogin = () => {
    if (
      loginValue.trim() === "" ||
      passwordValue.trim() === ""
    ) {
      alert("Fill all fields!");
      return;
    }

    setUser({
      name: loginValue,
    });
  };

  return (
    <div
      className="
        relative
        z-20

        mt-6

        rounded-[28px]
        border-[2px]
        border-black/80

        bg-[#fffdf8]

        p-5

        shadow-[5px_5px_0px_rgba(0,0,0,0.12)]

        rotate-[-0.3deg]
      "
    >
      {/* Top */}
      <div
        className="
          mb-5

          flex
          items-center
          justify-between
        "
      >
        <div>
          <div
            className="
              font-['Patrick_Hand']
              text-[34px]
              leading-none
            "
          >
            Login
          </div>

          <div
            className="
              mt-1

              text-[11px]
              tracking-[0.28em]
              text-black/40
            "
          >
            STUDY DESK
          </div>
        </div>

        <div
          className="
            h-[14px]
            w-[14px]

            rounded-full

            border-[2px]
            border-black

            bg-[#f59e0b]
          "
        />
      </div>

      {/* Inputs */}
      <div
        className="
          flex
          flex-col
          gap-4
        "
      >
        {/* ID */}
        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
          <label
            className="
              font-['Patrick_Hand']
              text-[22px]
            "
          >
            ID
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
              h-[50px]

              rounded-[16px]

              border-[2px]
              border-black/70

              bg-[#fffaf0]

              px-4

              text-[15px]

              shadow-[2px_2px_0_rgba(0,0,0,0.08)]

              outline-none

              transition-all

              focus:translate-y-[2px]
            "
          />
        </div>

        {/* Password */}
        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
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
                h-[50px]
                w-full

                rounded-[16px]

                border-[2px]
                border-black/70

                bg-[#fffaf0]

                px-4
                pr-12

                text-[15px]

                shadow-[2px_2px_0_rgba(0,0,0,0.08)]

                outline-none

                transition-all

                focus:translate-y-[2px]
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
                right-4
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
      <div
        className="
          relative
          mt-6
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
            text-[26px]

            tracking-wide

            transition-all

            hover:translate-y-[2px]

            active:translate-y-[4px]
          "
        >
          Login
        </button>
      </div>

      {/* Bottom Links */}
      <div
        className="
          mt-5

          flex
          justify-center
          gap-3

          text-[11px]
          text-black/38
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
      </div>
    </div>
  );
}

export default Login;