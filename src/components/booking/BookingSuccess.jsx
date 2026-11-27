import { useEffect } from "react";
import { SpiralMark } from "@/components/site/Logo";

/** Znak spirali z delikatnym oddechem i krótkim confetti po udanej rezerwacji. */
export default function BookingSuccess() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    import("canvas-confetti")
      .then(({ default: confetti }) => {
        if (cancelled) return;
        confetti({
          particleCount: 40,
          spread: 62,
          startVelocity: 30,
          gravity: 0.7,
          scalar: 0.75,
          ticks: 160,
          origin: { y: 0.4 },
          colors: ["#B9788F", "#9DAA94", "#E8DCCB", "#2B2B2B"],
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span className="relative flex h-14 w-14 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full bg-leaf/15"
        aria-hidden="true"
      />
      <SpiralMark
        className="spiral-breath relative h-9 w-9 text-leaf"
        strokeWidth={1.2}
      />
    </span>
  );
}