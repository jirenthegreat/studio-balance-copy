const WORDS = [
  "Pilates",
  "Spinning",
  "Stretching",
  "Trening personalny",
  "Fit Mama",
  "Baby Gym",
];

export default function Marquee() {
  return (
    <div
      className="relative overflow-hidden border-y border-graphite/12 bg-sand/25 py-5"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {WORDS.map((word) => (
              <span
                key={`${half}-${word}`}
                className="flex items-center whitespace-nowrap text-[0.66rem] uppercase tracking-[0.36em] text-graphite/50"
              >
                {word}
                <span className="mx-6 text-rose/45">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}