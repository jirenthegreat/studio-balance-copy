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

/** Logotyp: znak spirali + „Studio Balance”. */
export default function Logo({ className = "", size = "md", showText = true }) {
  const text = { sm: "text-[0.95rem]", md: "text-[1.08rem]", lg: "text-[1.5rem]" }[size];
  const markSize = { sm: "h-5 w-5", md: "h-6 w-6", lg: "h-9 w-9" }[size];

  return (
    <span
      className={cn("inline-flex items-center gap-2 text-current", className)}
      aria-label="Studio Balance"
    >
      <SpiralMark className={markSize} strokeWidth={2.2} />
      {showText && (
        <span className={cn("font-medium tracking-[-0.03em]", text)}>
          Studio <span className="accent text-[1.12em]">Balance</span>
        </span>
      )}
    </span>
  );
}
