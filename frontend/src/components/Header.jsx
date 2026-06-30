import { Link } from "react-router-dom";

/** App brand bar. `right` slot lets pages inject contextual actions. */
export function Header({ right }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card/60 px-5 py-3">
      <Link to="/" className="flex items-center gap-2.5">
        <img src="/logo.svg" alt="VectorShift" className="size-7 rounded-md" />
        <span className="text-base font-bold tracking-tight text-foreground">
          VectorShift
        </span>
        <span className="rounded-full border border-violet-500/30 bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-violet-300">
          Pipeline Builder
        </span>
      </Link>
      {right}
    </header>
  );
}
