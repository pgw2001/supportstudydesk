import { useState } from "react";
import {
  Clock3,
  CheckSquare,
  StickyNote,
  Palette,
  Settings,
  X,
} from "lucide-react";

function Sidebar({
  isOpen,
  setIsOpen,
  setIsStyleOpen,
}) {
  const [selected, setSelected] = useState("타이머");

  const menus = [
    {
      name: "타이머",
      icon: <Clock3 size={18} />,
    },
    {
      name: "투두리스트",
      icon: <CheckSquare size={18} />,
    },
    {
      name: "메모",
      icon: <StickyNote size={18} />,
    },
    {
      name: "스타일바",
      icon: <Palette size={18} />,
    },
    {
      name: "설정",
      icon: <Settings size={18} />,
    },
  ];

  const handleMenuClick = (menuName) => {
    setSelected(menuName);

    // 스타일바 열기
    if (menuName === "스타일바") {
      setIsStyleOpen(true);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 배경 */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-[998]
          bg-black/20
          transition-all duration-300
          ${
            isOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* 사이드바 */}
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
            ml-auto
            flex h-full w-[290px]
            flex-col
            border-l border-black/10
            bg-[#f3f2ef]
            px-7
            py-7
            shadow-[-8px_0_20px_rgba(0,0,0,0.08)]
          "
        >
          {/* 닫기 */}
          <button
            onClick={() => setIsOpen(false)}
            className="
              ml-auto
              text-black
              transition
              hover:rotate-90
            "
          >
            <X size={28} />
          </button>

          {/* 로그인 */}
          <div className="mt-8">
            <h1
              className="
                text-[24px]
                font-bold
                leading-[1.4]
                tracking-[-0.03em]
              "
            >
              로그인 하여
              <br />
              여러 기능을
              <br />
              이용해보세요!
            </h1>

            {/* 버튼 */}
            <button
              className="
                mt-8
                h-[52px]
                w-full
                rounded-full
                border border-black
                bg-white
                text-[22px]
                font-semibold
                shadow-[2px_3px_0_rgba(0,0,0,0.12)]
                transition-all
                hover:-translate-y-[1px]
                active:translate-y-[2px]
                active:shadow-none
              "
            >
              로그인
            </button>

            {/* 링크 */}
            <div
              className="
                mt-3
                flex justify-center
                gap-3
                text-[11px]
                text-gray-500
              "
            >
              <button>아이디 찾기</button>
              <button>비밀번호 찾기</button>
              <button>회원가입</button>
            </div>
          </div>

          {/* 메뉴 */}
          <div className="mt-14 flex flex-col gap-3">
            {menus.map((menu) => {
              const active = selected === menu.name;

              return (
                <button
                  key={menu.name}
                  onClick={() =>
                    handleMenuClick(menu.name)
                  }
                  className={`
                    flex items-center gap-4
                    rounded-2xl
                    px-4 py-4
                    text-left
                    transition-all duration-200
                    hover:bg-black/[0.04]
                    ${
                      active
                        ? "bg-white shadow-sm"
                        : ""
                    }
                  `}
                >
                  <div className="text-black/80">
                    {menu.icon}
                  </div>

                  <span
                    className="
                      text-[18px]
                      font-medium
                      tracking-[-0.02em]
                    "
                  >
                    {menu.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;