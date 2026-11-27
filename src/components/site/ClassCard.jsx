import { cn } from "@/lib/utils";
import { withInstructor } from "./schedule-data";

/** Cztery kropki: zajęte i wolne miejsca w grupie. */
export function Seats({ booked = 0, capacity = 4, className }) {
  const total = Math.max(1, capacity);
  return (
    <span
      className={cn("flex items-center gap-1", className)}
      aria-label={`${booked} z ${total} miejsc zajętych`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            i < booked ? "bg-ink/70" : "border border-ink/30"
          )}
        />
      ))}
    </span>
  );
}

export default function ClassCard({ session, onSelect }) {
  const full = session.booked >= session.capacity;

  return (
    <button
      type="button"
      onClick={() => onSelect(session)}
      className={cn(
        "group relative w-full rounded-[12px] border-l-[3px] px-3 py-2.5 text-left transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-20px_rgba(43,29,26,0.75)]",
        full && "opacity-60 saturate-50"
      )}
      style={{
        backgroundColor: session.style.bg,
        borderLeftColor: session.style.edge,
      }}
    >
      <p className="text-[0.66rem] tracking-[0.01em] text-ink/45">
        {session.time} · {session.duration} min
      </p>
      <p className="mt-1 text-[0.86rem] font-medium leading-tight tracking-[-0.01em] text-ink">
        {session.name}
      </p>
      <p className="mt-0.5 text-[0.72rem] text-ink/45">
        z {withInstructor(session.instructor)}
      </p>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-[0.68rem] font-medium text-ink/60 transition-opacity duration-300",
            full ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {full ? "Lista rezerwowa" : "Zapisz →"}
        </span>
        <Seats booked={session.booked} capacity={session.capacity} />
      </div>
    </button>
  );
}