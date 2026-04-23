function Header() {
  return (
    <header className="flex items-start justify-between gap-4 pb-4">
      <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
        Support Study Desk
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="chat shortcut"
          className="grid h-11 w-11 place-items-center rounded-full border border-neutral-900 bg-blue-500 text-lg text-white shadow-[0_6px_16px_rgba(59,130,246,0.35)]"
        >
          •
        </button>
        <button
          type="button"
          aria-label="open menu"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full border border-neutral-900 bg-white text-neutral-900"
        >
          <span className="h-0.5 w-5 bg-current" />
          <span className="h-0.5 w-5 bg-current" />
          <span className="h-0.5 w-5 bg-current" />
        </button>
      </div>
    </header>
  );
}

export default Header;
