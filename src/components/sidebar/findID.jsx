import {
  useState,
  useEffect,
  useRef,
} from "react";

import rough from "roughjs";

function FindID({ setMode }) {
  const [email, setEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [
    isFindHovered,
    setIsFindHovered,
  ] = useState(false);

  const findBtnSvgRef = useRef(null);

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
            ? "rgba(253, 137, 137, 0.71)"
            : "rgba(255,255,255,0.98)",

          fillStyle: isFindHovered
            ? "hachure"
            : "solid",

          hachureGap: 7,

          fillWeight: 1.2,

          seed: 88,
        }
      );

      findBtnSvgRef.current.appendChild(
        rect
      );
    }
  }, [isFindHovered]);

  return (
    <div
      className="
        relative
        z-20

        mt-6

        flex flex-col
        gap-4
      "
    >
      {/* Title */}
      <div
        className="
          font-['Patrick_Hand']
          text-[28px]
        "
      >
        Find ID
      </div>

      {/* Username */}
      <div className="flex flex-col gap-2">
        <label
          className="
            font-['Patrick_Hand']
            text-[22px]
          "
        >
          Username
        </label>

        <input
          type="text"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          placeholder="your username"
          className="
            h-[46px]

            border-[2px]
            border-black/70

            bg-white

            px-4

            text-[16px]

            outline-none

            placeholder:text-black/30
          "
        />
      </div>

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
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          placeholder="your email"
          className="
            h-[46px]

            border-[2px]
            border-black/70

            bg-white

            px-4

            text-[16px]

            outline-none

            placeholder:text-black/30
          "
        />
      </div>

      {/* Find Button */}
      <div className="relative mt-6 z-20">
        <svg
          ref={findBtnSvgRef}
          className="
            absolute inset-0
            h-full w-full
            pointer-events-none
          "
          viewBox="0 0 260 50"
          preserveAspectRatio="none"
        />

        <div
          onMouseEnter={() =>
            setIsFindHovered(true)
          }
          onMouseLeave={() =>
            setIsFindHovered(false)
          }
          className="
            relative
            z-20

            flex
            items-center
            justify-center

            h-[48px]
            w-full

            cursor-pointer

            font-['Patrick_Hand']
            text-[22px]
          "
        >
          Find My ID
        </div>
      </div>

      {/* Back */}
      <button
        onClick={() =>
          setMode("login")
        }
        className="
          text-[12px]
          text-black/40

          hover:underline
        "
      >
        Back to Login
      </button>
    </div>
  );
}

export default FindID;