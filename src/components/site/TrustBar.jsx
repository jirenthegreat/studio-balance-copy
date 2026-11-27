import { Star } from "lucide-react";

// Inicjały klientek — bez nazwisk.
const INITIALS = ["A", "M", "K", "J", "Z"];
const TONES = ["#E3E9E0", "#F0E2E7", "#EFE3D9", "#E9E3EE", "#EAE5DC"];

export default function TrustBar() {
  return (
    <section
      aria-label="Opinie w Google"
      className="border-y border-ink/[0.07] bg-surface/60"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-7 text-center md:flex-row md:justify-between md:px-10 md:text-left">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex -space-x-3">
            {INITIALS.map((initial, i) => (
              <span
                key={`${initial}-${i}`}
                style={{ background: TONES[i % TONES.length] }}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface text-[0.82rem] font-medium text-ink/70"
                aria-hidden="true"
              >
                {initial}
              </span>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-blush text-blush" />
                ))}
              </span>
              <span className="text-[0.9rem] font-medium tracking-[-0.01em] text-ink">
                5,0 w Google · 14 opinii
              </span>
            </div>
            <p className="mt-1 text-[0.78rem] text-ink/45">
              Opinie osób trenujących w Studio Balance
            </p>
          </div>
        </div>

        <a
          href="#opinie"
          className="site-pill border border-ink/10 bg-surface px-4 py-2.5 text-[0.8rem] text-ink/65 transition-colors hover:border-ink/25 hover:text-ink"
        >
          Zobacz opinie
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}