import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  PersonStanding,
  Baby,
  HeartPulse,
  Wind,
  ArrowRight,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    id: "kregoslup",
    label: "Boli mnie kręgosłup",
    icon: PersonStanding,
    classes: ["Trening personalny (prozdrowotny)", "Pilates + relaksacja"],
    text: "Indywidualny trening albo pilates na macie, z dużą uwagą na technikę i ułożenie ciała. Tempo dopasowane do tego, jak czuje się Twoje ciało.",
  },
  {
    id: "ciaza",
    label: "Jestem w ciąży lub po porodzie",
    icon: Baby,
    classes: ["Fit Mama", "Trening personalny"],
    text: "Fit Mama to zajęcia w małej grupie, z maluchem obok. Trening personalny prowadzimy indywidualnie — jedna na jedna.",
  },
  {
    id: "forma",
    label: "Chcę wrócić do formy",
    icon: HeartPulse,
    classes: ["Spinning Fit", "Trening obwodowy"],
    text: "Spinning Fit to interwały na rowerach przy muzyce. Trening obwodowy — krótkie stacje i praca na całe ciało.",
  },
  {
    id: "wyciszenie",
    label: "Potrzebuję się wyciszyć",
    icon: Wind,
    classes: ["Pilates + relaksacja", "Stretching"],
    text: "Spokojniejsze zajęcia z elementami oddechu i rozluźniania — na macie i na rozciąganie napiętych pleców, bioder i barków.",
  },
];

export default function Concerns() {
  const [active, setActive] = useState(null);
  const current = ITEMS.find((item) => item.id === active);

  return (
    <section id="z-czym" className="bg-clay py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <SectionHeading
            overline="Od czego zacząć"
            title="Z czym *przychodzisz*?"
            intro="Wybierz to, co jest u Ciebie teraz najważniejsze — pokażemy zajęcia, od których warto zacząć."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = id === active;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(isActive ? null : id)}
                aria-expanded={isActive}
                className={cn(
                  "group flex h-full flex-col items-start gap-5 rounded-[24px] border p-6 text-left transition-colors duration-300",
                  isActive
                    ? "border-ink/25 bg-surface"
                    : "border-ink/[0.08] bg-surface/60 hover:border-ink/20 hover:bg-surface"
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300",
                    isActive ? "bg-ink text-surface" : "bg-leaf/20 text-ink/70"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-[1.02rem] font-medium leading-snug tracking-[-0.02em] text-ink">
                  {label}
                </span>
                <span className="mt-auto flex items-center gap-1.5 text-[0.78rem] text-ink/45">
                  {isActive ? "Ukryj" : "Zobacz propozycje"}
                  <ArrowRight
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300",
                      isActive ? "rotate-90" : "group-hover:translate-x-0.5"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </button>
            );
          })}
        </div>

        {current && (
          <div
            key={current.id}
            className="step-enter mt-5 rounded-[24px] border border-ink/[0.08] bg-surface p-7 md:p-9"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.78rem] text-ink/45">
                  Polecamy przy: {current.label.toLowerCase()}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {current.classes.map((name) => (
                    <span
                      key={name}
                      className="site-pill bg-leaf/15 text-[0.8rem] text-ink/75"
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[0.95rem] leading-[1.75] text-ink/60">
                  {current.text}
                </p>
              </div>
              <Link to="/grafik" className="btn btn-primary shrink-0">
                Zobacz w grafiku
              </Link>
            </div>
          </div>
        )}

        <p className="mt-6 text-[0.76rem] text-ink/40">
          Przy urazach i w ciąży skonsultuj się z lekarzem.
        </p>
      </div>
    </section>
  );
}