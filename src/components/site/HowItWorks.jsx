import { Link } from "@tanstack/react-router";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const STEPS = [
  {
    number: "01",
    title: "Wybierz zajęcia",
    text: "Zajrzyj w grafik i znajdź formę, która pasuje do Twojego tygodnia. Wszystko widzisz od razu — bez logowania i bez aplikacji.",
    to: "/grafik",
    label: "Zobacz grafik",
  },
  {
    number: "02",
    title: "Zapisz się w 30 sekund",
    text: "Podaj imię, telefon i e-mail. Miejsce blokuje się od razu, a potwierdzenie z linkiem do odwołania trafia na Twoją skrzynkę.",
  },
  {
    number: "03",
    title: "Przyjdź na matę",
    text: "Weź wygodny strój i butelkę wody. Mata, sprzęt i spokój czekają na Ciebie w studiu — resztą zajmiemy się my.",
  },
];

export default function HowItWorks() {
  return (
    <section id="jak-to-dziala" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <SectionHeading
            overline="Jak to działa"
            title="Trzy kroki|do *pierwszego treningu*."
          />
        </Reveal>

        <div className="mt-14 space-y-5">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="sticky"
              style={{ top: `${88 + i * 18}px` }}
            >
              <Reveal delay={i * 60}>
                <article className="site-card grid gap-6 p-7 shadow-[0_-24px_60px_-46px_rgba(43,29,26,0.5)] md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:p-10">
                  <span className="font-accent text-[2.4rem] italic leading-none text-blush">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-[1.35rem] font-medium leading-tight tracking-[-0.02em] md:text-[1.5rem]">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 max-w-xl text-[0.9rem] leading-[1.75] text-ink/55">
                      {step.text}
                    </p>
                  </div>
                  {step.to && (
                    <Link
                      to={step.to}
                      className="btn btn-outline !min-h-[42px] !px-5 !text-[0.8rem]"
                    >
                      {step.label}
                    </Link>
                  )}
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}