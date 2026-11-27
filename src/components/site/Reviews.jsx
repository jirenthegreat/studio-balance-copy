import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ReviewStack from "./ReviewStack";
import { SAMPLE_REVIEWS } from "./reviewSamples";
import { CONTACT } from "@/lib/images";

export default function Reviews({ reviews = [] }) {
  const items = reviews.length ? reviews : SAMPLE_REVIEWS;
  const link = CONTACT.googleReviews;

  return (
    <section id="opinie" className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Reveal>
          <SectionHeading
            overline="Opinie"
            title="Słowa osób,|które u nas *trenują*."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex gap-0.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-blush text-blush" />
              ))}
            </span>
            <span className="text-[0.95rem] font-medium tracking-[-0.01em] text-ink">
              5,0 w Google · 14 opinii
            </span>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-[0.82rem] text-ink/45 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink"
            >
              Zobacz w Google
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ReviewStack reviews={items} />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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