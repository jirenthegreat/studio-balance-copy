import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { isoDate } from "@/lib/booking-format";
import Reveal from "./Reveal";
import ScheduleGrid from "./ScheduleGrid";
import ScheduleMobile from "./ScheduleMobile";
import BookingSheet from "./BookingSheet";
import {
  FILTERS,
  demoWeek,
  normalizeSession,
  typeKey,
  weekDays,
} from "./schedule-data";

const WEEK_LABELS = ["Ten tydzień", "Następny tydzień"];

export default function Schedule({
  sessions = [],
  demo = true,
  showAllLink = true,
  heading = "Grafik tygodnia",
  note = "W każdej grupie maks. 4 osoby. Kliknij zajęcia, żeby zarezerwować miejsce.",
}) {
  const [week, setWeek] = useState(0);
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState(null);
  const [extra, setExtra] = useState({});
  const [mobileDay, setMobileDay] = useState(null);

  const source = useMemo(() => {
    if (sessions.length) return sessions.map(normalizeSession);
    if (!demo) return [];
    return [0, 1].flatMap((index) => demoWeek(index)).map(normalizeSession);
  }, [sessions, demo]);

  const days = useMemo(() => weekDays(week), [week]);

  const visible = useMemo(
    () =>
      source
        .filter((s) => s.date >= days[0] && s.date <= days[6])
        .filter((s) => type === "all" || typeKey(s.name) === type)
        .map((s) => ({
          ...s,
          booked: Math.min(s.capacity, s.booked + (extra[s.id] || 0)),
        }))
        .sort((a, b) =>
          `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
        ),
    [source, days, type, extra]
  );

  const gridDays = useMemo(() => {
    const weekend = [5, 6].filter((index) =>
      visible.some((s) => s.date === days[index])
    );
    return [...days.slice(0, 5), ...weekend.map((index) => days[index])];
  }, [days, visible]);

  useEffect(() => {
    const today = isoDate(new Date());
    const inWeek = source.filter(
      (s) =>
        s.date >= days[0] &&
        s.date <= days[6] &&
        (type === "all" || typeKey(s.name) === type)
    );
    const first = days.find((date) => inWeek.some((s) => s.date === date));
    setMobileDay(days.includes(today) ? today : first || days[0]);
  }, [days, type, source]);

  const handleBooked = (result) => {
    if (!selected || result?.status === "lista_rezerwowa") return;
    setExtra((prev) => ({
      ...prev,
      [selected.id]: (prev[selected.id] || 0) + 1,
    }));
  };

  return (
    <section id="grafik" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {heading && (
            <h2
              className="text-[clamp(2.3rem,7vw,4.9rem)] leading-[0.9] tracking-[-0.03em] text-ink"
              style={{ textTransform: "uppercase", fontWeight: 600 }}
            >
              {heading}
            </h2>
          )}
          {note && (
            <p className="max-w-[19rem] text-[0.88rem] leading-relaxed text-ink/55 md:text-right">
              {note}
            </p>
          )}
        </Reveal>

        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-fit gap-1 rounded-full border border-ink/12 p-1">
            {WEEK_LABELS.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setWeek(index)}
                className={cn(
                  "rounded-full px-4 py-2 text-[0.82rem] transition-colors",
                  week === index
                    ? "bg-ink text-surface"
                    : "text-ink/60 hover:text-ink"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setType(filter.key)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[0.82rem] transition-colors",
                  type === filter.key
                    ? "bg-ink text-surface"
                    : "border border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 hidden md:block">
          <ScheduleGrid
            days={gridDays}
            sessions={visible}
            onSelect={setSelected}
          />
        </div>

        <div className="mt-8 md:hidden">
          <ScheduleMobile
            days={days}
            sessions={visible}
            activeDay={mobileDay || days[0]}
            onDayChange={setMobileDay}
            onSelect={setSelected}
          />
        </div>

        {visible.length === 0 && (
          <p className="mt-6 text-[0.88rem] text-ink/45">
            W tym tygodniu nie ma zajęć w wybranym filtrze. Zmień filtr albo
            zajrzyj do kolejnego tygodnia.
          </p>
        )}

        {showAllLink && (
          <div className="mt-8">
            <Link to="/grafik" className="btn btn-outline">
              Pełny grafik
            </Link>
          </div>
        )}
      </div>

      <BookingSheet
        session={selected}
        onClose={() => setSelected(null)}
        onBooked={handleBooked}
      />
    </section>
  );
}