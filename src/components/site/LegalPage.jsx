import { Link } from "@tanstack/react-router";
import Accent from "./Accent";

export default function LegalPage({ overline, title, updated, sections }) {
  return (
    <section className="pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <p className="overline mb-6">{overline}</p>
        <h1 className="text-[clamp(2rem,4vw,2.9rem)] font-medium leading-[1.05] tracking-[-0.03em]">
          <Accent text={title} />
        </h1>
        {updated && (
          <p className="mt-4 text-[0.82rem] text-ink/40">
            Ostatnia aktualizacja: {updated}
          </p>
        )}

        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <article key={section.heading}>
              <h2 className="text-[1.15rem] font-medium leading-snug tracking-[-0.02em]">
                {section.heading}
              </h2>
              <div className="mt-2.5 space-y-3 text-[0.92rem] leading-[1.85] text-ink/60">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <Link
          to="/"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-surface px-5 py-3 text-[0.85rem] text-ink/70 transition-colors hover:text-ink"
        >
          ← Wróć na stronę główną
        </Link>
      </div>
    </section>
  );
}