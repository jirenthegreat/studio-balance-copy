import { Quote } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ReviewCarousel from "./ReviewCarousel";
import { CONTACT } from "@/lib/images";

export default function Reviews({ reviews = [] }) {
  const link = CONTACT.googleReviews;

  return (
    <section id="opinie" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              overline="Opinie"
              title="Słowa osób,|które u nas trenują."
            />
          </Reveal>
          <Reveal delay={100}>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-graphite/15 bg-card px-5 py-4 transition-colors hover:border-graphite/45"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-graphite/25 text-[0.62rem] font-semibold text-graphite/70">
                G
              </span>
              <span className="text-[0.74rem] tracking-[0.04em] text-graphite/75">
                5,0 ★ w Google · 14 opinii
              </span>
            </a>
          </Reveal>
        </div>

        {reviews.length ? (
          <ReviewCarousel reviews={reviews} />
        ) : (
          <Reveal delay={120}>
            <div className="mt-12 border border-dashed border-graphite/25 px-6 py-16 text-center">
              <Quote
                className="mx-auto h-7 w-7 text-graphite/20"
                aria-hidden="true"
              />
              <p className="mx-auto mt-5 max-w-md font-heading text-[1.5rem] leading-snug text-graphite/70">
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