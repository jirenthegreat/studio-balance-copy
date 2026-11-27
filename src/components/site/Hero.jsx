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
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-canvas">
      <div ref={photoRef} className="absolute inset-0 will-change-transform">
        <Image
          src={IMG.hero}
          alt="Sala treningowa Studio Balance z dużymi oknami i widokiem na zieleń"
          className="photo-warm kenburns h-full w-full"
        />
      </div>

      <div
        className="absolute inset-0 bg-[linear-gradient(to_top,#F4EEE8_6%,rgba(244,238,232,0.88)_46%,rgba(244,238,232,0.22)_100%)] md:hidden"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-[linear-gradient(to_right,#F4EEE8_0%,#F4EEE8_34%,rgba(244,238,232,0.86)_55%,rgba(244,238,232,0)_100%)] md:block"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-canvas to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-36 md:px-10 md:pb-20">
        <p className="overline">{CONTACT.place} · Lublin</p>
        <h1 className="mt-7 max-w-[15ch] text-[clamp(2.7rem,7vw,6rem)] font-medium leading-[0.95] tracking-[-0.035em] text-ink">
          Znajdź swoją <em className="site-accent">równowagę</em>.
        </h1>
        <p className="mt-7 max-w-md text-[1rem] leading-[1.75] text-ink/60 md:text-[1.05rem]">
          Treningi personalne i zajęcia w kameralnych grupach do 4 osób,
          w Unia Art Residence w Lublinie.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <Link to="/grafik" className="btn btn-primary w-full sm:w-auto">
              Zarezerwuj zajęcia
            </Link>
          </Magnetic>
          <Magnetic>
            <Link to="/trening-personalny" className="btn btn-outline w-full sm:w-auto">
              Trening personalny
            </Link>
          </Magnetic>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
          {FEATURES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 text-[0.84rem] text-ink/55"
            >
              <Icon className="h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}