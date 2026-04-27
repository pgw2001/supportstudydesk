import { useState, useEffect } from "react";

function Memo() {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("memo");
    if(saved) setText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("memo", text);
  }, [text]);

  return (
    <section className="w-[120px] rounded-sm border-2 border-[#987a00] bg-[#ffd93b] p-3 text-[11px] leading-4 text-neutral-900 shadow-[3px_3px_0_rgba(0,0,0,0.18)]">
      <textarea
        value = {text}
        onChange = {(e) => setText(e.target.value)}
        className = "w-full h-[120px] resize-none bg-transparent outline-none"
        />
      {/* <p>Today</p>
      <p className="mt-2">- layout scene</p>
      <p>- desk widgets</p>
      <p>- drag later</p> */}
    </section>
  );
}

export default Memo;
