import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { CONTACT } from "@/lib/images";

// Prawdziwe opinie z profilu Google studia — używane, gdy baza jest pusta.
export const GOOGLE_REVIEWS = [
  { id: "r1", author: "Jan W.", text: "Paula to wspaniały trener personalny. Z uśmiechem i energią prowadzi każde zajęcia. Ma bardzo indywidualne podejście do klienta. Miejsce w centrum Lublina, z fajnym widokiem. Profesjonalnie, miło, ludzko! Polecam!" },
  { id: "r2", author: "Kuba M.", text: "Trening przemyślany pod kątem celu, fizjologii i motoryki. Ćwiczenia zróżnicowane, intensywne z dużą uważnością na ułożenie ciała. Pani Paula jest profesjonalistką pod każdym względem, w pełni polecam!" },
  { id: "r3", author: "Katarzyna P.", text: "Cudowne, przyjazne miejsce. Tak treningi w grupie jak i indywidualne spotkania. Guru tego miejsca, Paula oraz wszyscy pozostali trenerzy poprowadzą przez pot i łzy do sukcesu. Miejsce do którego się tęskni i wraca. Polecam" },
  { id: "r4", author: "Ewelina A.", text: "Miejsce pełne siły, mocy i wylanego potu ale też spokoju, wyciszenia i relaksu. Super trenerzy motywują do pokonywania własnych barier a właścicielka to taka wisienka na torcie 😊 Polecam to miejsce bez żadnych oporów 💪❤️" },
  { id: "r5", author: "P. G.", text: "Studio Balance to moje miejsce. Cudowna trenerka, niezwykła kobieta i wspaniały człowiek. Nikt mnie nigdy nie zmotywował do ćwiczeń tak jak ona. Kształtuje ciało, ale przy okazji i ducha :) polecam" },
  { id: "r6", author: "Iwona N.", text: "Serdecznie polecam Studio Balance. Spining z Paulą najlepszy!!! A jeżdżę już bardzo długo. Miejsce klimatyczne, zajęcia prowadzone profesjonalnie." },
  { id: "r7", author: "Mateusz W.", text: "Świetne miejsce prowadzone z pasją i zamiłowaniem do sportu. Głównie polecam zajęcia indoor cycling!" },
];

const TINTS = ["#EBD9D3", "#DCE3D6", "#EADFD0", "#DDE2E1"];

export default function Reviews({ reviews = [] }) {
  const list = reviews.length ? reviews : GOOGLE_REVIEWS;
  const [index, setIndex] = useState(0);
  const touch = useRef(null);

  const go = (dir) => setIndex((i) => (i + dir + list.length) % list.length);

  return (
    <section id="opinie" className="overflow-x-clip py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading title="Słowa osób, które *u nas trenują.*" />
          <a
            href={CONTACT.googleReviews}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-3 rounded-full bg-linen py-2 pl-2 pr-5 transition-colors hover:bg-[#fffdfa]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-graphite/15 bg-[#fffdfa] text-[0.95rem] font-semibold text-graphite">
              G
            </span>
            <span className="text-[0.92rem]">5,0 w Google, 14 opinii</span>
          </a>
        </div>

        <div className="mt-12 flex flex-col items-center">
          {/* Stos kart: przesuń palcem albo użyj strzałek. */}
          <div
            className="relative h-[380px] w-[calc(100%-1.5rem)] max-w-[640px] select-none sm:h-[320px]"
            onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touch.current == null) return;
              const dx = e.changedTouches[0].clientX - touch.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touch.current = null;
            }}
            aria-live="polite"
          >
            {[2, 1, 0].map((offset) => {
              const r = list[(index + offset) % list.length];
              const top = offset === 0;
              return (
                <figure
                  key={`${r.id}-${offset}`}
                  aria-hidden={!top}
                  className="absolute inset-0 flex flex-col justify-between rounded-[28px] p-7 shadow-[0_18px_40px_-24px_rgba(43,29,26,0.5)] transition-all duration-500 md:p-10"
                  style={{
                    background: TINTS[(index + offset) % TINTS.length],
                    transform: `translate(${offset * 12}px, ${offset * -12}px) rotate(${offset * 2}deg)`,
                    zIndex: 3 - offset,
                  }}
                >
                  {top && (
                    <>
                      <blockquote key={r.id} className="step-enter text-[clamp(1.1rem,2.2vw,1.5rem)] font-medium leading-[1.4] tracking-[-0.02em]">
                        „{r.text}”
                      </blockquote>
                      <figcaption className="mt-6 flex items-end justify-between gap-4">
                        <span>
                          <span className="block text-[1.05rem] font-medium">{r.author}</span>
                          <span className="block text-[0.85rem] text-graphite/60">Opinia z Google</span>
                        </span>
                        <span className="flex gap-0.5" aria-label="Ocena 5 na 5">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <Star key={i} className="h-4 w-4 fill-graphite text-graphite" aria-hidden="true" />
                          ))}
                        </span>
                      </figcaption>
                    </>
                  )}
                </figure>
              );
            })}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <button type="button" onClick={() => go(-1)} aria-label="Poprzednia opinia" className="flex h-11 w-11 items-center justify-center rounded-full border border-graphite/15 bg-linen text-graphite hover:bg-[#fffdfa]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[4.5rem] text-center text-[0.92rem] tabular-nums text-graphite/60">
              {index + 1} z {list.length}
            </span>
            <button type="button" onClick={() => go(1)} aria-label="Następna opinia" className="flex h-11 w-11 items-center justify-center rounded-full border border-graphite/15 bg-linen text-graphite hover:bg-[#fffdfa]">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
