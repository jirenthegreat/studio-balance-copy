import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** „*słowo*” w tytule renderuje się szeryfową kursywą. */
export function withAccent(text) {
  return String(text)
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <em key={i}>{part.slice(1, -1)}</em>
      ) : (
        part
      )
    );
}

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
            "eyebrow mb-5",
            centered && "mx-auto",
            light ? "bg-linen/15 text-linen" : "text-graphite/70"
          )}
        >
          {overline}
        </p>
      )}
      <h2
        ref={ref}
        className={cn(
          "mask-lines text-[2.3rem] leading-[1.02] sm:text-[2.9rem] md:text-[3.6rem]",
          shown && "is-visible",
          light ? "text-linen" : "text-graphite"
        )}
      >
        {lines.map((line, i) => (
          <span key={`${line}-${i}`} className="mask-line">
            <span style={{ transitionDelay: `${i * 110}ms` }}>{withAccent(line)}</span>
          </span>
        ))}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-6 text-[1rem] leading-[1.75] md:text-[1.06rem]",
            light ? "text-linen/75" : "text-graphite/65"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}