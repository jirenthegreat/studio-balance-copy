import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 na 5 gwiazdek">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className="h-3 w-3 fill-rose text-rose"
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
      className="flex w-[86%] shrink-0 snap-start flex-col justify-between bg-card p-7 sm:w-[47%] lg:w-[calc((100%-3rem)/3)]"
    >
      <div>
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand/70 font-heading text-[1.15rem] text-graphite">
            {initial}
          </span>
          <div>
            <p className="text-[0.88rem] tracking-[0.02em] text-graphite">
              {review.author}
            </p>
            <div className="mt-1.5">
              <Stars />
            </div>
          </div>
        </div>

        <blockquote className="mt-5 text-[0.9rem] leading-[1.85] text-graphite/70">
          „{review.text}”
        </blockquote>
      </div>

      <p className="mt-6 flex items-center gap-2 border-t border-graphite/10 pt-4 text-[0.8rem] text-graphite/45">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-graphite/25 text-[0.5rem] font-semibold">
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
        <p className="text-[0.8rem] text-graphite/40 md:hidden">
          Przewiń palcem, aby zobaczyć więcej
        </p>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Poprzednie opinie"
            className="flex h-10 w-10 items-center justify-center border border-graphite/20 text-graphite/70 transition-colors hover:border-graphite/60 hover:text-graphite"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Następne opinie"
            className="flex h-10 w-10 items-center justify-center border border-graphite/20 text-graphite/70 transition-colors hover:border-graphite/60 hover:text-graphite"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}