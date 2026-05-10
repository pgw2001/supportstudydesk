import { auth } from "../../services/firebase";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import rough from "roughjs";

function Signup({ setMode }) {
  const [username, setUsername] =
    useState("");

  const [id, setId] =
    useState("");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [birth, setBirth] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    isCreateHovered,
    setIsCreateHovered,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const createBtnSvgRef =
    useRef(null);

  useEffect(() => {
    if (createBtnSvgRef.current) {
      createBtnSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        createBtnSvgRef.current
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

          fill: isCreateHovered
            ? "rgba(253,137,137,0.72)"
            : "rgba(255,255,255,0.98)",

          fillStyle: isCreateHovered
            ? "hachure"
            : "solid",

          hachureGap: 7,

          fillWeight: 1.2,

          seed: 44,
        }
      );

      createBtnSvgRef.current.appendChild(
        rect
      );
    }
  }, [isCreateHovered]);

  const handleSignup =
    async () => {
      if (
        username.trim() === "" ||
        id.trim() === "" ||
        name.trim() === "" ||
        phone.trim() === "" ||
        birth.trim() === "" ||
        email.trim() === "" ||
        password.trim() === "" ||
        confirmPassword.trim() === ""
      ) {
        setMessage(
          "Fill all fields."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        setMessage(
          "Passwords do not match."
        );

        return;
      }

      try {
        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        console.log(
          "Account created successfully:",
          userCredential.user
        );

        setMessage(
          "Account created successfully!"
        );
      } catch (error) {
        console.error(error);

        setMessage(error.message);
      }
    };

  const inputStyle = `
    h-[36px]

    border-[2px]
    border-black/70

    bg-white

    px-3

    text-[14px]

    text-black
    caret-black

    outline-none

    placeholder:text-black/30
  `;

  return (
    <div
      className="
        relative
        z-20

        mt-4

        min-h-[760px]

        flex
        flex-col
        gap-2
      "
    >
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

        <input
          type="text"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          placeholder="your username"
          className={inputStyle}
        />
      </div>

      {/* ID */}
      <div className="flex flex-col gap-1">
        <label
          className="
            font-['Patrick_Hand']
            text-[16px]
          "
        >
          ID
        </label>

        <input
          type="text"
          value={id}
          onChange={(e) =>
            setId(
              e.target.value
            )
          }
          placeholder="your id"
          className={inputStyle}
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label
          className="
            font-['Patrick_Hand']
            text-[16px]
          "
        >
          Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="your name"
          className={inputStyle}
        />
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

        <input
          type="tel"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          placeholder="010-0000-0000"
          className={inputStyle}
        />
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

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          placeholder="your email"
          className={inputStyle}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label
          className="
            font-['Patrick_Hand']
            text-[16px]
          "
        >
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          placeholder="password"
          className={inputStyle}
        />
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <label
          className="
            font-['Patrick_Hand']
            text-[16px]
          "
        >
          Confirm Password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          placeholder="confirm password"
          className={inputStyle}
        />
      </div>

      {/* Create Account */}
      <div
        className="
          relative
          mt-3
          z-20
        "
      >
        <svg
          ref={createBtnSvgRef}
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
          onClick={handleSignup}
          onMouseEnter={() =>
            setIsCreateHovered(
              true
            )
          }
          onMouseLeave={() =>
            setIsCreateHovered(
              false
            )
          }
          className="
            relative
            z-20

            h-[42px]
            w-full

            bg-transparent

            font-['Patrick_Hand']
            text-[18px]
          "
        >
          Create Account
        </button>
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

export default Signup;