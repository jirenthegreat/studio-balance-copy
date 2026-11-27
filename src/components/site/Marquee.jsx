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
      className="relative overflow-hidden bg-clay py-6"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {WORDS.map((word) => (
              <span
                key={`${half}-${word}`}
                className="flex items-center whitespace-nowrap text-[1.35rem] italic tracking-[-0.01em] text-ink/45"
              >
                <span className="site-accent">{word}</span>
                <span className="mx-7 h-1.5 w-1.5 rounded-full bg-leaf/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}