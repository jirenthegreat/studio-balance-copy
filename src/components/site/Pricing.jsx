import { Link } from "@tanstack/react-router";
import { Sparkles, IdCard } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

// Dane przykładowe — cennik edytowalny z panelu.
export const SAMPLE_PLANS = [
  { id: "p1", name: "Wejście jednorazowe", description: "Jedne zajęcia grupowe", price: null, unit: "za wejście" },
  { id: "p2", name: "Karnet 4 wejścia", description: "4 zajęcia", price: null, unit: "karnet" },
  { id: "p3", name: "Karnet 8 wejść", description: "8 zajęć", price: null, unit: "karnet", featured: true },
  { id: "p4", name: "Trening personalny", description: "60 minut, indywidualnie lub w parze", price: null, unit: "za sesję" },
  { id: "p5", name: "Pakiet 8 treningów", description: "Osiem sesji 1:1 z planem treningowym", price: null, unit: "pakiet" },
];

const SAMPLE_PROMO = {
  enabled: true,
  text: "−50% na pierwszy trening personalny dla nowych klientek",
};

export default function Pricing({ plans = SAMPLE_PLANS, promo = SAMPLE_PROMO }) {
  return (
    <section id="cennik" className="bg-clay py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Reveal>
          <SectionHeading
            overline="Cennik"
            title="Proste zasady,|*spokojna głowa*."
            intro="Płatność na miejscu. Karnety i pakiety rozliczamy w studiu, przy pierwszej wizycie."
          />
        </Reveal>

        {promo?.enabled && promo?.text && (
          <Reveal delay={80}>
            <div className="mt-10 flex items-start gap-4 rounded-[20px] border border-blush/25 bg-surface px-6 py-5">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blush" aria-hidden="true" />
              <p className="text-[0.92rem] leading-relaxed text-ink/70">
                {promo.text}
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={120}>
          <div className="site-card mt-8 divide-y divide-ink/[0.07] overflow-hidden px-5 sm:px-8">
            {plans.map((plan) => (
              <div
                key={plan.id || plan.name}
                className={cn(
                  "flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8",
                  plan.featured && "-mx-5 bg-canvas/70 px-5 sm:-mx-8 sm:px-8"
                )}
              >
                <div>
                  <h3 className="flex flex-wrap items-center gap-3 text-[1.25rem] font-medium leading-tight tracking-[-0.02em]">
                    {plan.name}
                    {plan.featured && (
                      <span className="site-pill bg-leaf/20 text-ink/70">
                        najczęściej wybierany
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-[0.88rem] text-ink/50">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="text-right">
                    <p className="text-[1.35rem] font-medium leading-none tracking-[-0.02em]">
                      {plan.price ? `${plan.price} zł` : "Zapytaj o cenę"}
                    </p>
                    <p className="mt-1 text-[0.78rem] text-ink/40">
                      {plan.unit}
                    </p>
                  </div>
                  <Link
                    to={
                      plan.link ||
                      (plan.name.toLowerCase().includes("personalny") ||
                      plan.name.toLowerCase().includes("treningów")
                        ? "/trening-personalny"
                        : "/grafik")
                    }
                    className="btn btn-outline shrink-0 !min-h-[40px] !px-4 !text-[0.8rem]"
                  >
                    Wybierz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 flex items-start gap-4 rounded-[20px] bg-surface/70 px-6 py-5">
            <IdCard className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />
            <p className="text-[0.88rem] leading-relaxed text-ink/60">
              Honorujemy <strong className="font-medium text-ink">Lubelską Kartę Seniora</strong>.
              Zapytaj o zniżkę przy zapisie — chętnie ją zastosujemy.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}