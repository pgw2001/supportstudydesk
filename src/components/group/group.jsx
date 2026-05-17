import {
  useEffect,
  useRef,
  useState,
} from "react";

import rough from "roughjs/bundled/rough.esm";

function Group({
  setIsGroupOpen,
}) {
  const groupSvgRef =
    useRef(null);

  const groupRef =
    useRef(null);

  const [
    position,
    setPosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const dragOffset =
    useRef({
      x: 0,
      y: 0,
    });

  useEffect(() => {
    if (
      groupSvgRef.current
    ) {
      groupSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        groupSvgRef.current
      );

      const rect =
        rc.rectangle(
          4,
          4,
          392,
          492,
          {
            stroke: "#111",

            strokeWidth: 3,

            roughness: 1.2,

            bowing: 1.5,

            fill: "#f6f1e8",

            fillStyle:
              "solid",
          }
        );

      groupSvgRef.current.appendChild(
        rect
      );
    }
  }, []);

  useEffect(() => {
    const handleMouseMove =
      (e) => {
        if (
          !isDragging
        )
          return;

        setPosition({
          x:
            e.clientX -
            dragOffset
              .current.x,

          y:
            e.clientY -
            dragOffset
              .current.y,
        });
      };

    const handleMouseUp =
      () => {
        setIsDragging(
          false
        );
      };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  }, [isDragging]);

  const handleMouseDown =
    (e) => {
      const rect =
        groupRef.current.getBoundingClientRect();

      dragOffset.current =
        {
          x:
            e.clientX -
            rect.left,

          y:
            e.clientY -
            rect.top,
        };

      setIsDragging(true);
    };

  const members = [
    {
      name: "오늘도간다",
      time: "12:15:29",
      active: true,
    },

    {
      name: "장미쭈니",
      time: "11:55:09",
      active: true,
    },

    {
      name: "공대생 콩이",
      time: "13:08:28",
      active: false,
    },

    {
      name: "초특급럿수",
      time: "10:10:37",
      active: true,
    },

    {
      name: "우사기2",
      time: "10:22:40",
      active: false,
    },

    {
      name: "돌하르방",
      time: "10:30:36",
      active: false,
    },
  ];

  return (
    <div
      ref={groupRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="
        fixed

        bottom-[40px]
        right-[320px]

        z-[99999]

        cursor-default
      "
    >
      <div
        className="
          relative

          h-[500px]
          w-[400px]
        "
      >
        {/* Rough Background */}
        <svg
          ref={groupSvgRef}
          className="
            absolute
            inset-0

            h-full
            w-full

            -z-10

            pointer-events-none
          "
        />

        {/* Header */}
        <div
          onMouseDown={
            handleMouseDown
          }
          className="
            flex
            items-center
            justify-between

            px-5
            pt-4

            cursor-move
            select-none
          "
        >
          <div>
            <div
              className="
                text-[25px]

                font-bold

                font-['Patrick_Hand']
              "
            >
              Study Group 📚
            </div>

            <div
              className="
                text-[12px]
                text-black/50
              "
            >
              8명 공부중
            </div>
          </div>

          <button
            onClick={() =>
              setIsGroupOpen(
                false
              )
            }
            className="
              flex
              h-[32px]
              w-[32px]

              items-center
              justify-center

              rounded-full

              border-[2px]
              border-black

              bg-[#ffe082]

              text-[16px]
              font-bold

              transition-all

              hover:rotate-6
              hover:bg-[#ffcc80]
            "
          >
            ✕
          </button>
        </div>

        {/* Group Info */}
        <div
          className="
            mx-5
            mt-4

            rounded-[16px]

            border-[2px]
            border-black

            bg-[#fffaf0]

            p-3
          "
        >
          <div
            className="
              text-[15px]
              font-bold
            "
          >
            🔥 열정 대학생
          </div>

          <div
            className="
              mt-1

              text-[12px]
              text-black/60
            "
          >
            오늘도 같이 집중해보자!
          </div>
        </div>

        {/* Member List */}
        <div
          className="
            mt-5

            grid
            grid-cols-2
            gap-3

            px-5
          "
        >
          {members.map(
            (
              member,
              index
            ) => (
              <div
                key={index}
                className={`
                  relative

                  rounded-[18px]

                  border-[2px]
                  border-black

                  p-3

                  transition-all
                  duration-200

                  hover:-rotate-1
                  hover:scale-[1.02]

                  ${
                    member.active
                      ? "bg-[#ffe0b2]"
                      : "bg-[#f5f5f5]"
                  }
                `}
              >
                <div
                  className={`
                    absolute
                    right-[10px]
                    top-[10px]

                    h-[10px]
                    w-[10px]

                    rounded-full

                    ${
                      member.active
                        ? "bg-[#ff7043]"
                        : "bg-[#9e9e9e]"
                    }
                  `}
                />

                <div
                  className="
                    text-[30px]
                  "
                >
                  🪑
                </div>

                <div
                  className="
                    mt-1

                    truncate

                    text-[14px]
                    font-bold
                  "
                >
                  {
                    member.name
                  }
                </div>

                <div
                  className="
                    text-[13px]
                    text-black/60
                  "
                >
                  {
                    member.time
                  }
                </div>
              </div>
            )
          )}
        </div>

        {/* Bottom Button */}
        <div
          className="
            absolute
            bottom-[18px]

            w-full

            px-5
          "
        >
          <button
            className="
              w-full

              rounded-[18px]

              border-[2px]
              border-black

              bg-[#ffb74d]

              py-3

              text-[17px]
              font-bold

              transition-all

              hover:-rotate-1
              hover:bg-[#ffa726]
            "
          >
            그룹 가입 신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default Group;