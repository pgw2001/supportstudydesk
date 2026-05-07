import { useState } from "react";

function Sidebar({ isOpen, setIsOpen, setIsStyleOpen }) {
  const [checkedItems, setCheckedItems] = useState([]);

  const menus = [
    "스타일 변경",
    "메모",
    "타이머",
    "설정",
  ];

  const toggleCheck = (menu) => {
    setCheckedItems((prev) =>
      prev.includes(menu)
        ? prev.filter((item) => item !== menu)
        : [...prev, menu]
    );

    // 스타일바 열기
    if (menu === "스타일 변경") {
      setIsStyleOpen(true);
      setIsOpen(false);
    }
  };

  return (
    <div
      className="
        absolute top-0 right-0
        h-full
        w-[285px]
        overflow-hidden
        z-[999]
        pointer-events-none
      "
    >
      {/* 패널 */}
      <div
        className="
          absolute top-0 left-0
          w-[285px]
          h-full
          bg-[#fffdf8]
          px-6
          pt-8
          pb-6
          pointer-events-auto
          transition-transform duration-300 ease-out
        "
        style={{
          transform: isOpen
            ? "translateX(0px) rotate(-0.45deg)"
            : "translateX(290px) rotate(-0.45deg)",

          borderLeft: "1.5px solid #222",

          boxShadow: "-1px 0 0 rgba(0,0,0,0.08)",

          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 28px,
              rgba(0,0,0,0.012) 29px
            )
          `,
        }}
      >
        {/* 삐뚤한 선 */}
        <div
          className="
            absolute top-0 left-0
            h-full
            w-[2px]
            bg-[#222]
          "
          style={{
            transform: "rotate(0.4deg)",
            opacity: 0.8,
          }}
        />

        {/* X 버튼 */}
        <button
          onClick={() => setIsOpen(false)}
          className="
            absolute top-3 right-5
            text-[30px]
            text-[#222]
            hover:rotate-[10deg]
            transition
          "
          style={{
            fontFamily: "Gaegu, cursive",
            transform: "rotate(-4deg)",
          }}
        >
          ×
        </button>

        {/* 제목 */}
        <div className="mb-9">
          <h1
            className="
              text-[38px]
              text-[#111]
              leading-none
              mb-[10px]
            "
            style={{
              fontFamily: "Gaegu, cursive",
              fontWeight: "300",
              letterSpacing: "0.5px",
              transform: "rotate(-1deg)",
            }}
          >
            로그인
          </h1>

          {/* rough 밑줄 */}
          <div
            className="
              h-[3px]
              bg-[#d84c3f]
            "
            style={{
              width: "72px",
              borderRadius: "999px",
              transform: "rotate(-1.5deg)",
              opacity: 0.9,
            }}
          />
        </div>

        {/* 아이디 */}
        <div
          className="
            h-[52px]
            bg-white
            flex items-center
            px-4
            mb-5
          "
          style={{
            border: "1.5px solid #222",
            borderRadius: "8px 10px 7px 11px",
            transform: "rotate(-0.35deg)",
            boxShadow: "1px 1px 0 rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="mr-3 text-[14px]"
            style={{
              transform: "rotate(5deg)",
            }}
          >
            ◯
          </div>

          <input
            type="text"
            placeholder="아이디 또는 이메일"
            className="
              flex-1
              bg-transparent
              outline-none
              text-[16px]
              placeholder:text-[#999]
            "
            style={{
              fontFamily: "Gaegu, cursive",
              letterSpacing: "0.4px",
            }}
          />
        </div>

        {/* 비밀번호 */}
        <div
          className="
            h-[52px]
            bg-white
            flex items-center
            px-4
            mb-7
          "
          style={{
            border: "1.5px solid #222",
            borderRadius: "10px 7px 11px 8px",
            transform: "rotate(0.25deg)",
            boxShadow: "1px 1px 0 rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="mr-3 text-[14px]"
            style={{
              transform: "rotate(-3deg)",
            }}
          >
            ▣
          </div>

          <input
            type="password"
            placeholder="비밀번호"
            className="
              flex-1
              bg-transparent
              outline-none
              text-[16px]
              placeholder:text-[#999]
            "
            style={{
              fontFamily: "Gaegu, cursive",
              letterSpacing: "0.4px",
            }}
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          className="
            w-full
            h-[56px]
            text-[24px]
            text-[#111]
            mb-9
            transition
            hover:translate-y-[-1px]
          "
          style={{
            fontFamily: "Gaegu, cursive",

            border: "1.5px solid #222",

            borderRadius: "9px 12px 8px 10px",

            backgroundColor: "#f6d8d2",

            backgroundImage: `
              repeating-linear-gradient(
                -45deg,
                rgba(255,255,255,0.12) 0px,
                rgba(255,255,255,0.12) 7px,
                transparent 7px,
                transparent 14px
              )
            `,

            transform: "rotate(-0.2deg)",

            boxShadow: "1px 1px 0 rgba(0,0,0,0.05)",
          }}
        >
          로그인
        </button>

        {/* 메뉴 */}
        <div className="flex flex-col gap-[2px]">
          {menus.map((menu, index) => {
            const checked = checkedItems.includes(menu);

            return (
              <div
                key={menu}
                onClick={() => toggleCheck(menu)}
                className="
                  flex items-center
                  py-[16px]
                  border-b border-dashed border-[#d7d7d7]
                  cursor-pointer
                  transition-all
                  hover:translate-x-[3px]
                "
                style={{
                  transform:
                    index % 2 === 0
                      ? "rotate(-0.18deg)"
                      : "rotate(0.12deg)",

                  marginLeft:
                    index % 2 === 0 ? "1px" : "3px",
                }}
              >
                {/* 체크박스 */}
                <div
                  className="
                    mr-4
                    bg-white
                    flex items-center justify-center
                  "
                  style={{
                    width: index % 2 === 0 ? "15px" : "14px",
                    height: index % 2 === 0 ? "14px" : "15px",

                    border: "1.4px solid #222",

                    transform:
                      index % 2 === 0
                        ? "rotate(-2deg)"
                        : "rotate(2deg)",

                    borderRadius: "2px",
                  }}
                >
                  {checked && (
                    <div
                      className="
                        bg-[#d84c3f]
                      "
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "1px",
                      }}
                    />
                  )}
                </div>

                {/* 메뉴 텍스트 */}
                <span
                  className="
                    text-[20px]
                    text-[#222]
                  "
                  style={{
                    fontFamily: "Gaegu, cursive",
                    fontWeight: "300",
                    letterSpacing: "0.5px",
                  }}
                >
                  {menu}
                </span>
              </div>
            );
          })}
        </div>

        {/* 하단 메모 */}
        <div
          className="
            absolute bottom-5 right-6
            text-[13px]
            text-[#999]
          "
          style={{
            fontFamily: "Gaegu, cursive",
            transform: "rotate(-6deg)",
            opacity: 0.9,
          }}
        >
          rough memo :)
        </div>
      </div>
    </div>
  );
}

export default Sidebar;