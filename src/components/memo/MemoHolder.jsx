import holderSvg from "../../assets/memoholder.svg";

function MemoHolder({ onCreate }) {
  return (
    <div
      onMouseDown={onCreate}
      //className="border-4 border-red-500"
    >
      <img
        src={holderSvg}
        alt="holder"
        className="w-[200px] h-[200px]"
      />
    </div>
  );
}

export default MemoHolder;
