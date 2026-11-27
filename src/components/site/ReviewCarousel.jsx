import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 na 5 gwiazdek">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className="h-3 w-3 fill-blush text-blush"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const initial = (review.author || "?").trim().charAt(0).toUpperCase();
  return (
    <figure
      data-card
      className="site-card flex w-[86%] shrink-0 snap-start flex-col justify-between p-7 sm:w-[47%] lg:w-[calc((100%-3rem)/3)]"
    >
      <div>
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf/20 text-[1.05rem] font-medium text-ink">
            {initial}
          </span>
          <div>
            <p className="text-[0.9rem] font-medium tracking-[-0.01em] text-ink">
              {review.author}
            </p>
            <div className="mt-1.5">
              <Stars />
            </div>
          </div>
        </div>

        <blockquote className="mt-5 text-[0.92rem] leading-[1.85] text-ink/60">
          „{review.text}”
        </blockquote>
      </div>

      <p className="mt-6 flex items-center gap-2 border-t border-ink/[0.07] pt-4 text-[0.76rem] text-ink/40">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/80 text-[0.5rem] font-semibold text-surface">
          G
        </span>
        Opinia z Google
      </p>
    </figure>
  );
}

export default function ReviewCarousel({ reviews }) {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const step = card ? card.offsetWidth + 24 : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className="mt-12">
      <div
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0"
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-[0.78rem] text-ink/40 md:hidden">
          Przewiń palcem, aby zobaczyć więcej
        </p>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Poprzednie opinie"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink/60 transition-colors hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Następne opinie"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink/60 transition-colors hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}