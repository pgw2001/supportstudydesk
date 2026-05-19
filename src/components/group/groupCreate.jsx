import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../services/firebase";

import rough from "roughjs/bundled/rough.esm";

function GroupCreate({
  setPage,
  setIsGroupOpen,
}) {
  const [title, setTitle] =
    useState("");

  const [desc, setDesc] =
    useState("");

  const [tagsInput, setTagsInput] =
    useState("");

  const [isPublic, setIsPublic] =
    useState(true);

  const [password, setPassword] =
    useState("");

  const [icon, setIcon] =
    useState("📚");

  const paperSvgRef =
    useRef(null);

  const createBtnSvgRef =
    useRef(null);

  useEffect(() => {
    if (paperSvgRef.current) {
      paperSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        paperSvgRef.current
      );

      paperSvgRef.current.appendChild(
        rc.rectangle(
          6,
          6,
          548,
          618,
          {
            stroke: "#111",

            strokeWidth: 3,

            roughness: 1.8,

            bowing: 1.6,

            fill: "#ffffff",

            fillStyle:
              "solid",

            seed: 11,
          }
        )
      );
    }

    if (createBtnSvgRef.current) {
      createBtnSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        createBtnSvgRef.current
      );

      createBtnSvgRef.current.appendChild(
        rc.rectangle(
          4,
          4,
          472,
          74,
          {
            stroke: "#111",

            strokeWidth: 2.5,

            roughness: 1.5,

            bowing: 1.3,

            fill: "#ec8f8f",

            fillStyle:
              "hachure",

            hachureGap: 7,

            fillWeight: 1,

            seed: 44,
          }
        )
      );
    }
  }, []);

  return (
    <div
      className="
        fixed
        inset-0
        z-[999999]

        flex
        items-center
        justify-center
      "
    >
      {/* bg */}
      <div
        onClick={() =>
          setIsGroupOpen(false)
        }
        className="
          absolute
          inset-0

          bg-black/30
          backdrop-blur-[3px]
        "
      />

      {/* modal */}
      <div
        className="
          relative

          h-[630px]
          w-[560px]

          overflow-hidden
        "
      >
        {/* paper */}
        <svg
          ref={paperSvgRef}
          className="
            absolute
            inset-0

            h-full
            w-full

            rounded-[24px]

            pointer-events-none
          "
        />

        {/* content */}
        <div
          className="
            relative
            z-10

            flex
            h-full
            flex-col

            px-8
            py-7
          "
        >
          {/* top */}
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            {/* back */}
            <button
              onClick={() =>
                setPage("main")
              }
              className="
                text-[34px]

                transition-all

                hover:-translate-x-1
              "
            >
              ←
            </button>

            {/* close */}
            <button
              onClick={() =>
                setIsGroupOpen(
                  false
                )
              }
              className="
                text-[30px]
                text-black/70

                transition-all

                hover:scale-110
                hover:text-black
              "
            >
              ×
            </button>
          </div>

          {/* scroll */}
          <div
            className="
              mt-2

              flex-1

              overflow-y-auto

              pr-2
            "
          >
            {/* title */}
            <div
              className="
                text-center
              "
            >
              <div
                className="
                  font-['Patrick_Hand']
                  text-[48px]
                "
              >
                Create Group
              </div>

              <div
                className="
                  mt-2

                  text-[18px]
                  text-black/60
                "
              >
                새로운 스터디 그룹을
                만들어보세요!
              </div>

              <div
                className="
                  mx-auto
                  mt-3

                  h-[3px]
                  w-[210px]

                  rounded-full

                  bg-[#ffd180]
                "
              />
            </div>

            {/* form */}
            <div
              className="
                mt-8

                flex
                flex-col

                gap-6
              "
            >
              {/* icon */}
              <div>
                <div
                  className="
                    mb-3

                    font-['Patrick_Hand']
                    text-[24px]
                  "
                >
                  그룹 아이콘
                </div>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                  "
                >
                  {[
                    "📚",
                    "💻",
                    "🔥",
                    "☕",
                    "🎯",
                    "🌙",
                    "🧠",
                  ].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() =>
                        setIcon(emoji)
                      }
                      className={`
                        flex
                        h-[56px]
                        w-[56px]

                        items-center
                        justify-center

                        rounded-full

                        border-[2px]
                        border-black

                        text-[28px]

                        transition-all

                        ${
                          icon === emoji
                            ? "bg-[repeating-linear-gradient(45deg,#f9a8d4,#f9a8d4_6px,#fbcfe8_6px,#fbcfe8_12px)]"
                            : "bg-white"
                        }
                      `}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* group name */}
              <div>
                <div
                  className="
                    mb-2

                    font-['Patrick_Hand']
                    text-[24px]
                  "
                >
                  그룹 이름
                </div>

                <input
                  type="text"

                  value={title}

                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }

                  placeholder="그룹 이름을 입력해주세요"

                  className="
                    h-[58px]
                    w-full

                    rounded-[18px]

                    border-[2px]
                    border-black

                    bg-white

                    px-5

                    outline-none

                    placeholder:text-black/35
                  "
                />
              </div>

              {/* desc */}
              <div>
                <div
                  className="
                    mb-2

                    font-['Patrick_Hand']
                    text-[24px]
                  "
                >
                  그룹 설명
                </div>

                <textarea
                  value={desc}

                  onChange={(e) =>
                    setDesc(
                      e.target.value
                    )
                  }

                  placeholder="그룹을 소개해주세요!"

                  className="
                    h-[120px]
                    w-full

                    resize-none

                    rounded-[18px]

                    border-[2px]
                    border-black

                    bg-white

                    p-5

                    outline-none

                    placeholder:text-black/35
                  "
                />
              </div>

              {/* tags */}
              <div>
                <div
                  className="
                    mb-3

                    font-['Patrick_Hand']
                    text-[24px]
                  "
                >
                  🏷️ 그룹 태그
                </div>

                <input
                  type="text"

                  value={tagsInput}

                  onChange={(e) =>
                    setTagsInput(
                      e.target.value
                    )
                  }

                  placeholder="#수능 #자격증"

                  className="
                    h-[58px]
                    w-full

                    rounded-[18px]

                    border-[2px]
                    border-black

                    bg-white

                    px-5

                    outline-none
                  "
                />
              </div>

              {/* public/private */}
              <div>
                <div
                  className="
                    mb-3

                    font-['Patrick_Hand']
                    text-[24px]
                  "
                >
                  🌍 공개 여부
                </div>

                <div
                  className="
                    flex
                    gap-4
                  "
                >
                  {/* public */}
                  <button
                    onClick={() =>
                      setIsPublic(true)
                    }

                    className={`
                      flex-1

                      rounded-[18px]

                      border-[2px]

                      px-4
                      py-4

                      text-left

                      transition-all

                      hover:-rotate-[0.5deg]

                      ${
                        isPublic
                          ? "border-[#22c55e] bg-[#f0fdf4]"
                          : "border-black bg-white"
                      }
                    `}
                  >
                    <div
                      className="
                        font-bold
                      "
                    >
                      🌍 Public
                    </div>

                    <div
                      className="
                        mt-1

                        text-[12px]
                        text-black/55
                      "
                    >
                      누구나 검색 가능
                    </div>
                  </button>

                  {/* private */}
                  <button
                    onClick={() =>
                      setIsPublic(false)
                    }

                    className={`
                      flex-1

                      rounded-[18px]

                      border-[2px]

                      px-4
                      py-4

                      text-left

                      transition-all

                      hover:rotate-[0.5deg]

                      ${
                        !isPublic
                          ? "border-[#ef4444] bg-[#fee2e2]"
                          : "border-black bg-white"
                      }
                    `}
                  >
                    <div
                      className="
                        font-bold
                      "
                    >
                      🔒 Private
                    </div>

                    <div
                      className="
                        mt-1

                        text-[12px]
                        text-black/55
                      "
                    >
                      비밀번호 필요
                    </div>
                  </button>
                </div>
              </div>

              {/* password */}
              {!isPublic && (
                <div>
                  <div
                    className="
                      mb-2

                      font-['Patrick_Hand']
                      text-[24px]
                    "
                  >
                    🔑 그룹 비밀번호
                  </div>

                  <input
                    type="password"

                    value={password}

                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }

                    placeholder="비밀번호 입력"

                    className="
                      h-[58px]
                      w-full

                      rounded-[18px]

                      border-[2px]
                      border-black

                      bg-white

                      px-5

                      outline-none

                      placeholder:text-black/35
                    "
                  />
                </div>
              )}

              {/* create button */}
              <button
                onClick={async () => {
                  try {
                    await addDoc(
                      collection(
                        db,
                        "groups"
                      ),
                      {
                        title,
                        desc,

                        tags:
                          tagsInput.split(
                            " "
                          ),

                        isPublic,

                        password:
                          isPublic
                            ? ""
                            : password,

                        icon,

                        createdAt:
                          serverTimestamp(),
                      }
                    );

                    setPage("main");
                  } catch (
                    error
                  ) {
                    console.log(
                      error
                    );

                    alert(
                      "생성 실패"
                    );
                  }
                }}

                className="
                  relative

                  mt-3

                  h-[82px]
                  w-full

                  transition-all

                  hover:-rotate-[0.5deg]
                  hover:scale-[1.01]
                "
              >
                <svg
                  ref={createBtnSvgRef}
                  className="
                    absolute
                    inset-0

                    z-0

                    h-full
                    w-full

                    overflow-visible

                    pointer-events-none
                  "
                  viewBox="0 0 480 82"
                />

                <div
                  className="
                    relative
                    z-10

                    flex
                    h-full
                    items-center
                    justify-center

                    font-['Patrick_Hand']
                    text-[30px]
                  "
                >
                  그룹 생성하기
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupCreate;