export function ThemeToggler() {
  return (
    <button>
      <svg height={22} viewBox="0 0 42 22">
        <rect
          x={0}
          y={0}
          width={42}
          height={22}
          rx={12}
          className="fill-neutral-700"
        ></rect>
        <path d="M 4 4 l 14 0 l 0 14 l -14 0 z" className="fill-white" />
      </svg>
    </button>
  );
}
