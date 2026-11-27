import { Link } from "@tanstack/react-router";

export default function LegalPage({ overline, title, updated, sections }) {
  return (
    <section className="pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <p className="overline flex items-center gap-3 text-rose">
          <span className="h-px w-7 bg-rose/50" aria-hidden="true" />
          {overline}
        </p>
        <h1 className="mt-5 text-[2.2rem] leading-[1.08] md:text-[2.9rem]">{title}</h1>
        {updated && (
          <p className="mt-3 text-[0.72rem] uppercase tracking-[0.16em] text-graphite/40">
            Ostatnia aktualizacja: {updated}
          </p>
        )}

        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <article key={section.heading}>
              <h2 className="text-[1.25rem] leading-snug">{section.heading}</h2>
              <div className="mt-2.5 space-y-3 text-[0.9rem] leading-[1.85] text-graphite/70">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <Link
          to="/"
          className="mt-12 inline-block text-[0.72rem] uppercase tracking-[0.16em] underline underline-offset-4"
        >
          ← Wróć na stronę główną
        </Link>
      </div>
    </section>
  );
}