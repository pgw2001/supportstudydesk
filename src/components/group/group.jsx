import GroupCreate from "./groupCreate";
import GroupSearch from "./groupSearch";
import GroupRoom from "./groupRoom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../services/firebase";

import rough from "roughjs/bundled/rough.esm";

function Group({
  setIsGroupOpen,
}) {
  const [page, setPage] =
    useState("main");

  const [groups, setGroups] =
    useState([]);

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState(null);

  const paperSvgRef =
    useRef(null);

  const searchSvgRef =
    useRef(null);

  const createSvgRef =
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

    if (searchSvgRef.current) {
      searchSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        searchSvgRef.current
      );

      searchSvgRef.current.appendChild(
        rc.rectangle(
          4,
          4,
          472,
          84,
          {
            stroke: "#111",

            strokeWidth: 2.5,

            roughness: 1.7,

            bowing: 1.3,

            fill: "#fce7f3",

            fillStyle:
              "hachure",

            hachureGap: 7,

            fillWeight: 1,

            seed: 21,
          }
        )
      );
    }

    if (createSvgRef.current) {
      createSvgRef.current.innerHTML =
        "";

      const rc = rough.svg(
        createSvgRef.current
      );

      createSvgRef.current.appendChild(
        rc.rectangle(
          4,
          4,
          472,
          84,
          {
            stroke: "#111",

            strokeWidth: 2.5,

            roughness: 1.7,

            bowing: 1.3,

            fill: "#ffe6ad",

            fillStyle:
              "hachure",

            hachureGap: 7,

            fillWeight: 1,

            seed: 31,
          }
        )
      );
    }
  }, [page]);

useEffect(() => {
  const unsubscribe =
    onSnapshot(
      collection(
        db,
        "groups"
      ),
      (snapshot) => {
        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setGroups(data);
      }
    );

  return () =>
    unsubscribe();
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

          overflow-visible
        "
      >
        {/* rough paper */}
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
          {/* close */}
          <button
            onClick={() =>
              setIsGroupOpen(false)
            }
            className="
              absolute
              right-[20px]
              top-[14px]

              text-[30px]
              text-black/70

              transition-all

              hover:scale-110
              hover:text-black
            "
          >
            ×
          </button>

          {/* scroll area */}
          <div
            className="
              flex-1

              overflow-y-auto

              pr-2
            "
          >
            {/* MAIN */}
            {page === "main" && (
              <>
                {/* title */}
                <div
                  className="
                    text-center
                  "
                >
                  <h1
                    className="
                      font-['Patrick_Hand']
                      text-[42px]
                      leading-none
                    "
                  >
                    Study Group
                  </h1>

                  <div
                    className="
                      mt-4

                      text-[18px]
                      text-black/65
                    "
                  >
                    같이 공부하고,
                    더 멀리 가자!
                  </div>

                  <div
                    className="
                      mx-auto
                      mt-3

                      h-[3px]
                      w-[180px]

                      rounded-full

                      bg-[#ff8a80]
                    "
                  />
                </div>

                {/* actions */}
                <div
                  className="
                    mt-8

                    flex
                    flex-col

                    gap-4
                  "
                >
                  {/* search */}
                  <button
                    onClick={() =>
                      setPage("search")
                    }
                    className="
                      relative

                      h-[92px]
                      w-full

                      overflow-visible

                      transition-all

                      hover:-rotate-[0.5deg]
                      hover:scale-[1.01]
                    "
                  >
                    <svg
                      ref={searchSvgRef}
                      className="
                        absolute
                        inset-0

                        z-0

                        h-full
                        w-full

                        overflow-visible

                        pointer-events-none
                      "
                      viewBox="0 0 480 92"
                    />

                    <div
                      className="
                        relative
                        z-10

                        flex
                        h-full
                        items-center
                        justify-between

                        px-7
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-5
                        "
                      >
                        <div
                          className="
                            flex
                            h-[54px]
                            w-[54px]

                            items-center
                            justify-center

                            rounded-full

                            bg-[#fbcfe8]

                            text-[30px]
                          "
                        >
                          🔍
                        </div>

                        <div className="text-left">
                          <div
                            className="
                              font-['Patrick_Hand']
                              text-[28px]
                            "
                          >
                            그룹 검색
                          </div>

                          <div
                            className="
                              text-[13px]
                              text-black/55
                            "
                          >
                            관심 있는 그룹을
                            찾아보세요!
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
                    </div>
                  </button>

                  {/* create */}
                  <button
                    onClick={() =>
                      setPage("create")
                    }
                    className="
                      relative

                      h-[92px]
                      w-full

                      transition-all

                      hover:rotate-[0.5deg]
                      hover:scale-[1.01]
                    "
                  >
                    <svg
                      ref={createSvgRef}
                      className="
                        absolute
                        inset-0

                        h-full
                        w-full

                        pointer-events-none
                      "
                      viewBox="0 0 480 92"
                    />

                    <div
                      className="
                        relative
                        z-10

                        flex
                        h-full
                        items-center
                        justify-between

                        px-7
                      "
                    >
                        <div
                          className="
                            flex
                            items-center
                            gap-5
                          "
                        >
                          <div
                            className="
                              flex
                              h-[54px]
                              w-[54px]

                              items-center
                              justify-center

                              rounded-full

                              bg-[#fff1b8]

                              text-[30px]
                            "
                          >
                            ✏️
                          </div>

                          <div className="text-left">
                            <div
                              className="
                                font-['Patrick_Hand']
                                text-[28px]
                              "
                            >
                              그룹 만들기
                            </div>

                            <div
                              className="
                                text-[13px]
                                text-black/55
                              "
                            >
                              새로운 스터디 그룹을
                              만들어보세요!
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
                    </div>
                  </button>
                </div>

                {/* divider */}
                <div
                  className="
                    my-5

                    border-t-[2px]
                    border-dashed
                    border-black/35
                  "
                />

                {/* top bar */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div
                    className="
                      font-['Patrick_Hand']
                      text-[28px]
                    "
                  >
                    최근 참여한 그룹
                  </div>

                  <div
                    className="
                      rounded-full

                      border-[2px]
                      border-black

                      bg-[#e5e7eb]

                      px-3
                      py-[3px]

                      text-[12px]
                      font-bold
                    "
                  >
                    최근 공부 중
                  </div>
                </div>

                {/* group list */}
                <div
                  className="
                    mt-4

                    flex
                    flex-col

                    gap-2

                    pb-6
                  "
                >
                  {groups.map(
                    (group) => (
                      <button
                        key={group.id}

                        onClick={() => {
                          setSelectedGroup(
                            group
                          );

                          setPage(
                            "room"
                          );
                        }}

                        className="
                          flex
                          items-center
                          justify-between

                          rounded-[18px]

                          border-[2px]
                          border-black

                          bg-white

                          px-4
                          py-2

                          transition-all

                          hover:-rotate-[0.3deg]
                          hover:bg-[#fffdf7]
                        "
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
                              h-[42px]
                              w-[42px]

                              items-center
                              justify-center

                              rounded-full

                              border-[2px]
                              border-black/15

                              bg-white

                              text-[22px]
                            "
                          >
                            {
                              group.icon
                            }
                          </div>

                          <div>
                            <div
                              className="
                                font-bold
                                text-[17px]
                              "
                            >
                              {
                                group.title
                              }
                            </div>

                            <div
                              className="
                                text-[12px]
                                text-black/55
                              "
                            >
                              {
                                group.desc
                              }
                            </div>

                            <div
                              className="
                                mt-[3px]

                                flex
                                gap-2

                                text-[11px]
                              "
                            >
                              {group.tags?.map(
                                (
                                  tag,
                                  index
                                ) => (
                                  <span
                                    key={
                                      index
                                    }
                                    className="
                                      text-[#ec4899]
                                    "
                                  >
                                    {tag}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className="
                            text-right
                          "
                        >
                          <div
                            className="
                              rounded-full

                              bg-[#dcfce7]

                              px-3
                              py-[1px]

                              text-[12px]
                              font-bold
                              text-[#15803d]
                            "
                          >
                            1명
                          </div>

                          <div
                            className="
                              mt-[2px]

                              text-[11px]
                              text-[#16a34a]
                            "
                          >
                            ● 온라인
                          </div>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </>
            )}

            {/* CREATE */}
            {page === "create" && (
              <GroupCreate
                setPage={setPage}
                setIsGroupOpen={
                  setIsGroupOpen
                }
              />
            )}

            {/* SEARCH */}
            {page === "search" && (
              <GroupSearch
                setPage={setPage}
                setSelectedGroup={
                  setSelectedGroup
                }
                setIsGroupOpen={
                  setIsGroupOpen
                }
              />
            )}

            {/* ROOM */}
            {page === "room" && (
              <GroupRoom
                group={selectedGroup}
                setPage={setPage}
                setIsGroupOpen={
                  setIsGroupOpen
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Group;