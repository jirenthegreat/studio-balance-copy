import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Users, Sparkles, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import Magnetic from "./Magnetic";
import { IMG, CONTACT } from "@/lib/images";

const FEATURES = [
  { icon: Users, label: "Maks. 4 osoby w grupie" },
  { icon: Sparkles, label: "Indywidualne podejście" },
  { icon: MapPin, label: "Prestiżowa lokalizacja" },
];

export default function Hero() {
  const photoRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const offset = Math.min(window.scrollY, window.innerHeight);
        if (photoRef.current) {
          photoRef.current.style.transform = `translate3d(0, ${offset * 0.12}px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-graphite">
      <div ref={photoRef} className="absolute inset-0 will-change-transform">
        <Image
          src={IMG.hero}
          alt="Sala treningowa Studio Balance z dużymi oknami i widokiem na zieleń"
          className="photo-warm kenburns h-full w-full"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-graphite/80 via-graphite/25 to-graphite/90"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-36 md:px-10 md:pb-16">
        <p className="overline flex items-center gap-3 text-bone/70">
          <span className="h-px w-7 bg-bone/40" aria-hidden="true" />
          {CONTACT.place} · Lublin
        </p>
        <h1 className="mt-6 max-w-[15ch] text-[clamp(2.9rem,8.6vw,7.6rem)] leading-[0.9] tracking-[-0.03em] text-bone">
          Znajdź swoją{" "}
          <span className="font-light italic text-sand">równowagę</span>.
        </h1>
        <p className="mt-7 max-w-lg text-[1rem] leading-[1.7] text-bone/80 md:text-[1.1rem]">
          Treningi personalne i zajęcia w kameralnych grupach do 4 osób,
          w Unia Art Residence w Lublinie.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <Link
              to="/grafik"
              className="btn btn-primary w-full bg-bone text-graphite hover:bg-sand sm:w-auto"
            >
              Zarezerwuj zajęcia
            </Link>
          </Magnetic>
          <Magnetic>
            <Link to="/trening-personalny" className="btn btn-light w-full sm:w-auto">
              Trening personalny
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="relative border-t border-bone/15 bg-graphite/35 backdrop-blur-sm">
        <ul className="mx-auto grid max-w-6xl gap-px px-5 sm:grid-cols-3 md:px-10">
          {FEATURES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 border-b border-bone/10 py-5 text-bone/85 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
            >
              <Icon className="h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
              <span className="text-[0.72rem] uppercase tracking-[0.16em]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}