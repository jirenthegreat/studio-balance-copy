import { cn } from "@/lib/utils";

/** Znak studia: spirala yin-yang w okręgu. */
export function SpiralMark({ className = "", strokeWidth = 1.6 }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-6 w-6", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M32 3a29 29 0 0 1 0 58 14.5 14.5 0 0 1 0-29 14.5 14.5 0 0 0 0-29Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="32" cy="17.5" r="2.6" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="32" cy="46.5" r="2.6" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

/** Logotyp: znak + „Studio Balance” w ciasnym, bezszeryfowym kroju. */
export default function Logo({ className = "", size = "md", showText = true }) {
  const scale = {
    sm: "text-[0.9rem] gap-2",
    md: "text-[1rem] gap-2.5",
    lg: "text-[1.35rem] gap-3.5",
  }[size];

  const markSize = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium tracking-[-0.03em] text-current",
        scale,
        className
      )}
      aria-label="Studio Balance"
    >
      <SpiralMark className={markSize} strokeWidth={1.4} />
      {showText && <span>Studio Balance</span>}
    </span>
  );
}