import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Accent from "./Accent";

/**
 * Nagłówek sekcji. Tytuł może zawierać „|” — każdy fragment to osobna linia,
 * odsłaniana maską po wejściu w widok. Fragmenty w *gwiazdkach* dostają
 * szeryfową kursywę.
 */
export default function SectionHeading({
  overline,
  title,
  intro,
  align = "left",
  light = false,
  className,
}) {
  const centered = align === "center";
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lines = (Array.isArray(title) ? title : String(title || "").split("|"))
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div
      className={cn(
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {overline && (
        <p className={cn("overline mb-6", centered && "justify-center")}>
          {overline}
        </p>
      )}
      <h2
        ref={ref}
        className={cn(
          "mask-lines text-[clamp(2.05rem,4.4vw,3.4rem)] font-medium leading-[1.03] tracking-[-0.03em]",
          shown && "is-visible",
          light ? "text-canvas" : "text-ink"
        )}
      >
        {lines.map((line, i) => (
          <span key={`${line}-${i}`} className="mask-line">
            <span style={{ transitionDelay: `${i * 110}ms` }}>
              <Accent text={line} />
            </span>
          </span>
        ))}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-6 max-w-xl text-[1rem] leading-[1.75]",
            light ? "text-canvas/70" : "text-ink/55"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}