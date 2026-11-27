import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Magnetyczne przyciąganie kursora do przycisku — tylko desktop, bez ruchu przy reduced-motion. */
export default function Magnetic({ children, strength = 12, className }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(
        "inline-block transition-transform duration-300 ease-out will-change-transform",
        className
      )}
    >
      {children}
    </span>
  );
}