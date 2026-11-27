import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Nagłówek sekcji. Tytuł może zawierać „|” — każdy fragment to osobna linia,
 * odsłaniana maską (mask reveal) po wejściu w widok.
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
        <p
          className={cn(
            "overline mb-5 flex items-center gap-3",
            centered && "justify-center",
            light ? "text-sand/85" : "text-rose"
          )}
        >
          <span
            className={cn("h-px w-7", light ? "bg-sand/50" : "bg-rose/50")}
            aria-hidden="true"
          />
          {overline}
        </p>
      )}
      <h2
        ref={ref}
        className={cn(
          "mask-lines text-[2.15rem] leading-[1.08] tracking-[-0.01em] sm:text-[2.6rem] md:text-[3.2rem]",
          shown && "is-visible",
          light ? "text-bone" : "text-graphite"
        )}
      >
        {lines.map((line, i) => (
          <span key={`${line}-${i}`} className="mask-line">
            <span style={{ transitionDelay: `${i * 110}ms` }}>{line}</span>
          </span>
        ))}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-6 text-[1rem] leading-[1.75] md:text-[1.06rem]",
            light ? "text-bone/75" : "text-graphite/65"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}