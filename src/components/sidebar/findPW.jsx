import {
  useState,
  useEffect,
  useRef,
} from "react";

import rough from "roughjs";

function FindPW({ setMode }) {
  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [birth, setBirth] =
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

        min-h-[620px]

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
        Find Password
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1">
        <label
          className="
            font-['Patrick_Hand']
            text-[16px]
          "
        >
          Username
        </label>

        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            placeholder=""
            className={inputStyle}
          />

          {!username && (
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
              your username |
            </span>
          )}
        </div>
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

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <label
          className="
            font-['Patrick_Hand']
            text-[16px]
          "
        >
          Phone
        </label>

        <div className="relative">
          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            placeholder=""
            className={inputStyle}
          />

          {!phone && (
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
              010-0000-0000 |
            </span>
          )}
        </div>
      </div>

      {/* Birth */}
      <div className="flex flex-col gap-1">
        <label
          className="
            font-['Patrick_Hand']
            text-[16px]
          "
        >
          Birth
        </label>

        <input
          type="date"
          value={birth}
          onChange={(e) =>
            setBirth(
              e.target.value
            )
          }
          className={inputStyle}
        />
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
          Find My Password
        </div>
      </div>

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