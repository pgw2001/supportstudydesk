
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const STYLEBAR_SEED = 9999;

function StyleBar({
  isOpen,
  selectedStyle,
  setSelectedStyle,
  setIsStyleOpen,
}) {
  const svgRef = useRef(null);

  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState(0);

  const categories = [
    "All",
    "Clock",
    "TodoList",
    "Music",
    "Plant",
    "Display",
  ];

  const styleData = [
    { id: 1, type: "Clock" },
    { id: 2, type: "Clock" },
    { id: 3, type: "Clock" },
    { id: 4, type: "TodoList" },
    { id: 5, type: "TodoList" },
    { id: 6, type: "Music" },
    { id: 7, type: "Music" },
  ];

  const filtered =
    category === "All"
      ? styleData
      : styleData.filter((item) => item.type === category);

  const move = (dir) => {
    if (dir === "left") {
      setIndex((prev) => Math.max(prev - 1, 0));
    } else {
      setIndex((prev) => Math.min(prev + 1, filtered.length - 4));
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    svgRef.current.innerHTML = "";

    const svg = svgRef.current;

    const rc = rough.svg(svg);

    // ===== 배경 =====
    const background = rc.rectangle(10, 10, 1180, 240, {
      fill: "#f8f6f1",
      fillStyle: "solid",
      stroke: "#111",
      strokeWidth: 2,
      roughness: 1.5,
      bowing: 1,
      seed: STYLEBAR_SEED,
    });

    svg.appendChild(background);

    // ===== 제목 =====
    const title = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    title.setAttribute("x", "40");
    title.setAttribute("y", "42");
    title.setAttribute(
      "style",
      `
      font-family: 'Comic Sans MS', cursive;
      font-size: 22px;
      font-weight: bold;
      fill: #111;
    `
    );

    title.textContent = "STYLE BAR";

    svg.appendChild(title);

    // ===== 닫기 버튼 =====
    const closeText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    closeText.setAttribute("x", "1140");
    closeText.setAttribute("y", "42");
    closeText.setAttribute(
      "style",
      `
      font-family: 'Comic Sans MS', cursive;
      font-size: 28px;
      font-weight: bold;
      fill: #111;
      cursor:pointer;
    `
    );

    closeText.textContent = "×";

    closeText.onpointerdown = () => {
      setIsStyleOpen(false);
    };

    svg.appendChild(closeText);

    // ===== 카테고리 =====
    categories.forEach((tab, idx) => {
      const x = 40 + idx * 120;
      const y = 60;

      const selected = category === tab;

      const button = rc.rectangle(x, y, 100, 36, {
        fill: selected ? "#d84c3f" : "#ffffff",
        fillStyle: "solid",
        stroke: "#111",
        strokeWidth: 2,
        roughness: 1.2,
        bowing: 1,
        seed: STYLEBAR_SEED + idx,
      });

      svg.appendChild(button);

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

      text.setAttribute("x", x + 50);
      text.setAttribute("y", y + 23);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute(
        "style",
        `
        font-family: 'Comic Sans MS', cursive;
        font-size: 14px;
        fill: ${selected ? "white" : "#111"};
        pointer-events:none;
      `
      );

      text.textContent = tab;

      svg.appendChild(text);

      const hitbox = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      hitbox.setAttribute("x", x);
      hitbox.setAttribute("y", y);
      hitbox.setAttribute("width", 100);
      hitbox.setAttribute("height", 36);
      hitbox.setAttribute("fill", "transparent");

      hitbox.style.cursor = "pointer";

      hitbox.onpointerdown = () => {
        setCategory(tab);
        setIndex(0);
      };

      svg.appendChild(hitbox);
    });

    // ===== 카드 영역 =====
    const frame = rc.rectangle(40, 120, 1120, 100, {
      stroke: "#777",
      strokeWidth: 1.5,
      roughness: 1.2,
      bowing: 1,
      fill: "transparent",
      seed: STYLEBAR_SEED + 100,
    });

    svg.appendChild(frame);

    // ===== 화살표 =====
    const leftCircle = rc.circle(70, 170, 36, {
      stroke: "#111",
      strokeWidth: 2,
      roughness: 1,
      fill: "#fff",
      fillStyle: "solid",
      seed: STYLEBAR_SEED + 200,
    });

    svg.appendChild(leftCircle);

    const leftArrow = rc.line(76, 160, 64, 170, {
      strokeWidth: 2,
      seed: STYLEBAR_SEED + 201,
    });

    const leftArrow2 = rc.line(64, 170, 76, 180, {
      strokeWidth: 2,
      seed: STYLEBAR_SEED + 202,
    });

    svg.appendChild(leftArrow);
    svg.appendChild(leftArrow2);

    const rightCircle = rc.circle(1130, 170, 36, {
      stroke: "#111",
      strokeWidth: 2,
      roughness: 1,
      fill: "#fff",
      fillStyle: "solid",
      seed: STYLEBAR_SEED + 300,
    });

    svg.appendChild(rightCircle);

    const rightArrow = rc.line(1124, 160, 1136, 170, {
      strokeWidth: 2,
      seed: STYLEBAR_SEED + 301,
    });

    const rightArrow2 = rc.line(1136, 170, 1124, 180, {
      strokeWidth: 2,
      seed: STYLEBAR_SEED + 302,
    });

    svg.appendChild(rightArrow);
    svg.appendChild(rightArrow2);

    // ===== 카드 =====
    filtered.slice(index, index + 4).forEach((style, idx) => {
      const x = 140 + idx * 220;
      const y = 135;

      const active = selectedStyle === style.id;

      const card = rc.rectangle(x, y, 140, 70, {
        fill: active ? "#f8d7d3" : "#fff",
        fillStyle: "solid",
        stroke: active ? "#d84c3f" : "#111",
        strokeWidth: active ? 3 : 2,
        roughness: 1.5,
        bowing: 1,
        seed: STYLEBAR_SEED + style.id,
      });

      svg.appendChild(card);

      // ===== 미니 프리뷰 =====
      const mini = rc.rectangle(x + 40, y + 12, 60, 40, {
        stroke: "#111",
        strokeWidth: 1.5,
        roughness: 1,
        bowing: 1,
        fill: "#fff",
        fillStyle: "solid",
        seed: STYLEBAR_SEED + style.id + 500,
      });

      svg.appendChild(mini);

      const line1 = rc.line(x + 45, y + 24, x + 95, y + 24, {
        strokeWidth: 1,
        seed: STYLEBAR_SEED + style.id + 600,
      });

      svg.appendChild(line1);

      const line2 = rc.line(x + 45, y + 32, x + 95, y + 32, {
        strokeWidth: 1,
        seed: STYLEBAR_SEED + style.id + 601,
      });

      svg.appendChild(line2);

      const line3 = rc.line(x + 45, y + 40, x + 95, y + 40, {
        strokeWidth: 1,
        seed: STYLEBAR_SEED + style.id + 602,
      });

      svg.appendChild(line3);

      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

      label.setAttribute("x", x + 70);
      label.setAttribute("y", y + 92);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute(
        "style",
        `
        font-family:'Comic Sans MS', cursive;
        font-size:14px;
        fill:#111;
      `
      );

      label.textContent = `STYLE ${style.id}`;

      svg.appendChild(label);

      const hitbox = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      hitbox.setAttribute("x", x);
      hitbox.setAttribute("y", y);
      hitbox.setAttribute("width", 140);
      hitbox.setAttribute("height", 70);
      hitbox.setAttribute("fill", "transparent");

      hitbox.style.cursor = "pointer";

      hitbox.onpointerdown = () => {
        setSelectedStyle(style.id);
      };

      svg.appendChild(hitbox);
    });

    // ===== 화살표 클릭 =====
    const leftHit = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    leftHit.setAttribute("cx", 70);
    leftHit.setAttribute("cy", 170);
    leftHit.setAttribute("r", 20);
    leftHit.setAttribute("fill", "transparent");

    leftHit.style.cursor = "pointer";

    leftHit.onpointerdown = () => move("left");

    svg.appendChild(leftHit);

    const rightHit = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    rightHit.setAttribute("cx", 1130);
    rightHit.setAttribute("cy", 170);
    rightHit.setAttribute("r", 20);
    rightHit.setAttribute("fill", "transparent");

    rightHit.style.cursor = "pointer";

    rightHit.onpointerdown = () => move("right");

    svg.appendChild(rightHit);
  }, [category, filtered, index, selectedStyle]);

  return (
    <div
      className={`
        fixed left-0 bottom-0
        w-full h-[260px]
        z-[999]
        transition-transform duration-300
        ${isOpen ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
      />
    </div>
  );
}

export default StyleBar;

