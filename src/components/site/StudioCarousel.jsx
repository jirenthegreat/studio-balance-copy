import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { IMG } from "@/lib/images";

const SLIDES = [
  { id: "sala", image: IMG.hero, title: "Sala", note: "zieleń za oknem" },
  { id: "przestrzen", image: IMG.room, title: "Przestrzeń", note: "spokojnie i bez tłumu" },
  { id: "spinning", image: IMG.bikes, title: "Spinning", note: "rowery czekają" },
  { id: "mata", image: IMG.pilatesClass, title: "Na macie", note: "oddech i precyzja" },
  { id: "grupa", image: IMG.pilatesGroup, title: "W grupie", note: "maks. 4 osoby" },
];

export default function StudioCarousel() {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  const onPointerDown = (event) => {
    const track = trackRef.current;
    if (!track || event.pointerType === "touch") return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startLeft: track.scrollLeft,
    };
    track.style.scrollSnapType = "none";
    track.style.cursor = "grabbing";
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    track.scrollLeft = drag.current.startLeft - (event.clientX - drag.current.startX);
  };

  const endDrag = () => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    drag.current.active = false;
    track.style.scrollSnapType = "";
    track.style.cursor = "";
  };

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const step = card ? card.offsetWidth + 20 : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section id="studio" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              overline="Studio"
              title="Miejsce, w którym *zwalniasz*."
            />
          </Reveal>
          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Poprzednie zdjęcie"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink/60 transition-colors hover:text-ink"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Następne zdjęcie"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink/60 transition-colors hover:text-ink"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          className="no-scrollbar -mx-5 mt-12 flex cursor-grab select-none snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:-mx-10 md:px-10"
        >
          {SLIDES.map((slide) => (
            <figure
              key={slide.id}
              data-card
              className="group w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
            >
              <div className="overflow-hidden rounded-[24px] bg-clay">
                <Image
                  src={slide.image}
                  alt={`${slide.title} — Studio Balance`}
                  draggable={false}
                  className="photo-warm aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-4 px-1">
                <p className="text-[1.05rem] font-medium tracking-[-0.02em] text-ink">
                  {slide.title}
                </p>
                <p className="font-hand mt-0.5 text-[1.25rem] leading-tight text-ink/50">
                  {slide.note}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-4 text-[0.78rem] text-ink/40 md:hidden">
          Przewiń palcem, aby zobaczyć więcej
        </p>
      </div>
    </section>
  );
}