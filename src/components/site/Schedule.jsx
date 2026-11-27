import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

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

function weekdayLong(date) {
  return WEEKDAY_LONG[new Date(`${date}T12:00:00`).getDay()];
}

function shortDate(date) {
  return `${date.slice(8, 10)}.${date.slice(5, 7)}`;
}

/** „Paula” → „Paulą”, inne imiona zostawiamy bez odmiany. */
function withInstructor(name) {
  const first = String(name || "Paula").trim().split(" ")[0];
  return /a$/i.test(first) ? `${first.slice(0, -1)}ą` : first;
}

function SlotRow({ session }) {
  const capacity = session.capacity ?? 4;
  const free = Math.max(0, capacity - (session.booked ?? 0));

  return (
    <div className="flex flex-col gap-3 border-t border-ink/[0.07] px-5 py-4 transition-colors hover:bg-surface/70 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
      <div className="flex shrink-0 items-baseline gap-2 sm:w-[8.5rem]">
        <span className="text-[1.05rem] font-medium tracking-[-0.02em] text-ink">
          {session.time}
        </span>
        <span className="text-[0.78rem] text-ink/40">
          · {session.duration} min
        </span>
      </div>

      <p className="flex-1 text-[0.95rem] leading-snug text-ink/75">
        <span className="text-ink/30">– </span>
        {session.name}
        <span className="text-ink/45">
          {" "}
          z {withInstructor(session.instructor)}
        </span>
      </p>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span
          className={cn(
            "site-pill !px-2.5 !py-1 !text-[0.7rem]",
            free === 0 ? "bg-blush/15 text-ink/60" : "bg-leaf/15 text-ink/55"
          )}
        >
          {free === 0 ? "lista rezerwowa" : `${free} z ${capacity} miejsc`}
        </span>

        <Link
          to="/rezerwacja/$sessionId"
          params={{ sessionId: session.id }}
          className="group/zapisz flex items-center gap-1.5 whitespace-nowrap text-[0.88rem] font-medium text-ink"
        >
          Zapisz
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/zapisz:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

const NOTES = [
  {
    text: "zabierz koleżankę!",
    className: "right-0 top-[4.5rem] -rotate-6 lg:right-[-1.5rem]",
  },
  {
    text: "pierwszy raz? spokojnie ✦",
    className: "bottom-[5.5rem] left-0 rotate-3 lg:left-[-2rem]",
  },
];

export default function Schedule({
  sessions = [],
  compact = false,
  showAllLink = true,
  demo = true,
  title = "Najbliższe *7 dni* w studiu.",
  intro = "Małe grupy, więc miejsca szybko znikają. Zapis trwa chwilę i nie wymaga zakładania konta.",
}) {
  const [filter, setFilter] = useState("all");

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
    <section id="grafik" className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
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
              "shrink-0 rounded-full px-4 py-2 text-[0.82rem] transition-colors",
              filter === "all"
                ? "bg-ink text-surface"
                : "bg-surface text-ink/60 hover:text-ink"
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
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[0.82rem] transition-colors",
                filter === type.name
                  ? "bg-ink text-surface"
                  : "bg-surface text-ink/60 hover:text-ink"
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

        <div className="relative mt-8">
          {NOTES.map((note) => (
            <span
              key={note.text}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute z-10 hidden font-hand text-[1.5rem] leading-none text-blush/85 xl:block",
                note.className
              )}
            >
              {note.text}
            </span>
          ))}

          <Reveal>
            <div className="site-card overflow-hidden">
              {week.map((date) => {
                const daySessions = visible.filter((s) => s.date === date);
                return (
                  <div key={date}>
                    <div className="flex items-baseline justify-between gap-4 bg-canvas/60 px-5 py-3 sm:px-6">
                      <p className="text-[0.86rem] font-medium tracking-[-0.01em] text-ink">
                        {weekdayLong(date)}
                        <span className="ml-2 font-normal text-ink/40">
                          {shortDate(date)}
                        </span>
                      </p>
                      <p className="text-[0.76rem] text-ink/40">
                        {daySessions.length === 0
                          ? "brak zajęć"
                          : `${daySessions.length} ${
                              daySessions.length === 1 ? "zajęcia" : "zajęć"
                            }`}
                      </p>
                    </div>
                    {daySessions.length === 0 ? (
                      <p className="border-t border-ink/[0.07] px-5 py-4 text-[0.85rem] text-ink/35 sm:px-6">
                        Tego dnia odpoczywamy.
                      </p>
                    ) : (
                      daySessions.map((s) => (
                        <SlotRow key={s.id} session={s} />
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 xl:hidden">
            {NOTES.map((note) => (
              <span
                key={note.text}
                aria-hidden="true"
                className="font-hand text-[1.35rem] leading-none text-blush/85 first:-rotate-3 last:rotate-2"
              >
                {note.text}
              </span>
            ))}
          </div>
        </div>

        {visible.length === 0 && (
          <p className="mt-8 text-center text-[0.9rem] text-ink/50">
            Brak zajęć w wybranym filtrze. Zmień filtr lub zajrzyj do pełnego grafiku.
          </p>
        )}
        {!compact && (
          <p className="mt-10 text-[0.84rem] text-ink/40">
            Zajęcia prowadzi Paula Kruszyńska
          </p>
        )}
      </div>
    </section>
  );
}