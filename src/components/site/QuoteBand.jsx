export default function QuoteBand() {
  return (
    <section aria-label="Cytat" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span
          className="mx-auto mb-9 block h-px w-12 bg-ink/20"
          aria-hidden="true"
        />
        <blockquote className="site-accent text-[clamp(1.75rem,3.6vw,2.9rem)] leading-[1.28] text-ink/85">
          [CYTAT PAULI DO UZUPEŁNIENIA]
        </blockquote>
        <p className="mt-9 text-[0.85rem] text-ink/50">
          — Paula Kruszyńska, założycielka
        </p>
      </div>
    </section>
  );
}