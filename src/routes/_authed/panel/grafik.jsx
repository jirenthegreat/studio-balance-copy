import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Download, Plus, RefreshCw, Trash2, Phone, Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useCollection, saveRecord, removeRecord } from "@/lib/useCollection";
import { addDays, formatDatePl, isoDate } from "@/lib/booking-format";
import { cancelSession, generateSessions, markAttendance } from "@/lib/server-fns";
import { PageTitle, PanelCard, PBadge, PEmpty, PLoading, PField, SMALL_BTN } from "@/components/panel/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/panel/grafik")({
  component: GrafikPanel,
});

function GrafikPanel() {
  const today = isoDate(new Date());
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const sessionsQuery = useMemo(
    () => ({ date: { $gte: today, $lte: addDays(today, 35) } }),
    [today]
  );
  const { items: sessions, loading, reload } = useCollection(
    "ClassSession",
    sessionsQuery,
    { sort: "date" }
  );
  const { items: bookings, reload: reloadBookings } = useCollection("Booking", {
    session_date: { $gte: today, $lte: addDays(today, 35) },
  });
  const { items: recurring, reload: reloadRecurring } = useCollection(
    "RecurringSlot",
    {},
    { sort: "weekday" }
  );
  const { items: types } = useCollection("ClassType", { active: true }, { sort: "order" });
  const { items: instructors } = useCollection("Instructor", { active: true }, { sort: "order" });

  const grouped = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      map[s.date] = map[s.date] || [];
      map[s.date].push(s);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [sessions]);

  const bookingsFor = (id) => bookings.filter((b) => b.session_id === id);

  const refreshAll = async () => {
    await Promise.all([reload(), reloadBookings(), reloadRecurring()]);
  };

  const handleAttendance = async (bookingId, status) => {
    setBusy(true);
    try {
      await markAttendance({ data: { bookingId, status } });
      await reloadBookings();
    } finally {
      setBusy(false);
    }
  };

  const handleCancelSession = async (session) => {
    const ok = window.confirm(
      `Odwołać zajęcia „${session.class_name}” ${formatDatePl(session.date)} o ${session.time}? Zapisane osoby dostaną maila.`
    );
    if (!ok) return;
    setBusy(true);
    try {
      const res = await cancelSession({ data: { id: session.id, reason: "" } });
      setInfo(
        `Zajęcia odwołane. Powiadomienia: ${res.emailed} z ${res.total} zapisanych osób.`
      );
      await refreshAll();
    } finally {
      setBusy(false);
    }
  };

  const handleGenerate = async () => {
    setBusy(true);
    try {
      const res = await generateSessions({ data: { weeks: 4 } });
      setInfo(
        res.created
          ? `Dodano ${res.created} nowych terminów na podstawie stałego planu.`
          : "Grafik jest już uzupełniony — nie było czego dodawać."
      );
      await refreshAll();
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = async () => {
    const rows = await base44.entities.Booking.filter(
      { session_date: { $gte: addDays(today, -90) } },
      { sort: "-session_date" }
    );
    const list = Array.isArray(rows) ? rows : rows?.items || [];
    const header = ["Data", "Godzina", "Zajęcia", "Imię", "Nazwisko", "Telefon", "E-mail", "Status", "Uwagi"];
    const body = list.map((b) => [
      b.session_date,
      b.session_time,
      b.class_name,
      b.first_name,
      b.last_name,
      b.phone || "",
      b.email,
      b.status,
      (b.notes || "").replace(/[\n;]/g, " "),
    ]);
    const csv = [header, ...body]
      .map((row) => row.map((cell) => `"${String(cell ?? "")}"`).join(";"))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rezerwacje-studio-balance-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageTitle
        subtitle="Terminy, listy zapisanych i obecność."
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleGenerate} disabled={busy} className={SMALL_BTN}>
              <RefreshCw className="h-3.5 w-3.5" /> Generuj 4 tygodnie
            </button>
            <button type="button" onClick={exportCsv} className={SMALL_BTN}>
              <Download className="h-3.5 w-3.5" /> Eksport CSV
            </button>
            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              className="inline-flex min-h-[38px] items-center gap-1.5 bg-graphite px-3 text-[0.68rem] uppercase tracking-[0.1em] text-bone"
            >
              <Plus className="h-3.5 w-3.5" /> Sesja
            </button>
          </div>
        }
      >
        Grafik
      </PageTitle>

      {info && (
        <p className="mb-4 border border-sage/40 bg-sage/10 px-4 py-3 text-[0.8rem] text-graphite/70">
          {info}
        </p>
      )}

      {showAdd && (
        <AddSessionForm
          types={types}
          instructors={instructors}
          onDone={async () => {
            setShowAdd(false);
            await refreshAll();
          }}
        />
      )}

      <PanelCard title="Najbliższe terminy" description="Kliknij termin, aby zobaczyć listę zapisanych.">
        {loading ? (
          <PLoading />
        ) : grouped.length ? (
          <div className="space-y-6">
            {grouped.map(([date, list]) => (
              <div key={date}>
                <p className="mb-2 text-[0.68rem] uppercase tracking-[0.16em] text-graphite/40">
                  {formatDatePl(date)}
                </p>
                <div className="divide-y divide-graphite/10 border border-graphite/10">
                  {list.map((session) => {
                    const list = bookingsFor(session.id);
                    const confirmed = list.filter((b) =>
                      ["potwierdzona", "obecna"].includes(b.status)
                    );
                    const waitlist = list.filter((b) => b.status === "lista_rezerwowa");
                    const isOpen = openId === session.id;
                    return (
                      <div key={session.id}>
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : session.id)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-8 w-[3px]"
                              style={{ backgroundColor: session.color || "#B9788F" }}
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-[0.9rem]">
                                {session.time} · {session.class_name}
                              </p>
                              <p className="text-[0.7rem] text-graphite/45">
                                {session.instructor_name}
                                {session.is_demo ? " · termin przykładowy" : ""}
                                {session.status === "odwolane" ? " · odwołane" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <PBadge tone={confirmed.length >= (session.capacity || 4) ? "rose" : "green"}>
                              {confirmed.length}/{session.capacity || 4}
                            </PBadge>
                            {waitlist.length > 0 && <PBadge tone="sand">+{waitlist.length} rezerwa</PBadge>}
                            <ChevronDown
                              className={cn("h-4 w-4 text-graphite/40 transition-transform", isOpen && "rotate-180")}
                            />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-graphite/10 bg-sand/20 px-4 py-4">
                            {list.length ? (
                              <ul className="space-y-2">
                                {list.map((booking) => (
                                  <li
                                    key={booking.id}
                                    className="flex flex-wrap items-center justify-between gap-2 border-b border-graphite/10 pb-2 last:border-b-0"
                                  >
                                    <div className="min-w-0">
                                      <p className="text-[0.85rem]">
                                        {booking.first_name} {booking.last_name}
                                        {booking.status === "lista_rezerwowa" && (
                                          <span className="ml-2 text-[0.65rem] uppercase tracking-[0.1em] text-rose">
                                            rezerwa
                                          </span>
                                        )}
                                      </p>
                                      <p className="flex flex-wrap items-center gap-3 text-[0.7rem] text-graphite/45">
                                        <a href={`tel:${booking.phone}`} className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" /> {booking.phone}
                                        </a>
                                        <a href={`mailto:${booking.email}`} className="flex items-center gap-1">
                                          <Mail className="h-3 w-3" /> {booking.email}
                                        </a>
                                      </p>
                                      {booking.notes && (
                                        <p className="mt-1 text-[0.72rem] italic text-graphite/50">
                                          „{booking.notes}”
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex gap-1.5">
                                      <button
                                        type="button"
                                        disabled={busy}
                                        onClick={() => handleAttendance(booking.id, "obecna")}
                                        className={cn(
                                          SMALL_BTN,
                                          booking.status === "obecna" && "border-sage bg-sage/25 text-graphite"
                                        )}
                                      >
                                        Obecna
                                      </button>
                                      <button
                                        type="button"
                                        disabled={busy}
                                        onClick={() => handleAttendance(booking.id, "nieobecna")}
                                        className={cn(
                                          SMALL_BTN,
                                          booking.status === "nieobecna" && "border-rose bg-rose/15 text-graphite"
                                        )}
                                      >
                                        Nieobecna
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-[0.8rem] text-graphite/45">Brak zapisanych osób.</p>
                            )}

                            {session.status !== "odwolane" && (
                              <button
                                type="button"
                                onClick={() => handleCancelSession(session)}
                                disabled={busy}
                                className="mt-4 text-[0.7rem] uppercase tracking-[0.12em] text-rose underline underline-offset-4"
                              >
                                Odwołaj te zajęcia
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PEmpty>
            Brak zaplanowanych terminów. Uzupełnij stały plan tygodnia i kliknij
            „Generuj 4 tygodnie”.
          </PEmpty>
        )}
      </PanelCard>

      <RecurringEditor
        recurring={recurring}
        types={types}
        instructors={instructors}
        onChanged={refreshAll}
      />
    </div>
  );
}

function AddSessionForm({ types, instructors, onDone }) {
  const [form, setForm] = useState({
    class_type_id: "",
    date: isoDate(new Date()),
    time: "10:00",
    capacity: 4,
    instructor_id: instructors[0]?.id || "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const type = types.find((t) => t.id === form.class_type_id) || types[0];
    const instructor = instructors.find((i) => i.id === form.instructor_id) || instructors[0];
    if (!type) return;
    setSaving(true);
    try {
      await saveRecord("ClassSession", null, {
        class_type_id: type.id,
        class_name: type.name,
        color: type.color,
        duration: type.duration,
        instructor_id: instructor?.id || "",
        instructor_name: instructor?.name || "",
        instructor_photo: instructor?.photo || "",
        date: form.date,
        time: form.time,
        capacity: Number(form.capacity) || 4,
        status: "zaplanowane",
        is_demo: false,
      });
      await onDone();
    } finally {
      setSaving(false);
    }
  };

  return (
    <PanelCard className="mb-5" title="Nowa sesja">
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <PField label="Zajęcia">
          <select
            className="input"
            value={form.class_type_id}
            onChange={(e) => setForm({ ...form, class_type_id: e.target.value })}
          >
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </PField>
        <PField label="Data">
          <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </PField>
        <PField label="Godzina">
          <input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </PField>
        <PField label="Miejsca">
          <input type="number" min="1" max="20" className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </PField>
        <PField label="Prowadząca">
          <select className="input" value={form.instructor_id} onChange={(e) => setForm({ ...form, instructor_id: e.target.value })}>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </PField>
        <div className="sm:col-span-2 lg:col-span-5">
          <button type="submit" disabled={saving} className="btn btn-primary !min-h-[42px]">
            {saving ? "Zapisywanie…" : "Dodaj sesję"}
          </button>
        </div>
      </form>
    </PanelCard>
  );
}

function RecurringEditor({ recurring, types, instructors, onChanged }) {
  const [form, setForm] = useState({
    class_type_id: "",
    weekday: 1,
    time: "10:00",
    capacity: 4,
  });

  const add = async (e) => {
    e.preventDefault();
    const type = types.find((t) => t.id === form.class_type_id) || types[0];
    const instructor = instructors[0];
    if (!type) return;
    await saveRecord("RecurringSlot", null, {
      class_type_id: type.id,
      class_name: type.name,
      color: type.color,
      duration: type.duration,
      instructor_id: instructor?.id || "",
      instructor_name: instructor?.name || "",
      instructor_photo: instructor?.photo || "",
      weekday: Number(form.weekday),
      time: form.time,
      capacity: Number(form.capacity) || 4,
      active: true,
    });
    await onChanged();
  };

  const WEEKDAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

  return (
    <PanelCard
      className="mt-5"
      title="Stały plan tygodnia"
      description="Z tego planu generowane są terminy na kolejne tygodnie."
    >
      {recurring.length ? (
        <ul className="mb-5 divide-y divide-graphite/10 border border-graphite/10">
          {recurring.map((slot) => (
            <li key={slot.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div>
                <p className="text-[0.85rem]">
                  {WEEKDAYS[slot.weekday - 1] || slot.weekday}, {slot.time} · {slot.class_name}
                </p>
                <p className="text-[0.7rem] text-graphite/45">
                  {slot.instructor_name} · {slot.capacity} miejsc
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await removeRecord("RecurringSlot", slot.id);
                  await onChanged();
                }}
                aria-label="Usuń z planu"
                className="text-graphite/35 hover:text-rose"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <PEmpty>Stały plan jest pusty.</PEmpty>
      )}

      <form onSubmit={add} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <PField label="Zajęcia">
          <select className="input" value={form.class_type_id} onChange={(e) => setForm({ ...form, class_type_id: e.target.value })}>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </PField>
        <PField label="Dzień">
          <select className="input" value={form.weekday} onChange={(e) => setForm({ ...form, weekday: e.target.value })}>
            {WEEKDAYS.map((d, i) => (
              <option key={d} value={i + 1}>
                {d}
              </option>
            ))}
          </select>
        </PField>
        <PField label="Godzina">
          <input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </PField>
        <PField label="Miejsca">
          <input type="number" min="1" max="20" className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </PField>
        <div className="flex items-end">
          <button type="submit" className="btn btn-outline !min-h-[48px] w-full">
            Dodaj do planu
          </button>
        </div>
      </form>
    </PanelCard>
  );
}