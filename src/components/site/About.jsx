import { Image } from "@/components/ui/image";
import { SpiralMark } from "./Logo";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { IMG } from "@/lib/images";

const POINTS = [
  {
    title: "Cztery osoby, nie czterdzieści",
    text: "Kameralna grupa pozwala dobrać obciążenie do poziomu każdej osoby — i realnie podnosić poprzeczkę.",
  },
  {
    title: "Uważny ruch",
    text: "Pracujemy wolniej, ale precyzyjnie — z oddechem i bez pośpiechu.",
  },
  {
    title: "Zieleń za oknem",
    text: "Cicha przestrzeń z widokiem na korony drzew, w sercu Unia Art Residence.",
  },
];

export default function About() {
  return (
    <section id="o-studiu" className="relative overflow-hidden py-24 md:py-32">
      <SpiralMark
        className="pointer-events-none absolute -right-24 top-10 h-[26rem] w-[26rem] text-graphite/[0.04] md:-right-10 md:h-[34rem] md:w-[34rem]"
        strokeWidth={0.7}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-10">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-t-[10rem] rounded-b-[1.5rem]">
            <Image
              src={IMG.room}
              alt="Wnętrze studia: lustro, maty i sprzęt do ćwiczeń przy jasnych ścianach"
              className="photo-warm aspect-[4/5] w-full"
            />
          </div>
          <div className="absolute -bottom-5 right-4 hidden bg-bone px-6 py-4 text-[0.68rem] uppercase tracking-[0.22em] text-graphite/70 shadow-sm sm:block">
            Unia Art Residence · Lublin
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            overline="O studiu"
            title="Trening, który nie krzyczy."
            intro="Studio Balance powstało z przekonania, że trening nie musi być karą. To przestrzeń, w której ciało i głowa pracują w tym samym rytmie — bez liczenia kalorii na tablicy, bez tłumu, bez pośpiechu."
          />
          <div className="mt-8 space-y-6 text-[0.98rem] leading-[1.8] text-graphite/70">
            <p>
              Zajęcia prowadzimy w grupach do czterech osób, więc trenerka widzi
              każdy ruch – niezależnie od tego, czy dopiero zaczynasz, czy
              trenujesz od lat.
            </p>
            <p>
              Duże okna, matowa podłoga i zieleń za szybą. Po godzinie tutaj
              wychodzi się spokojniejszym, nie zmęczonym.
            </p>
          </div>

          <ul className="mt-10 space-y-5">
            {POINTS.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="mt-2 h-px w-6 shrink-0 bg-rose/60" aria-hidden="true" />
                <div>
                  <p className="text-[0.82rem] uppercase tracking-[0.14em] text-graphite">
                    {point.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-graphite/60">
                    {point.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}