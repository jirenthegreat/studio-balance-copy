import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SpiralMark } from "./Logo";

const POINTS = [
  "60 minut 1:1",
  "plan dopasowany do Twojego celu",
  "bez zobowiązań",
];

export default function WelcomeTicket({ text }) {
  if (!text) return null;

  return (
    <div className="relative mt-10 overflow-hidden rounded-[24px] bg-ink text-canvas">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-7 md:p-10">
          <div className="flex items-center gap-3 text-canvas/60">
            <SpiralMark className="h-6 w-6" strokeWidth={1.2} />
            <span className="text-[0.8rem]">Oferta powitalna</span>
          </div>

          <h3 className="mt-5 text-[1.6rem] font-medium tracking-[-0.02em] text-canvas md:text-[2rem]">
            Karnet powitalny
          </h3>
          <p className="site-accent mt-2 text-[1.8rem] leading-[1.15] text-canvas md:text-[2.2rem]">
            {text}
          </p>

          <ul className="mt-6 space-y-2.5">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2.5 text-[0.88rem] text-canvas/70"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf/30">
                  <Check className="h-2.5 w-2.5 text-canvas" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col justify-center gap-4 border-t border-dashed border-canvas/25 p-7 md:w-[32%] md:border-l md:border-t-0 md:p-8">
          <div>
            <p className="text-[0.76rem] text-canvas/45">Kod promocji</p>
            <p className="mt-2 rounded-[14px] border border-dashed border-canvas/30 px-4 py-3 text-center text-[1.05rem] font-medium tracking-[0.14em] text-canvas">
              BALANCE-50
            </p>
          </div>
          <Link
            to="/trening-personalny"
            className="btn btn-cream w-full justify-center"
          >
            Odbierz
          </Link>
          <p className="text-center text-[0.72rem] text-canvas/40">
            Pokaż kod przy pierwszej wizycie
          </p>
        </div>
      </div>

      {/* perforacja biletu */}
      <span
        className="absolute right-[32%] top-0 hidden h-6 w-6 -translate-y-1/2 translate-x-1/2 rounded-full bg-clay md:block"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-0 right-[32%] hidden h-6 w-6 translate-x-1/2 translate-y-1/2 rounded-full bg-clay md:block"
        aria-hidden="true"
      />
    </div>
  );
}