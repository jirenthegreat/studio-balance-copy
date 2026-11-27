import { useEffect, useRef, useState } from "react";

const ITEMS = [
  { value: 4, prefix: "maks. ", suffix: "", label: "osoby w grupie" },
  { value: 100, prefix: "", suffix: "%", label: "poleca Studio Balance" },
  { value: 60, prefix: "", suffix: " min", label: "trwania zajęć" },
];

export default function Stats() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setProgress(1);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        if (reduce) {
          setProgress(1);
          return;
        }
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / 1400);
          setProgress(1 - Math.pow(1 - p, 3));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-clay py-14 md:py-20">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-3 md:px-10"
      >
        {ITEMS.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-[2.7rem] font-medium leading-none tracking-[-0.04em] text-ink md:text-[3.5rem]">
              <span className="text-[0.9rem] text-ink/45">{item.prefix}</span>
              {Math.round(item.value * progress)}
              <span className="text-[1.3rem] text-ink/50">{item.suffix}</span>
            </p>
            <p className="mt-3 text-[0.84rem] text-ink/50">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}