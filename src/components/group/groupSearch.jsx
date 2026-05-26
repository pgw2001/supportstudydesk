import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../services/firebase";

import rough from "roughjs/bundled/rough.esm";

function GroupSearch({
  setPage,
  setIsGroupOpen,
  setSelectedGroup,
}) {
  const paperSvgRef =
    useRef(null);

  const searchInputSvgRef =
    useRef(null);

  const [groups, setGroups] = useState([]);

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

    if (
      searchInputSvgRef.current
    ) {
      searchInputSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        searchInputSvgRef.current
      );

      searchInputSvgRef.current.appendChild(
        rc.rectangle(
          4,
          4,
          472,
          64,
          {
            stroke: "#111",

            strokeWidth: 2.5,

            roughness: 1.5,

            bowing: 1.3,

            fill: "#ffffff",

            fillStyle:
              "solid",

            seed: 22,
          }
        )
      );
    }
  }, []);
  useEffect(() => {
  const fetchGroups =
    async () => {
      try {
        const querySnapshot =
          await getDocs(
            collection(
              db,
              "groups"
            )
          );

        const data =
          querySnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setGroups(data);
      } catch (error) {
        console.log(error);
      }
    };

  fetchGroups();
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
                Search Group 🔍
              </div>

              <div
                className="
                  mt-2

                  text-[18px]
                  text-black/60
                "
              >
                원하는 그룹을
                찾아보세요!
              </div>

              <div
                className="
                  mx-auto
                  mt-3

                  h-[3px]
                  w-[210px]

                  rounded-full

                  bg-[#a78bfa]
                "
              />
            </div>

            {/* search input */}
            <div
              className="
                relative

                mt-8

                h-[72px]
              "
            >
              <svg
                ref={
                  searchInputSvgRef
                }
                className="
                  absolute
                  inset-0

                  h-full
                  w-full

                  pointer-events-none
                "
                viewBox="0 0 480 72"
              />

              <div
                className="
                  relative
                  z-10

                  flex
                  h-full
                  items-center

                  px-6
                "
              >
                <span
                  className="
                    text-[28px]
                  "
                >
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="그룹 이름 검색..."
                  className="
                    ml-4

                    flex-1

                    bg-transparent

                    text-[18px]

                    outline-none

                    placeholder:text-black/35
                  "
                />
              </div>
            </div>

            

            {/* list */}
            <div
              className="
                mt-7

                flex
                flex-col

                gap-3

                pb-5
              "
            >
              {groups.map(
                (group) => (
                  <button
                    key={group.id}

                    onClick={()=>{
                        setSelectedGroup(group);
                        setPage("room");
                    }}
                    className={`
                      flex
                      items-center
                      justify-between

                      rounded-[20px]

                      border-[2px]
                      border-black
                      border-l-[8px]

                      ${group.color}

                      bg-white

                      px-5
                      py-4

                      text-left

                      transition-all

                      hover:-rotate-[0.5deg]
                      hover:bg-[#fffdf7]
                    `}
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-[52px]
                          w-[52px]

                          items-center
                          justify-center

                          rounded-full

                          border-[2px]
                          border-black/15

                          bg-white

                          text-[26px]
                        "
                      >
                        {group.icon}
                      </div>

                      <div>
                        <div
                          className="
                            font-bold
                            text-[18px]
                          "
                        >
                          {group.title}
                        </div>

                        <div
  className="
    mt-2

    flex
    flex-wrap

    gap-2
  "
>
  {group.tags?.map(
    (tag, index) => (
      <div
        key={index}
        className="
          rounded-full

          bg-[#fce7f3]

          px-2
          py-[2px]

          text-[11px]
          text-[#db2777]

          border
          border-[#f9a8d4]
        "
      >
        {tag}
      </div>
    )
  )}
</div>

                        <div
                          className="
                            mt-2

                            text-[12px]
                            text-[#16a34a]
                          "
                        >
                          ● {group.online}
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        text-[34px]
                      "
                    >
                      ›
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupSearch;