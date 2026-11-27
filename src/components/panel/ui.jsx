import { cn } from "@/lib/utils";

export function PageTitle({ children, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[1.7rem] leading-tight md:text-[2rem]">{children}</h1>
        {subtitle && (
          <p className="mt-1.5 text-[0.85rem] leading-relaxed text-graphite/55">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PanelCard({ title, description, action, children, className }) {
  return (
    <section className={cn("border border-graphite/12 bg-bone p-5 md:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-[1.15rem] leading-snug">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-[0.78rem] leading-relaxed text-graphite/50">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PField({ label, children, hint, className }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[0.6rem] uppercase tracking-[0.16em] text-graphite/45">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[0.7rem] text-graphite/40">{hint}</span>}
    </label>
  );
}

const TONES = {
  gray: "bg-graphite/10 text-graphite/70",
  green: "bg-sage/25 text-[#4b5a45]",
  rose: "bg-rose/15 text-[#8d4b5f]",
  sand: "bg-sand text-graphite/70",
};

export function PBadge({ children, tone = "gray" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.62rem] uppercase tracking-[0.1em]",
        TONES[tone] || TONES.gray
      )}
    >
      {children}
    </span>
  );
}

export function PEmpty({ children }) {
  return (
    <p className="border border-dashed border-graphite/20 px-4 py-8 text-center text-[0.82rem] text-graphite/45">
      {children}
    </p>
  );
}

export function PLoading() {
  return (
    <p className="py-8 text-center text-[0.8rem] text-graphite/40">Wczytywanie…</p>
  );
}

export const SMALL_BTN =
  "inline-flex min-h-[38px] items-center justify-center gap-1.5 border border-graphite/20 px-3 text-[0.68rem] uppercase tracking-[0.1em] text-graphite/70 transition-colors hover:border-graphite/50 hover:text-graphite disabled:opacity-40";