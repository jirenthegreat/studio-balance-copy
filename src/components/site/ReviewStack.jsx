import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

function Stars() {
  return (
    <span className="flex gap-0.5" aria-label="5 na 5 gwiazdek">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="h-3 w-3 fill-blush text-blush" aria-hidden="true" />
      ))}
    </span>
  );
}

function ReviewCard({ review }) {
  const initial = (review.author || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf/20 text-[1.05rem] font-medium text-ink">
            {initial}
          </span>
          <div>
            <p className="text-[0.92rem] font-medium tracking-[-0.01em] text-ink">
              {review.author}
            </p>
            <div className="mt-1.5">
              <Stars />
            </div>
          </div>
        </div>

        <blockquote className="mt-5 text-[0.95rem] leading-[1.85] text-ink/60">
          „{review.text}”
        </blockquote>
      </div>

      <p className="mt-6 flex items-center gap-2 border-t border-ink/[0.07] pt-4 text-[0.76rem] text-ink/40">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/80 text-[0.5rem] font-semibold text-surface">
          G
        </span>
        Opinia z Google
      </p>
    </div>
  );
}

export default function ReviewStack({ reviews = [] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const total = reviews.length;
  if (!total) return null;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const visible = Array.from({ length: Math.min(3, total) }, (_, depth) => ({
    depth,
    review: reviews[(index + depth) % total],
  })).reverse();

  return (
    <div className="mt-10">
      <div className="relative mx-auto h-[420px] max-w-2xl sm:h-[330px]">
        {visible.map(({ review, depth }) => {
          const isTop = depth === 0;
          return (
            <motion.figure
              key={review.id || review.author}
              drag={isTop && !reduce ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(event, info) => {
                if (info.offset.x < -80 || info.velocity.x < -450) next();
                else if (info.offset.x > 80 || info.velocity.x > 450) prev();
              }}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{
                opacity: 1,
                y: depth * 16,
                scale: 1 - depth * 0.035,
                rotate: depth === 0 ? 0 : depth % 2 ? -1.4 : 1.6,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              style={{ zIndex: 30 - depth, touchAction: "pan-y" }}
              className={`site-card absolute inset-x-0 top-0 flex h-[380px] flex-col p-6 sm:h-[300px] sm:p-8 ${
                isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
              }`}
            >
              <ReviewCard review={review} />
            </motion.figure>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Poprzednia opinia"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink/60 transition-colors hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[3.5rem] text-center text-[0.82rem] tabular-nums text-ink/45">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={next}
          aria-label="Następna opinia"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink/60 transition-colors hover:text-ink"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-center text-[0.76rem] text-ink/35 md:hidden">
        Przesuń kartę palcem, aby zobaczyć kolejną opinię
      </p>
    </div>
  );
}