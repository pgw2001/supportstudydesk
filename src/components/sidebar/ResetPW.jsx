import {
  useState,
  useEffect,
  useRef,
} from "react";

import rough from "roughjs";

import {
  sendPasswordResetEmail
} from "firebase/auth";

import { auth } from "../../services/firebase";


function FindPW({ setMode }) {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    isFindHovered,
    setIsFindHovered,
  ] = useState(false);

  const findBtnSvgRef =
    useRef(null);

  useEffect(() => {
    if (findBtnSvgRef.current) {
      findBtnSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        findBtnSvgRef.current
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

          fill: isFindHovered
            ? "rgba(253,137,137,0.71)"
            : "rgba(255,255,255,0.98)",

          fillStyle: isFindHovered
            ? "hachure"
            : "solid",

          hachureGap: 7,

          fillWeight: 1.2,

          seed: 99,
        }
      );

      findBtnSvgRef.current.appendChild(
        rect
      );
    }
  }, [isFindHovered]);

  const handleFindPW =
    async () => {
      if (
        email.trim() === "" 
      ) {
        setMessage(
          "Fill all fields."
        );

        return;
      }

  try {

  await sendPasswordResetEmail(
    auth,
    email
    );

    setMessage(
    "Password reset email sent."
    );

    } catch (error) {

    console.error(error);

    setMessage(
      "Email not found."
        );
      }
    };

  const inputStyle = `
    w-full

    h-[36px]

    border-[2px]
    border-black/70

    bg-white

    px-3

    text-[14px]

    outline-none

    caret-black
    caret-[2px]

    placeholder:text-black/30
  `;

  return (
    <div
      className="
        relative
        z-20

        mt-4

        min-h-[720px]

        flex
        flex-col
        gap-2
      "
    >
      {/* Title */}
      <div
        className="
          font-['Patrick_Hand']
          text-[22px]
        "
      >
        Reset Password
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label
          className="
            font-['Patrick_Hand']
            text-[16px]
          "
        >
          Email
        </label>

        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder=""
            className={inputStyle}
          />

          {!email && (
            <span
              className="
                pointer-events-none

                absolute
                left-3
                top-1/2
                -translate-y-1/2

                font-['Patrick_Hand']
                text-[14px]

                text-black/35

                animate-pulse
              "
            >
              your email |
            </span>
          )}
        </div>
      </div>

      {/* Find Button */}
      <div
        className="
          relative
          mt-4
          z-20
        "
      >
        <svg
          ref={findBtnSvgRef}
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

        <div
          onClick={handleFindPW}
          onMouseEnter={() =>
            setIsFindHovered(
              true
            )
          }
          onMouseLeave={() =>
            setIsFindHovered(
              false
            )
          }
          className="
            relative
            z-20

            flex
            items-center
            justify-center

            h-[42px]
            w-full

            cursor-pointer

            font-['Patrick_Hand']
            text-[18px]
          "
        >
          Send Reset Email
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className="
            relative

            mt-2

            border-[2px]
            border-black

            bg-[#fff8dc]

            px-3
            py-2

            shadow-[3px_3px_0_rgba(0,0,0,0.18)]
          "
          style={{
            transform:
              "rotate(-0.5deg)",
          }}
        >
          <button
            onClick={() =>
              setMessage("")
            }
            className="
              absolute
              right-2
              top-1

              text-[16px]
            "
          >
            ×
          </button>

          <div
            className="
              mt-1

              font-['Patrick_Hand']
              text-[15px]

              text-black/70
            "
          >
            {message}
          </div>
        </div>
      )}

      {/* Back */}
      <button
        onClick={() =>
          setMode("login")
        }
        className="
          text-[11px]
          text-black/40

          hover:underline
        "
      >
        Back to Login
      </button>
    </div>
  );
}

export default FindPW;