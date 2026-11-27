import { Fragment } from "react";
import ClassCard from "./ClassCard";
import { weekdayShort } from "@/lib/booking-format";

function shortDate(date) {
  return `${date.slice(8, 10)}.${date.slice(5, 7)}`;
}

export default function ScheduleGrid({ days, sessions, onSelect }) {
  const times = Array.from(new Set(sessions.map((s) => s.time))).sort();
  const columns = `3.6rem repeat(${days.length}, minmax(0, 1fr))`;

  return (
    <div className="overflow-hidden rounded-[24px] border border-ink/[0.08] bg-surface">
      <div className="grid" style={{ gridTemplateColumns: columns }}>
        <div className="border-b border-ink/[0.07]" />
        {days.map((date) => (
          <div
            key={date}
            className="border-b border-l border-ink/[0.07] px-2 py-3 text-center"
          >
            <p className="text-[0.8rem] font-medium tracking-[-0.01em] text-ink">
              {weekdayShort(date)}
            </p>
            <p className="mt-0.5 text-[0.72rem] text-ink/40">{shortDate(date)}</p>
          </div>
        ))}

        {times.map((time) => (
          <Fragment key={time}>
            <div className="flex items-start justify-end border-b border-ink/[0.07] px-3 py-4 text-[0.72rem] text-ink/35">
              {time}
            </div>
            {days.map((date) => {
              const session = sessions.find(
                (s) => s.date === date && s.time === time
              );
              return (
                <div
                  key={`${date}-${time}`}
                  className="border-b border-l border-ink/[0.07] p-2.5"
                >
                  {session && (
                    <ClassCard session={session} onSelect={onSelect} />
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}