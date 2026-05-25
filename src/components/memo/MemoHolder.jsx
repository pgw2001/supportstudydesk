import holderSvg from "../../assets/memoholder.svg";

function MemoHolder({ onStart }) {
  const handleClick = (e) => {
    e.preventDefault?.();
    onStart?.(e);
  };

  return (
    <div
      onClick={handleClick}
      data-no-drag="true"
      style={{ touchAction: "none", cursor: "pointer", zIndex: 10002, position: "relative" }}
      className="w-[150px] h-[150px]"
    >
      <img
        src={holderSvg}
        alt="holder"
        className="w-full h-full"
        draggable={false}
      />
    </div>
  );
}

export default MemoHolder;