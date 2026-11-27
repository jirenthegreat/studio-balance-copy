import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { SpiralMark } from "./Logo";
import { IMG } from "@/lib/images";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

// Dane przykładowe — cennik edytowalny z panelu.
export const SAMPLE_PLANS = [
  { id: "p1", name: "Wejście jednorazowe", description: "Jedne zajęcia grupowe", price: null, unit: "za wejście" },
  { id: "p2", name: "Karnet 4 wejścia", description: "4 zajęcia grupowe", price: null, unit: "karnet" },
  { id: "p3", name: "Karnet 8 wejść", description: "8 zajęć grupowych", price: null, unit: "karnet", featured: true },
  { id: "p4", name: "Trening personalny", description: "60 minut, indywidualnie lub w parze", price: null, unit: "za sesję" },
];

const SAMPLE_PROMO = {
  enabled: true,
  text: "−50% na pierwszy trening personalny dla nowych klientek",
};

function linkFor(plan) {
  if (plan.link) return plan.link;
  const n = plan.name.toLowerCase();
  return n.includes("personal") || n.includes("treningów") ? "/trening-personalny" : "/grafik";
}

/** Oferta powitalna podana jako bilet z perforacją. */
function WelcomeTicket({ text }) {
  // Wartość zniżki wyciągnięta z treści promocji ustawionej w panelu.
  const percent = text.match(/[−-]\s?\d+\s?%/)?.[0]?.replace(/\s/g, "").replace("-", "−");
  return (
    <div className="mt-14 grid overflow-hidden rounded-[28px] md:grid-cols-[1.5fr_auto_1fr]">
      <div className="relative min-h-[260px] overflow-hidden p-7 md:p-10">
        <Image src={IMG.hero} alt="" className="photo-warm absolute inset-0 h-full w-full" />
        <span className="absolute inset-0 bg-gradient-to-r from-graphite/85 via-graphite/60 to-graphite/20" aria-hidden="true" />
        <div className="relative max-w-md text-linen">
          <p className="w-fit rounded-full bg-linen/15 px-3 py-1 text-[0.85rem] backdrop-blur">Karnet powitalny</p>
          <h3 className="mt-6 text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.05]">{text}</h3>
          <ul className="mt-5 flex flex-wrap gap-2 text-[0.85rem]">
            {["60 minut 1:1", "plan pod Twój cel", "bez zobowiązań"].map((t) => (
              <li key={t} className="flex items-center gap-1.5 rounded-full bg-linen/15 px-3 py-1 backdrop-blur">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ticket-cut hidden w-[10px] bg-linen md:block" aria-hidden="true" />

      <div className="flex flex-col justify-between gap-6 border-t-2 border-dashed border-bone bg-linen p-7 md:border-t-0 md:p-9">
        <div className="flex items-start justify-between">
          <span className="text-[0.9rem] text-graphite/55">Dla nowych osób</span>
          <SpiralMark className="h-7 w-7 text-graphite/40" />
        </div>
        {percent ? (
          <span className="block text-[4.2rem] font-medium leading-none tracking-[-0.06em]">{percent}</span>
        ) : (
          <span className="block text-[2rem] font-medium leading-tight tracking-[-0.04em]">Na start</span>
        )}
        <Link to="/trening-personalny" className="btn btn-primary w-full">
          Umów pierwszy trening
        </Link>
      </div>
    </div>
  );
}

export default function Pricing({ plans = SAMPLE_PLANS, promo = SAMPLE_PROMO }) {
  return (
    <section id="cennik" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading title="Proste zasady, *spokojna głowa.*" />
          <p className="max-w-xs text-[0.95rem] leading-relaxed text-graphite/60 md:text-right">
            Płacisz na miejscu. Karnety rozliczamy w studiu przy pierwszej wizycie.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id || plan.name}
              className={cn(
                "flex flex-col rounded-[24px] p-6",
                plan.featured ? "bg-graphite text-linen" : "bg-linen"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[1.25rem] leading-tight">{plan.name}</h3>
                {plan.featured && (
                  <span className="shrink-0 rounded-full bg-linen/15 px-2.5 py-0.5 text-[0.75rem]">
                    najczęściej
                  </span>
                )}
              </div>
              <p className={cn("mt-1.5 text-[0.9rem]", plan.featured ? "text-linen/70" : "text-graphite/60")}>
                {plan.description}
              </p>
              <p className="mt-10 text-[2.1rem] font-medium leading-none tracking-[-0.04em]">
                {plan.price ? `${plan.price} zł` : "—"}
              </p>
              <p className={cn("mt-1 text-[0.85rem]", plan.featured ? "text-linen/60" : "text-graphite/50")}>
                {plan.price ? plan.unit : "cena do uzupełnienia"}
              </p>
              <Link
                to={linkFor(plan)}
                className={cn("btn mt-6 w-full", plan.featured ? "bg-linen text-graphite hover:bg-white" : "btn-outline")}
              >
                Wybierz
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[0.95rem] text-graphite/65">
          Honorujemy <strong className="font-medium text-graphite">Lubelską Kartę Seniora</strong>.
          Zapytaj o zniżkę przy zapisie.
        </p>

        {promo?.enabled && promo?.text && <WelcomeTicket text={promo.text} />}
      </div>
    </section>
  );
}
