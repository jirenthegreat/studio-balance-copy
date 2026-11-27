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

/** Logotyp poziomy: STUDIO ⟡ BALANCE z szerokim rozstrzeleniem. */
export default function Logo({ className = "", size = "md", showText = true }) {
  const scale = {
    sm: "text-[0.6rem] gap-2",
    md: "text-[0.68rem] gap-2.5",
    lg: "text-[0.95rem] gap-4",
  }[size];

  const markSize = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-8 w-8" }[size];

  return (
    <span
      className={cn("inline-flex items-center text-current", scale, className)}
      aria-label="Studio Balance"
    >
      {showText && (
        <span className="font-light uppercase tracking-[0.36em]">Studio</span>
      )}
      <SpiralMark className={markSize} />
      {showText && (
        <span className="font-light uppercase tracking-[0.36em]">Balance</span>
      )}
    </span>
  );
}