import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import SectionHeading from "./SectionHeading";
import { IMG } from "@/lib/images";
import { cn } from "@/lib/utils";

const NEEDS = [
  {
    label: "Boli mnie kręgosłup",
    text: "Zacznij od treningu personalnego: Paula sprawdzi, jak się ruszasz, i ułoży ćwiczenia prozdrowotne pod Twoje plecy. Potem możesz dołączyć do pilatesu w małej grupie.",
    classes: ["Trening personalny", "Pilates + relaksacja"],
    to: "/trening-personalny",
    cta: "Umów trening 1:1",
    image: IMG.pilatesClass,
  },
  {
    label: "Jestem w ciąży lub po porodzie",
    text: "Fit Mama to zajęcia dla mam z dzieckiem obok. Paula ma certyfikat „Aktywność w ciąży i po porodzie”, a w ciąży możesz też trenować indywidualnie.",
    classes: ["Fit Mama", "Trening personalny"],
    to: "/grafik",
    cta: "Zobacz grafik",
    image: IMG.paulaClass,
  },
  {
    label: "Chcę wrócić do formy",
    text: "Spinning Fit i trening obwodowy budują kondycję i siłę. W grupie do czterech osób tempo dopasujesz do siebie.",
    classes: ["Spinning Fit", "Trening obwodowy"],
    to: "/grafik",
    cta: "Zobacz grafik",
    image: IMG.bikes,
  },
  {
    label: "Potrzebuję się wyciszyć",
    text: "Pilates z relaksacją i stretching to godzina spokojnego ruchu i oddechu. Dobre zakończenie dnia przy biurku.",
    classes: ["Pilates + relaksacja", "Stretching"],
    to: "/grafik",
    cta: "Zobacz grafik",
    image: IMG.pilatesGroup,
  },
];

export default function Needs() {
  const [active, setActive] = useState(0);
  const need = NEEDS[active];

  return (
    <section id="dla-kogo" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <SectionHeading title="Z czym *przychodzisz?*" />

        <div className="mt-12 grid gap-8 md:grid-cols-[1.05fr_1fr] md:gap-14">
          <div role="tablist" aria-label="Wybierz swój cel">
            {NEEDS.map((n, i) => {
              const on = i === active;
              return (
                <div key={n.label} className="border-t border-graphite/10 last:border-b">
                  <button
                    type="button"
                    role="tab"
                    id={`need-${i}`}
                    aria-selected={on}
                    aria-controls="need-panel"
                    onClick={() => setActive(i)}
                    className={cn(
                      "w-full py-5 text-left text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium leading-tight tracking-[-0.035em] transition-colors",
                      on ? "text-graphite" : "text-graphite/30 hover:text-graphite/60"
                    )}
                  >
                    {n.label}
                  </button>
                  {on && (
                    <div className="step-enter pb-6">
                      <p className="max-w-md text-[1rem] leading-[1.7] text-graphite/70">{n.text}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {n.classes.map((c) => (
                          <span key={c} className="rounded-full bg-sage/15 px-3 py-1 text-[0.85rem] text-graphite/80">
                            {c}
                          </span>
                        ))}
                      </div>
                      <Link to={n.to} className="btn btn-primary mt-5">
                        {n.cta}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
            <p className="mt-5 text-[0.85rem] text-graphite/50">
              Przy urazach i w ciąży skonsultuj ćwiczenia z lekarzem.
            </p>
          </div>

          <div
            id="need-panel"
            role="tabpanel"
            aria-labelledby={`need-${active}`}
            className="relative hidden overflow-hidden rounded-[28px] md:block"
          >
            <Image
              key={need.image}
              src={need.image}
              alt=""
              className="photo-warm step-enter absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
