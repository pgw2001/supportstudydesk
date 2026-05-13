import { useState } from "react";

import closedBook from "./bookclosed.svg";
import openedBook from "./bookopened.svg";

import Planner from "./Planner";

function PlannerButton() {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          w-full
          cursor-pointer
          border-none
          bg-transparent
          p-0
        "
      >
        <img
          src={hovered ? openedBook : closedBook}
          alt="planner"
          draggable={false}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="
            w-full
            select-none
            transition
            duration-300
            hover:scale-105
          "
        />
      </button>

      {open && (
        <Planner onClose={() => setOpen(false)} />
      )}
    </>
  );
}

export default PlannerButton;