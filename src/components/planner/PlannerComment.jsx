function PlannerComment({
  comment,
  setComment,
}) {
  return (
    <div className="mt-10">

      <h2 className="mb-3 text-2xl font-bold">
        Comment
      </h2>

      <textarea
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
        placeholder="오늘의 코멘트"
        className="
          h-[130px]
          w-full
          resize-none
          rounded-2xl
          border
          border-neutral-300
          bg-white/60
          p-4
          outline-none
        "
      />

    </div>
  );
}

export default PlannerComment;