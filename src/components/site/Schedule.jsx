import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, User } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

const WEEKDAY_SHORT = ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sob"];
const WEEKDAY_LONG = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

// Dane przykładowe — docelowo sesje pochodzą z bazy studia.
// weekday: 1 = poniedziałek … 5 = piątek. Daty wyliczamy z wyświetlanego tygodnia.
export const SAMPLE_SESSIONS = [
  { id: "s1", weekday: 1, time: "10:00", name: "Pilates + relaksacja", color: "#B9788F", duration: 60, instructor: "Paula", capacity: 4, booked: 2 },
  { id: "s2", weekday: 2, time: "10:00", name: "Fit Mama", color: "#9DAA94", duration: 55, instructor: "Paula", capacity: 4, booked: 3 },
  { id: "s3", weekday: 3, time: "18:00", name: "Spinning Fit", color: "#C08552", duration: 50, instructor: "Paula", capacity: 4, booked: 4 },
  { id: "s4", weekday: 4, time: "18:00", name: "Stretching", color: "#7C8B9B", duration: 55, instructor: "Paula", capacity: 4, booked: 1 },
  { id: "s5", weekday: 5, time: "18:00", name: "Pilates + relaksacja", color: "#B9788F", duration: 60, instructor: "Paula", capacity: 4, booked: 0 },
];

function demoSessionsFor(week) {
  return SAMPLE_SESSIONS.flatMap((session) => {
    const date = week.find(
      (day) => new Date(`${day}T12:00:00`).getDay() === session.weekday
    );
    return date ? [{ ...session, date, is_demo: true }] : [];
  });
}

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Najbliższe 7 dni od dziś, bez niedziel. */
export function weekDatesFor() {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < 7) {
    if (d.getDay() !== 0) out.push(isoDate(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function weekdayShort(date) {
  return WEEKDAY_SHORT[new Date(`${date}T12:00:00`).getDay()];
}

function weekdayLong(date) {
  return WEEKDAY_LONG[new Date(`${date}T12:00:00`).getDay()];
}

function SlotCard({ session }) {
  const free = Math.max(0, (session.capacity ?? 4) - (session.booked ?? 0));
  return (
    <article className="relative border border-graphite/12 bg-bone/70 p-4 pl-5">
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: session.color || "#B9788F" }}
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="font-heading text-[1.35rem] leading-none">
          {session.time}
        </span>
        <span
          className={cn(
            "text-[0.6rem] uppercase tracking-[0.12em]",
            free === 0 ? "text-rose" : "text-graphite/45"
          )}
        >
          {free === 0 ? "Lista rezerwowa" : `${free}/${session.capacity ?? 4} wolne`}
        </span>
      </div>
      <h4 className="mt-2 text-[1.05rem] leading-snug">{session.name}</h4>
      <div className="mt-2 flex items-center gap-2 text-[0.7rem] text-graphite/50">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand/80">
          <User className="h-3 w-3" aria-hidden="true" />
        </span>
        {session.instructor || "Paula"}
      </div>
      <Link
        to="/rezerwacja/$sessionId"
        params={{ sessionId: session.id }}
        className="btn btn-outline mt-4 w-full !min-h-[38px] !whitespace-normal !px-2 !text-[0.56rem] leading-tight"
      >
        {free === 0 ? "Zapisz na listę" : "Zapisz się"}
      </Link>
    </article>
  );
}

export default function Schedule({
  sessions = [],
  compact = false,
  showAllLink = true,
  demo = true,
  title = "Najbliższe 7 dni w studiu.",
  intro = "Małe grupy, więc miejsca szybko znikają. Zapis trwa chwilę i nie wymaga zakładania konta.",
}) {
  const [filter, setFilter] = useState("all");
  const [openDay, setOpenDay] = useState(0);

  const week = useMemo(() => weekDatesFor(), []);

  const source = useMemo(() => {
    if (sessions.length) return sessions;
    return demo ? demoSessionsFor(week) : [];
  }, [sessions, week, demo]);

  const types = useMemo(() => {
    const map = new Map();
    source.forEach((s) => {
      if (!map.has(s.name)) map.set(s.name, s.color);
    });
    return Array.from(map, ([name, color]) => ({ name, color }));
  }, [source]);

  const visible = source.filter(
    (s) => week.includes(s.date) && (filter === "all" || s.name === filter)
  );

  return (
    <section id="grafik" className="bg-sand/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading overline="Grafik" title={title} intro={intro} />
          {showAllLink && (
            <Link to="/grafik" className="btn btn-outline shrink-0">
              Pełny grafik
            </Link>
          )}
        </Reveal>

        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "shrink-0 border px-4 py-2 text-[0.64rem] uppercase tracking-[0.14em] transition-colors",
              filter === "all"
                ? "border-graphite bg-graphite text-bone"
                : "border-graphite/20 text-graphite/60 hover:border-graphite/50"
            )}
          >
            Wszystkie
          </button>
          {types.map((type) => (
            <button
              key={type.name}
              type="button"
              onClick={() => setFilter(type.name)}
              className={cn(
                "flex shrink-0 items-center gap-2 border px-4 py-2 text-[0.64rem] uppercase tracking-[0.14em] transition-colors",
                filter === type.name
                  ? "border-graphite bg-graphite text-bone"
                  : "border-graphite/20 text-graphite/60 hover:border-graphite/50"
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: type.color }}
                aria-hidden="true"
              />
              {type.name}
            </button>
          ))}
        </div>

        {/* Desktop */}
        <div className="mt-8 hidden gap-4 md:grid md:grid-cols-4 lg:grid-cols-7">
          {week.map((date) => {
            const daySessions = visible.filter((s) => s.date === date);
            return (
              <div key={date}>
                <div className="mb-4 border-b border-graphite/15 pb-3">
                  <p className="text-[0.66rem] uppercase tracking-[0.2em] text-graphite/45">
                    {weekdayShort(date)}
                  </p>
                  <p className="mt-1 font-heading text-lg">{date.slice(8, 10)}.{date.slice(5, 7)}</p>
                </div>
                <div className="space-y-3">
                  {daySessions.length === 0 && (
                    <p className="py-6 text-center text-[0.7rem] text-graphite/35">
                      brak zajęć
                    </p>
                  )}
                  {daySessions.map((s) => (
                    <SlotCard key={s.id} session={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="mt-8 md:hidden">
          {week.map((date, i) => {
            const daySessions = visible.filter((s) => s.date === date);
            const isOpen = openDay === i;
            return (
              <div key={date} className="border-b border-graphite/15">
                <button
                  type="button"
                  onClick={() => setOpenDay(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-heading text-xl">{weekdayLong(date)}</span>
                    <span className="text-[0.68rem] uppercase tracking-[0.14em] text-graphite/40">
                      {date.slice(8, 10)}.{date.slice(5, 7)}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.12em] text-graphite/45">
                    {daySessions.length} {daySessions.length === 1 ? "zajęcia" : "zajęć"}
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
                {isOpen && (
                  <div className="space-y-3 pb-5">
                    {daySessions.length === 0 && (
                      <p className="py-2 text-[0.8rem] text-graphite/45">
                        W tym dniu nie ma zaplanowanych zajęć.
                      </p>
                    )}
                    {daySessions.map((s) => (
                      <SlotCard key={s.id} session={s} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="mt-8 text-center text-sm text-graphite/50">
            Brak zajęć w wybranym filtrze. Zmień filtr lub zajrzyj do pełnego grafiku.
          </p>
        )}
        {!compact && (
          <p className="mt-10 text-[0.72rem] uppercase tracking-[0.16em] text-graphite/40">
            Zajęcia prowadzi Paula Kruszyńska
          </p>
        )}
      </div>
    </section>
  );
}