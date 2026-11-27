import { Image } from "@/components/ui/image";
import ClassCard from "./ClassCard";
import { weekdayShort } from "@/lib/booking-format";
import { cn } from "@/lib/utils";
import { IMG } from "@/lib/images";

const POLAROIDS = [
  { src: IMG.hero, caption: "sala", rotate: "-4deg" },
  { src: IMG.room, caption: "przestrzeń", rotate: "3deg" },
  { src: IMG.bikes, caption: "rowery", rotate: "-2deg" },
  { src: IMG.pilatesGroup, caption: "w grupie", rotate: "4deg" },
];

function shortDate(date) {
  return `${date.slice(8, 10)}.${date.slice(5, 7)}`;
}

export default function ScheduleMobile({
  days,
  sessions,
  activeDay,
  onDayChange,
  onSelect,
}) {
  const daySessions = sessions
    .filter((s) => s.date === activeDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  const nextDayWithSessions = days.find(
    (date) =>
      date > activeDay && sessions.some((session) => session.date === date)
  );

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2">
        {POLAROIDS.map((photo) => (
          <div
            key={photo.caption}
            className="polaroid w-[8.5rem] shrink-0"
            style={{ transform: `rotate(${photo.rotate})` }}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              className="h-24 w-full rounded-[3px] object-cover"
            />
            <p className="polaroid-caption mt-2 text-center">{photo.caption}</p>
          </div>
        ))}
      </div>

      <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1">
        {days.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => onDayChange(date)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[0.8rem] transition-colors",
              activeDay === date
                ? "bg-ink text-surface"
                : "border border-ink/15 text-ink/60"
            )}
          >
            {weekdayShort(date)} {shortDate(date)}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2.5">
        {daySessions.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-ink/15 px-5 py-8 text-center">
            <p className="text-[0.9rem] text-ink/50">
              Tego dnia nie ma zajęć
            </p>
            {nextDayWithSessions && (
              <button
                type="button"
                onClick={() => onDayChange(nextDayWithSessions)}
                className="mt-2 text-[0.85rem] font-medium text-ink underline decoration-ink/25 underline-offset-4"
              >
                zobacz kolejny dzień →
              </button>
            )}
          </div>
        ) : (
          daySessions.map((session) => (
            <div key={session.id} className="[&>button]:px-4 [&>button]:py-3.5">
              <ClassCard session={session} onSelect={onSelect} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}