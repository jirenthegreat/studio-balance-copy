import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { seedDemoData, generateSessions } from "@/lib/server-fns";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { useCollection } from "@/lib/useCollection";
import { addDays, formatDatePl, isoDate } from "@/lib/booking-format";
import { PageTitle, PanelCard, PBadge, PEmpty, PLoading } from "@/components/panel/ui";

export const Route = createFileRoute("/_authed/panel/")({
  component: Dashboard,
});

function mondayOf(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return isoDate(d);
}

function Dashboard() {
  const today = isoDate(new Date());
  const tomorrow = addDays(today, 1);
  const monday = mondayOf(today);
  const sunday = addDays(monday, 6);

  const { items: sessions, loading } = useCollection(
    "ClassSession",
    { date: { $gte: today, $lte: tomorrow }, status: "zaplanowane" },
    { sort: "date" }
  );
  const { items: todayBookings } = useCollection("Booking", {
    session_date: { $in: [today, tomorrow] },
  });
  const { items: weekSessions } = useCollection("ClassSession", {
    date: { $gte: monday, $lte: sunday },
  });
  const { items: weekBookings } = useCollection("Booking", {
    session_date: { $gte: monday, $lte: sunday },
  });
  const { items: pending } = useCollection(
    "PersonalBooking",
    { status: "oczekuje" },
    { sort: "date" }
  );

  const bySession = useMemo(() => {
    const map = {};
    todayBookings.forEach((b) => {
      if (!["potwierdzona", "obecna", "lista_rezerwowa"].includes(b.status)) return;
      map[b.session_id] = map[b.session_id] || [];
      map[b.session_id].push(b);
    });
    return map;
  }, [todayBookings]);

  const weekCount = weekBookings.filter((b) =>
    ["potwierdzona", "obecna"].includes(b.status)
  ).length;

  const todayList = sessions.filter((s) => s.date === today);
  const tomorrowList = sessions.filter((s) => s.date === tomorrow);

  return (
    <div>
      <PageTitle subtitle={formatDatePl(today)}>Dzień dobry, Paulo</PageTitle>

      {!weekSessions.length && <SeedCard />}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Zajęcia dziś i jutro" value={sessions.length} />
        <Stat label="Zapisy w tym tygodniu" value={weekCount} />
        <Stat label="Treningi do potwierdzenia" value={pending.length} accent />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <PanelCard title="Dzisiaj" description={formatDatePl(today)}>
          {loading ? (
            <PLoading />
          ) : todayList.length ? (
            <div className="space-y-4">
              {todayList.map((session) => (
                <SessionBlock key={session.id} session={session} bookings={bySession[session.id] || []} />
              ))}
            </div>
          ) : (
            <PEmpty>Dziś nie ma zaplanowanych zajęć.</PEmpty>
          )}
        </PanelCard>

        <PanelCard title="Jutro" description={formatDatePl(tomorrow)}>
          {loading ? (
            <PLoading />
          ) : tomorrowList.length ? (
            <div className="space-y-4">
              {tomorrowList.map((session) => (
                <SessionBlock key={session.id} session={session} bookings={bySession[session.id] || []} />
              ))}
            </div>
          ) : (
            <PEmpty>Jutro nie ma zaplanowanych zajęć.</PEmpty>
          )}
        </PanelCard>
      </div>

      <PanelCard
        className="mt-5"
        title="Treningi personalne do potwierdzenia"
        action={
          <Link to="/panel/treningi" className="flex items-center gap-1 text-[0.7rem] uppercase tracking-[0.12em] text-graphite/50 hover:text-graphite">
            Wszystkie <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        {pending.length ? (
          <ul className="divide-y divide-graphite/10">
            {pending.slice(0, 5).map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-[0.9rem]">
                    {item.first_name} {item.last_name}
                  </p>
                  <p className="text-[0.75rem] text-graphite/50">
                    {formatDatePl(item.date)}, {item.time}
                  </p>
                </div>
                <PBadge tone="rose">oczekuje</PBadge>
              </li>
            ))}
          </ul>
        ) : (
          <PEmpty>Brak zgłoszeń oczekujących na potwierdzenie.</PEmpty>
        )}
      </PanelCard>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className={`border p-5 ${accent ? "border-rose/30 bg-rose/[0.06]" : "border-graphite/12 bg-bone"}`}>
      <p className="font-heading text-[2.1rem] leading-none">{value}</p>
      <p className="mt-2 text-[0.68rem] uppercase tracking-[0.14em] text-graphite/45">
        {label}
      </p>
    </div>
  );
}

function SessionBlock({ session, bookings }) {
  const confirmed = bookings.filter((b) => b.status === "potwierdzona" || b.status === "obecna");
  const waitlist = bookings.filter((b) => b.status === "lista_rezerwowa");

  return (
    <div className="border border-graphite/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.95rem]">{session.class_name}</p>
          <p className="text-[0.72rem] text-graphite/50">
            {session.time} · {session.instructor_name}
          </p>
        </div>
        <PBadge tone={confirmed.length >= (session.capacity || 4) ? "rose" : "green"}>
          {confirmed.length}/{session.capacity || 4}
        </PBadge>
      </div>

      {confirmed.length ? (
        <ul className="mt-3 space-y-1.5">
          {confirmed.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-2 text-[0.82rem]">
              <span className="truncate">
                {b.first_name} {b.last_name}
              </span>
              <span className="flex shrink-0 gap-2 text-graphite/40">
                <a href={`tel:${b.phone}`} aria-label={`Zadzwoń do ${b.first_name}`}>
                  <Phone className="h-3.5 w-3.5" />
                </a>
                <a href={`mailto:${b.email}`} aria-label={`Napisz do ${b.first_name}`}>
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[0.78rem] text-graphite/40">Brak zapisanych osób.</p>
      )}

      {waitlist.length > 0 && (
        <p className="mt-2 text-[0.72rem] text-graphite/45">
          Lista rezerwowa: {waitlist.map((b) => b.first_name).join(", ")}
        </p>
      )}
    </div>
  );
}

/** Widoczne, gdy w tym tygodniu nie ma żadnych zajęć (np. świeża kopia aplikacji). */
function SeedCard() {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const run = async () => {
    setState("busy");
    setError("");
    try {
      await seedDemoData();
      await generateSessions({ data: { weeks: 4 } });
      setState("done");
      window.location.reload();
    } catch (err) {
      setState("idle");
      setError(err?.message || "Nie udało się wypełnić danych.");
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-sage/15 p-5">
      <p className="font-medium">Grafik jest pusty</p>
      <p className="mt-1 text-sm text-graphite/70">
        Uzupełnij puste tabele danymi startowymi: ofertą, grafikiem cyklicznym na
        4 tygodnie, opiniami z Google i cennikiem. Istniejące dane zostają bez zmian.
      </p>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <button
        type="button"
        onClick={run}
        disabled={state !== "idle"}
        className="btn btn-primary mt-4"
      >
        {state === "busy" ? "Wypełniam…" : "Wypełnij danymi startowymi"}
      </button>
    </div>
  );
}
