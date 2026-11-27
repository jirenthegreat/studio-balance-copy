import { Quote } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ReviewCarousel from "./ReviewCarousel";
import { CONTACT } from "@/lib/images";

export default function Reviews({ reviews = [] }) {
  const link = CONTACT.googleReviews;

  return (
    <section id="opinie" className="bg-clay py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              overline="Opinie"
              title="Słowa osób,|które u nas *trenują*."
            />
          </Reveal>
          <Reveal delay={100}>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="site-pill bg-surface px-4 py-3 text-ink/70 shadow-[0_12px_30px_-24px_rgba(43,29,26,0.7)] transition-colors hover:text-ink"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[0.62rem] font-semibold text-surface">
                G
              </span>
              5,0 ★ w Google · 14 opinii
            </a>
          </Reveal>
        </div>

        {reviews.length ? (
          <ReviewCarousel reviews={reviews} />
        ) : (
          <Reveal delay={120}>
            <div className="mt-12 rounded-[24px] border border-dashed border-ink/15 px-6 py-16 text-center">
              <Quote className="mx-auto h-7 w-7 text-ink/20" aria-hidden="true" />
              <p className="mx-auto mt-5 max-w-md text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-ink/65">
                Opinie z Google pojawią się tutaj.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={80}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Zobacz wszystkie opinie
            </a>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Dodaj opinię
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}