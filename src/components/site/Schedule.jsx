import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import SectionHeading from "./SectionHeading";
import BookingSheet from "@/components/booking/BookingSheet";
import { addDays, isoDate } from "@/lib/booking-format";
import { cn } from "@/lib/utils";

const DAY_SHORT = ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sob"];
const DAY_LONG = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

// Dane przykładowe, gdy w bazie nie ma jeszcze zajęć. weekday: 1 = poniedziałek.
export const SAMPLE_SESSIONS = [
  { id: "demo-1", weekday: 1, time: "10:00", name: "Pilates + relaksacja", color: "#C98F86", duration: 60, instructor: "Paula", capacity: 4, booked: 2 },
  { id: "demo-2", weekday: 2, time: "10:00", name: "Fit Mama", color: "#D4A48C", duration: 55, instructor: "Paula", capacity: 4, booked: 3 },
  { id: "demo-3", weekday: 3, time: "18:00", name: "Spinning Fit", color: "#C9A27A", duration: 50, instructor: "Paula", capacity: 4, booked: 4 },
  { id: "demo-4", weekday: 4, time: "18:00", name: "Stretching", color: "#8FA2A6", duration: 55, instructor: "Paula", capacity: 4, booked: 1 },
  { id: "demo-5", weekday: 4, time: "19:15", name: "Trening obwodowy", color: "#A8A07A", duration: 50, instructor: "Paula", capacity: 4, booked: 0 },
  { id: "demo-6", weekday: 5, time: "18:00", name: "Pilates + relaksacja", color: "#C98F86", duration: 60, instructor: "Paula", capacity: 4, booked: 1 },
];

const dayOf = (date) => new Date(`${date}T12:00:00`).getDay();
const dm = (date) => `${date.slice(8, 10)}.${date.slice(5, 7)}`;

function mondayOf(date) {
  const day = dayOf(date);
  return addDays(date, day === 0 ? -6 : 1 - day);
}

function demoSessions(monday, weeks = 2) {
  const out = [];
  for (let w = 0; w < weeks; w += 1) {
    SAMPLE_SESSIONS.forEach((s) => {
      out.push({
        ...s,
        id: `${s.id}-${w}`,
        date: addDays(monday, w * 7 + s.weekday - 1),
        is_demo: true,
        booked: w === 0 ? s.booked : Math.max(0, s.booked - 2),
      });
    });
  }
  return out;
}

/** Pastelowe tło karteczki z koloru typu zajęć. */
export function tint(color, amount = 26) {
  return `color-mix(in srgb, ${color || "#C98F86"} ${amount}%, #FBF7F2)`;
}

function Seats({ capacity, booked }) {
  return (
    <span className="flex gap-[3px]" aria-hidden="true">
      {Array.from({ length: capacity }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-[7px] w-[7px] rounded-full",
            i < booked ? "bg-graphite/70" : "border border-graphite/35"
          )}
        />
      ))}
    </span>
  );
}

function seatsLabel(free) {
  if (free === 0) return "Brak miejsc, lista rezerwowa";
  if (free === 1) return "Zostało 1 miejsce";
  return `Zostały ${free} miejsca`;
}

function ClassCard({ session, onOpen, large = false, past = false }) {
  const capacity = session.capacity ?? 4;
  const booked = Math.min(capacity, session.booked ?? 0);
  const free = capacity - booked;
  const full = free === 0;

  return (
    <button
      type="button"
      disabled={past}
      onClick={() => onOpen(session)}
      aria-label={`${session.name}, ${session.time}. ${past ? "Zajęcia już się odbyły" : seatsLabel(free)}`}
      className={cn(
        "group relative flex w-full flex-col rounded-xl border-l-[3px] text-left transition-all duration-300",
        large ? "gap-1.5 p-4" : "gap-1 p-3",
        past
          ? "cursor-default opacity-40"
          : "hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(43,29,26,0.45)]",
        full && !past && "saturate-[0.4]"
      )}
      style={{ background: tint(session.color), borderLeftColor: session.color || "#C98F86" }}
    >
      <span className={cn("text-graphite/55", large ? "text-[0.85rem]" : "text-[0.74rem]")}>
        {session.time} · {session.duration} min
      </span>
      <span className={cn("font-medium leading-tight tracking-[-0.02em]", large ? "text-[1.15rem]" : "text-[0.92rem]")}>
        {session.name}
      </span>
      <span className={cn("text-graphite/60", large ? "text-[0.85rem]" : "text-[0.74rem]")}>
        prowadzi {session.instructor || "Paula"}
      </span>
      <span className="mt-1.5 flex items-center justify-between gap-2">
        <Seats capacity={capacity} booked={booked} />
        {!past && (
          <span
            className={cn(
              "text-[0.74rem] font-medium transition-opacity",
              large ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
            )}
          >
            {full ? "Lista rezerwowa" : "Zapisz się"}
          </span>
        )}
      </span>
    </button>
  );
}

export default function Schedule({
  sessions = [],
  showAllLink = true,
  demo = true,
  title = "Grafik *tygodnia*",
  intro = "W każdej grupie są najwyżej cztery osoby. Wybierz zajęcia i zapisz się bez zakładania konta.",
}) {
  const [today, setToday] = useState(null);
  const [week, setWeek] = useState(0);
  const [filter, setFilter] = useState("all");
  const [mobileDay, setMobileDay] = useState(null);
  const [active, setActive] = useState(null);
  const [extra, setExtra] = useState({});

  // Data liczona w przeglądarce, żeby render serwera i klienta się zgadzały.
  useEffect(() => {
    setToday(isoDate(new Date()));
  }, []);

  const baseMonday = useMemo(() => mondayOf(today || "2026-01-05"), [today]);

  const source = useMemo(() => {
    const list = sessions.length ? sessions : demo ? demoSessions(baseMonday) : [];
    return list.map((s) => (extra[s.id] ? { ...s, booked: (s.booked ?? 0) + extra[s.id] } : s));
  }, [sessions, demo, baseMonday, extra]);

  const types = useMemo(() => {
    const map = new Map();
    source.forEach((s) => map.has(s.name) || map.set(s.name, s.color));
    return Array.from(map, ([name, color]) => ({ name, color }));
  }, [source]);

  // Gdy w tym tygodniu nie zostało już nic do zapisu, startujemy od następnego.
  const [autoWeek, setAutoWeek] = useState(false);
  useEffect(() => {
    if (!today || autoWeek) return;
    setAutoWeek(true);
    const sunday = addDays(baseMonday, 6);
    const upcoming = source.some((s) => s.date >= today && s.date <= sunday);
    if (!upcoming) setWeek(1);
  }, [today, autoWeek, baseMonday, source]);

  const monday = addDays(baseMonday, week * 7);
  const visible = source.filter(
    (s) =>
      s.date >= monday &&
      s.date <= addDays(monday, 6) &&
      (filter === "all" || s.name === filter)
  );

  // Pn–Pt zawsze, weekend tylko gdy są zajęcia.
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i)).filter(
    (d, i) => i < 5 || visible.some((s) => s.date === d)
  );
  const times = Array.from(new Set(visible.map((s) => s.time))).sort();

  const firstUpcoming =
    days.find((d) => d >= (today || "") && visible.some((s) => s.date === d)) || days[0];
  const selectedDay = days.includes(mobileDay) ? mobileDay : firstUpcoming;
  const daySessions = visible
    .filter((s) => s.date === selectedDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  const isPast = (s) => !!today && `${s.date}T${s.time}` < `${today}T${nowTime()}`;

  const pill = (on) =>
    cn(
      "shrink-0 rounded-full px-4 py-2 text-[0.88rem] transition-colors",
      on ? "bg-graphite text-linen" : "bg-graphite/[0.06] text-graphite/70 hover:bg-graphite/10"
    );

  return (
    <section id="grafik" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading title={title} />
          <p className="max-w-xs text-[0.95rem] leading-relaxed text-graphite/60 md:text-right">
            {intro}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-graphite/[0.06] p-1" role="group" aria-label="Wybór tygodnia">
            {["Ten tydzień", "Następny"].map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setWeek(i)}
                aria-pressed={week === i}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[0.88rem] transition-colors",
                  week === i ? "bg-linen text-graphite shadow-sm" : "text-graphite/60"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
            <button type="button" onClick={() => setFilter("all")} className={pill(filter === "all")}>
              Wszystkie
            </button>
            {types.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setFilter(t.name)}
                className={cn(pill(filter === t.name), "flex items-center gap-2")}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: t.color }} aria-hidden="true" />
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: siatka tygodnia */}
        <div className="mt-6 hidden overflow-hidden rounded-[24px] bg-linen md:block">
          <div
            className="grid"
            style={{ gridTemplateColumns: `4.5rem repeat(${days.length}, minmax(0, 1fr))` }}
          >
            <div />
            {days.map((d) => (
              <div
                key={d}
                className={cn(
                  "border-l border-graphite/[0.07] px-3 py-4 text-center",
                  d === today && "bg-sage/10"
                )}
              >
                <p className="text-[0.95rem] font-medium">{DAY_SHORT[dayOf(d)]}</p>
                <p className="text-[0.78rem] text-graphite/45">{d === today ? "dziś" : dm(d)}</p>
              </div>
            ))}

            {times.map((time) => (
              <Row key={time} time={time} days={days} today={today}>
                {(d) =>
                  visible
                    .filter((s) => s.date === d && s.time === time)
                    .map((s) => (
                      <ClassCard key={s.id} session={s} onOpen={setActive} past={isPast(s)} />
                    ))
                }
              </Row>
            ))}
          </div>
          {!times.length && <Empty onNext={week === 0 ? () => setWeek(1) : null} />}
        </div>

        {/* Mobile: pigułki dni + lista */}
        <div className="mt-6 md:hidden">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="tablist" aria-label="Dzień tygodnia">
            {days.map((d) => {
              const count = visible.filter((s) => s.date === d).length;
              const on = d === selectedDay;
              return (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setMobileDay(d)}
                  className={cn(
                    "flex min-w-[3.6rem] shrink-0 flex-col items-center rounded-2xl px-3 py-2.5 transition-colors",
                    on ? "bg-graphite text-linen" : "bg-linen text-graphite"
                  )}
                >
                  <span className="text-[0.9rem] font-medium">{DAY_SHORT[dayOf(d)]}</span>
                  <span className={cn("text-[0.72rem]", on ? "text-linen/70" : "text-graphite/45")}>{dm(d)}</span>
                  <span
                    className={cn("mt-1 h-1 w-1 rounded-full", count ? (on ? "bg-linen" : "bg-graphite/50") : "bg-transparent")}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-[0.9rem] text-graphite/55">
            {selectedDay && `${DAY_LONG[dayOf(selectedDay)]}, ${dm(selectedDay)}`}
          </p>
          <div className="mt-3 space-y-2.5">
            {daySessions.map((s) => (
              <ClassCard key={s.id} session={s} onOpen={setActive} large past={isPast(s)} />
            ))}
            {!daySessions.length && (
              <div className="rounded-2xl bg-linen px-5 py-8 text-center text-[0.92rem] text-graphite/55">
                Tego dnia nie ma zajęć. Wybierz inny dzień powyżej.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="font-hand text-[1.35rem] -rotate-1 text-rose">
            Pierwszy raz? Napisz o tym w uwagach, Paula pomoże.
          </p>
          {showAllLink && (
            <Link to="/trening-personalny" className="btn btn-outline">
              Wolisz trening 1:1?
            </Link>
          )}
        </div>
      </div>

      <BookingSheet
        session={active}
        onClose={() => setActive(null)}
        onBooked={(id) => setExtra((e) => ({ ...e, [id]: (e[id] || 0) + 1 }))}
      />
    </section>
  );
}

function Row({ time, days, today, children }) {
  return (
    <>
      <div className="border-t border-graphite/[0.07] px-3 py-3 text-right text-[0.78rem] text-graphite/45">
        {time}
      </div>
      {days.map((d) => (
        <div
          key={d}
          className={cn(
            "min-h-[7.5rem] space-y-2 border-l border-t border-graphite/[0.07] p-2",
            d === today && "bg-sage/10"
          )}
        >
          {children(d)}
        </div>
      ))}
    </>
  );
}

function Empty({ onNext }) {
  return (
    <div className="border-t border-graphite/[0.07] px-6 py-14 text-center">
      <p className="text-[1.05rem]">W tym tygodniu nie ma już zajęć w tym filtrze.</p>
      {onNext && (
        <button type="button" onClick={onNext} className="btn btn-outline mt-5">
          Pokaż następny tydzień
        </button>
      )}
    </div>
  );
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
