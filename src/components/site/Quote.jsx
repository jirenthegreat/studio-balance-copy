import { useEffect, useRef, useState } from "react";

const TEXT =
  "Trening ma być dopasowany do Ciebie, a nie Ty do treningu. Dlatego w grupie są najwyżej cztery osoby i widzę każdy ruch.";

/** Cytat, którego słowa „zapalają się” w miarę przewijania. */
export default function Quote() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(1);
  const words = TEXT.split(" ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setProgress(0);
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.85 - rect.top) / (rect.height + vh * 0.35);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const lit = Math.round(progress * words.length);

  return (
    <section className="py-28 md:py-40">
      <figure ref={ref} className="mx-auto max-w-4xl px-5 text-center md:px-10">
        <blockquote className="text-[clamp(1.7rem,3.6vw,2.9rem)] font-medium leading-[1.2] tracking-[-0.035em]">
          {words.map((word, i) => (
            <span
              key={i}
              className="transition-colors duration-500"
              style={{ color: i < lit ? "#2B1D1A" : "rgba(43,29,26,0.2)" }}
            >
              {word === "Ciebie," ? <em className="accent">{word}</em> : word}{" "}
            </span>
          ))}
        </blockquote>
        <figcaption className="mt-8 text-[0.95rem] text-graphite/55">
          Paula Kruszyńska, założycielka studia
        </figcaption>
      </figure>
    </section>
  );
}
