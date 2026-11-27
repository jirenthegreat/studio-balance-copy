import { useEffect, useMemo, useState } from "react";
import { Loader2, CalendarDays, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import BookingSuccess from "@/components/booking/BookingSuccess";
import { createPersonalBookingRequest, getPersonalAvailability } from "@/lib/server-fns";
import { addDays, formatDatePl, isWeekend, weekdayShort } from "@/lib/booking-format";
import { cn } from "@/lib/utils";

const EMPTY = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  goal: "",
  terms: false,
  consent: false,
};

export default function PersonalBookingFlow({ instructors = [], today }) {
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || "");
  const [date, setDate] = useState(() => {
    let d = today;
    for (let i = 0; i < 10; i += 1) {
      if (!isWeekend(d)) return d;
      d = addDays(d, 1);
    }
    return today;
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");
  const [type, setType] = useState("solo");
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const days = useMemo(() => {
    const out = [];
    let d = today;
    for (let i = 0; i < 24 && out.length < 12; i += 1) {
      if (!isWeekend(d)) out.push(d);
      d = addDays(d, 1);
    }
    return out;
  }, [today]);

  useEffect(() => {
    if (!instructorId || !date) return;
    let alive = true;
    setLoading(true);
    setTime("");
    getPersonalAvailability({ data: { instructorId, date } })
      .then((res) => {
        if (alive) setSlots(res?.slots || []);
      })
      .catch(() => alive && setSlots([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [instructorId, date]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!time) {
      setError("Wybierz godzinę treningu.");
      return;
    }
    if (!form.terms || !form.consent) {
      setError("Zaznacz obie zgody, aby wysłać zgłoszenie.");
      return;
    }
    setError("");
    setSending(true);
    // Lokalny podgląd: przykładowa trenerka, bez zapisu do bazy.
    if (instructorId.startsWith("demo-")) {
      await new Promise((r) => setTimeout(r, 600));
      setResult({
        date,
        time,
        training_type: type,
        instructor: instructors.find((i) => i.id === instructorId)?.name,
      });
      setSending(false);
      return;
    }
    try {
      const res = await createPersonalBookingRequest({
        data: {
          instructor_id: instructorId,
          date,
          time,
          training_type: type,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          email: form.email,
          goal: form.goal,
          consent: true,
        },
      });
      if (!res?.ok) {
        setError(res?.error || "Nie udało się wysłać zgłoszenia.");
        return;
      }
      setResult(res.booking);
    } catch (err) {
      setError("Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub zadzwoń: 730 730 357.");
    } finally {
      setSending(false);
    }
  };

  if (result) {
    return (
      <div className="step-enter rounded-[28px] bg-linen p-7 md:p-10">
        <BookingSuccess />
        <h2 className="mt-6 text-[1.8rem] leading-tight md:text-[2.1rem]">
          Zgłoszenie <em>przyjęte.</em>
        </h2>
        <p className="mt-3 max-w-md text-[0.92rem] leading-[1.8] text-graphite/65">
          Termin jest wstępnie zarezerwowany. Paula potwierdzi go mailem.
        </p>
        <dl className="mt-7 space-y-3 rounded-2xl bg-bone/70 p-5 text-[0.9rem]">
          <div className="flex justify-between gap-6">
            <dt className="text-[0.8rem] text-graphite/45">Termin</dt>
            <dd className="text-right">{formatDatePl(result.date)}, {result.time}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-[0.8rem] text-graphite/45">Trenerka</dt>
            <dd className="text-right">{result.instructor}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-[0.8rem] text-graphite/45">Forma</dt>
            <dd className="text-right">{result.training_type === "para" ? "W parze" : "Indywidualnie"}</dd>
          </div>
        </dl>
        <p className="mt-6 text-[0.8rem] leading-relaxed text-graphite/50">
          Płatność na miejscu. Jeśli musisz zmienić termin, odpisz na maila
          potwierdzającego lub zadzwoń: 730 730 357.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      {instructors.length > 1 && (
        <Step number="01" title="Wybierz trenerkę">
          <div className="flex flex-wrap gap-3">
            {instructors.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => setInstructorId(person.id)}
                className={cn(
                  "rounded-full px-5 py-3 text-[0.92rem] transition-colors",
                  instructorId === person.id
                    ? "bg-graphite text-linen"
                    : "bg-linen text-graphite/75 hover:bg-[#fffdfa]"
                )}
              >
                {person.name}
              </button>
            ))}
          </div>
        </Step>
      )}

      <Step number={instructors.length > 1 ? "02" : "01"} title="Wybierz dzień">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {days.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDate(d)}
              className={cn(
                "flex w-[74px] shrink-0 flex-col items-center rounded-2xl px-2 py-3 transition-colors",
                date === d
                  ? "bg-graphite text-linen"
                  : "bg-linen text-graphite hover:bg-[#fffdfa]"
              )}
            >
              <span className="text-[0.82rem] opacity-70">
                {weekdayShort(d)}
              </span>
              <span className="mt-1 text-[1.35rem] font-medium leading-none tracking-[-0.03em]">
                {d.slice(8, 10)}
              </span>
              <span className="mt-1 text-[0.75rem] opacity-60">
                {d.slice(5, 7)}.{d.slice(2, 4)}
              </span>
            </button>
          ))}
        </div>
      </Step>

      <Step number={instructors.length > 1 ? "03" : "02"} title="Wybierz godzinę">
        {loading ? (
          <p className="flex items-center gap-2 text-[0.85rem] text-graphite/50">
            <Loader2 className="h-4 w-4 animate-spin" /> Sprawdzamy wolne terminy…
          </p>
        ) : slots.length ? (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={cn(
                  "min-h-[46px] rounded-full px-5 text-[0.95rem] transition-colors",
                  time === slot
                    ? "bg-sage text-linen"
                    : "bg-linen text-graphite/80 hover:bg-sage/20"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <p className="flex items-center gap-2 rounded-2xl bg-linen px-5 py-4 text-[0.85rem] text-graphite/60">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Brak wolnych terminów tego dnia. Wybierz inny dzień.
          </p>
        )}
        <p className="mt-3 flex items-center gap-2 text-[0.85rem] text-graphite/40">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Trening trwa 60 minut.
        </p>
      </Step>

      <Step number={instructors.length > 1 ? "04" : "03"} title="Twoje dane">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Imię" id="p-first">
            <input id="p-first" required className="input" value={form.first_name} onChange={update("first_name")} autoComplete="given-name" />
          </Field>
          <Field label="Nazwisko" id="p-last">
            <input id="p-last" required className="input" value={form.last_name} onChange={update("last_name")} autoComplete="family-name" />
          </Field>
          <Field label="Telefon" id="p-phone">
            <input id="p-phone" type="tel" required className="input" value={form.phone} onChange={update("phone")} autoComplete="tel" />
          </Field>
          <Field label="E-mail" id="p-email">
            <input id="p-email" type="email" required className="input" value={form.email} onChange={update("email")} autoComplete="email" />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { value: "solo", label: "Indywidualnie" },
            { value: "para", label: "W parze" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={cn(
                "min-h-[46px] rounded-full px-5 text-[0.92rem] transition-colors",
                type === option.value
                  ? "bg-graphite text-linen"
                  : "bg-linen text-graphite/75 hover:bg-[#fffdfa]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Field label="Twój cel / przeciwwskazania zdrowotne" id="p-goal">
            <textarea
              id="p-goal"
              rows={4}
              className="input resize-none"
              placeholder="Np. wzmocnienie pleców, powrót po ciąży, kontuzja kolana…"
              value={form.goal}
              onChange={update("goal")}
            />
          </Field>
        </div>

        <label className="mt-4 flex items-start gap-3 text-[0.85rem] leading-relaxed text-graphite/65">
          <Checkbox
            checked={form.terms}
            onCheckedChange={(v) => setForm((f) => ({ ...f, terms: v === true }))}
            className="mt-0.5 border-graphite/40"
            aria-label="Akceptacja regulaminu"
          />
          <span>Akceptuję regulamin zajęć Studio Balance.</span>
        </label>

        <label className="mt-3 flex items-start gap-3 text-[0.85rem] leading-relaxed text-graphite/65">
          <Checkbox
            checked={form.consent}
            onCheckedChange={(v) => setForm((f) => ({ ...f, consent: v === true }))}
            className="mt-0.5 border-graphite/40"
            aria-label="Zgoda RODO"
          />
          <span>
            Wyrażam zgodę na przetwarzanie danych osobowych w celu obsługi
            rezerwacji, zgodnie z polityką prywatności.
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-4 text-[0.82rem] leading-relaxed text-destructive">
            {error}
          </p>
        )}

        <button type="submit" disabled={sending} className="btn btn-primary mt-6 w-full sm:w-auto">
          {sending && <Loader2 className="h-4 w-4 animate-spin" />}
          {sending ? "Wysyłanie…" : "Wyślij zgłoszenie"}
        </button>
        <p className="mt-3 text-[0.85rem] text-graphite/45">
          Termin jest wstępny — potwierdzimy go mailem.
        </p>
      </Step>
    </form>
  );
}

function Step({ number, title, children }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/20 text-[0.85rem] font-medium text-graphite">{Number(number)}</span>
        <h2 className="text-[1.5rem] leading-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, id, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.8rem] text-graphite/50"
      >
        {label}
      </label>
      {children}
    </div>
  );
}