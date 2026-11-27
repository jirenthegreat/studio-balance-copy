import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, CalendarDays, Clock, User, CalendarPlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import BookingSuccess from "@/components/booking/BookingSuccess";
import { createGroupBooking } from "@/lib/server-fns";
import { formatShortPl } from "@/lib/booking-format";

const EMPTY = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  notes: "",
  terms: false,
  consent: false,
};

/** Plik .ics z terminem zajęć do dodania w kalendarzu telefonu. */
function icsHref(booking, duration = 60) {
  const start = new Date(`${booking.date}T${booking.time}:00`);
  const end = new Date(start.getTime() + duration * 60000);
  const fmt = (d) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Studio Balance//PL",
    "BEGIN:VEVENT",
    `UID:${booking.id || Date.now()}@studiobalance`,
    `DTSTART;TZID=Europe/Warsaw:${fmt(start)}`,
    `DTEND;TZID=Europe/Warsaw:${fmt(end)}`,
    `SUMMARY:${booking.class_name} — Studio Balance`,
    "LOCATION:Unia Art Residence\\, Aleje Racławickie 10/14 lok. 14\\, Lublin",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

export default function BookingFlow({ session, compact = false, onBooked, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const full = session.free === 0;
  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.terms || !form.consent) {
      setError("Zaznacz obie zgody, aby dokończyć rezerwację.");
      return;
    }
    setError("");
    setSending(true);
    // Termin przykładowy (pusta baza): pokazujemy przebieg bez zapisu.
    if (session.is_demo) {
      await new Promise((r) => setTimeout(r, 600));
      setResult({
        ok: true,
        demo: true,
        status: full ? "lista_rezerwowa" : "potwierdzona",
        emailSent: true,
        booking: {
          id: session.id,
          first_name: form.first_name,
          class_name: session.name,
          date: session.date,
          time: session.time,
          instructor: session.instructor,
          cancel_token: "",
        },
      });
      setSending(false);
      if (!full) onBooked?.(session.id);
      return;
    }
    try {
      const res = await createGroupBooking({
        data: {
          session_id: session.id,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          email: form.email,
          notes: form.notes,
          consent: true,
        },
      });
      if (!res?.ok) {
        setError(res?.error || "Nie udało się zapisać. Spróbuj ponownie.");
        return;
      }
      setResult(res);
      if (res.status !== "lista_rezerwowa") onBooked?.(session.id);
    } catch (err) {
      setError("Nie udało się zapisać. Spróbuj ponownie lub zadzwoń: 730 730 357.");
    } finally {
      setSending(false);
    }
  };

  if (result) {
    const waitlist = result.status === "lista_rezerwowa";
    return (
      <div className={compact ? "step-enter" : "step-enter rounded-[24px] bg-linen p-7 md:p-10"}>
        <BookingSuccess />
        <h2 className="mt-6 text-[1.8rem] leading-tight md:text-[2.1rem]">
          {waitlist ? "Jesteś na liście rezerwowej" : <>Do zobaczenia <em>na macie!</em></>}
        </h2>
        <p className="mt-3 max-w-md text-[0.92rem] leading-[1.8] text-graphite/65">
          {waitlist
            ? "Grupa jest pełna, ale zapisaliśmy Cię na listę. Jeśli ktoś odwoła udział, napiszemy do Ciebie od razu."
            : result.demo
              ? "Twoje miejsce jest zarezerwowane. To termin przykładowy, więc rezerwacja nie trafiła do bazy."
              : "Twoje miejsce jest zarezerwowane. Szczegóły wysłaliśmy też mailem."}
        </p>

        <dl className="mt-7 space-y-3 rounded-2xl bg-bone/70 p-5 text-[0.9rem]">
          <Row label="Zajęcia" value={result.booking.class_name} />
          <Row label="Termin" value={`${formatShortPl(result.booking.date)}, ${result.booking.time}`} />
          <Row label="Prowadząca" value={result.booking.instructor} />
          <Row label="Zapisana osoba" value={result.booking.first_name} />
        </dl>

        {!waitlist && (
          <a
            href={icsHref(result.booking, session.duration)}
            download="studio-balance.ics"
            className="btn btn-outline mt-4 w-full"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Dodaj do kalendarza
          </a>
        )}

        {result.booking.cancel_token && (
        <div className="mt-4 rounded-2xl bg-sage/10 p-5">
          <p className="text-[0.85rem] leading-relaxed text-graphite/70">
            Rezerwację możesz odwołać do {session.cancellation_hours} godzin przed
            zajęciami, korzystając z linku w mailu:
          </p>
          <Link
            to="/odwolaj/$token"
            params={{ token: result.booking.cancel_token }}
            className="mt-3 inline-block break-all text-[0.85rem] underline underline-offset-4"
          >
            Odwołaj tę rezerwację
          </Link>
        </div>
        )}

        {!result.emailSent && result.booking.cancel_token && (
          <p className="mt-4 text-[0.85rem] leading-relaxed text-graphite/50">
            Mail z potwierdzeniem nie został jeszcze dostarczony — zapisz link
            powyżej, żeby móc odwołać rezerwację.
          </p>
        )}

        {compact ? (
          <button type="button" onClick={onClose} className="btn btn-primary mt-6 w-full">
            Wróć do grafiku
          </button>
        ) : (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/grafik" className="btn btn-outline">
              Wróć do grafiku
            </Link>
            <Link to="/" className="btn btn-primary">
              Strona główna
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={compact ? "" : "grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12"}>
      {!compact && (
      <aside className="h-fit rounded-[24px] bg-linen p-6 md:sticky md:top-28">
        <span
          className="block h-[3px] w-12"
          style={{ backgroundColor: session.color || "#B9788F" }}
          aria-hidden="true"
        />
        <h2 className="mt-5 text-[1.7rem] leading-tight">{session.name}</h2>
        <ul className="mt-5 space-y-3 text-[0.88rem] text-graphite/70">
          <li className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-rose" aria-hidden="true" />
            {formatShortPl(session.date)}
          </li>
          <li className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-rose" aria-hidden="true" />
            {session.time} · {session.duration} min
          </li>
          <li className="flex items-center gap-3">
            <User className="h-4 w-4 text-rose" aria-hidden="true" />
            {session.instructor}
          </li>
        </ul>
        <p className="mt-5 border-t border-graphite/15 pt-4 text-[0.85rem] text-graphite/50">
          {full
            ? "Grupa pełna — lista rezerwowa"
            : `${session.free} z ${session.capacity} miejsc wolnych`}
        </p>
        <p className="mt-3 text-[0.85rem] leading-relaxed text-graphite/55">
          Płatność na miejscu. Odwołanie możliwe do{" "}
          {session.cancellation_hours} h przed zajęciami.
        </p>
      </aside>
      )}

      <form onSubmit={submit} className="space-y-4">
        {!compact && (
          <h2 className="text-[1.6rem] leading-tight">
            {full ? "Zapisz się na listę rezerwową" : "Twoje dane"}
          </h2>
        )}

        <div className={compact ? "grid grid-cols-2 gap-3" : "grid gap-4 sm:grid-cols-2"}>
          <Field label="Imię" id="b-first">
            <input id="b-first" required className="input" value={form.first_name} onChange={update("first_name")} autoComplete="given-name" />
          </Field>
          <Field label="Nazwisko" id="b-last">
            <input id="b-last" required className="input" value={form.last_name} onChange={update("last_name")} autoComplete="family-name" />
          </Field>
        </div>

        <div className={compact ? "grid grid-cols-2 gap-3" : "grid gap-4 sm:grid-cols-2"}>
          <Field label="Telefon" id="b-phone">
            <input id="b-phone" type="tel" required className="input" value={form.phone} onChange={update("phone")} autoComplete="tel" />
          </Field>
          <Field label="E-mail" id="b-email">
            <input id="b-email" type="email" required className="input" value={form.email} onChange={update("email")} autoComplete="email" />
          </Field>
        </div>

        <Field label="Uwagi (opcjonalnie)" id="b-notes">
          <textarea
            id="b-notes"
            rows={3}
            className="input resize-none"
            placeholder="Kontuzja, ciąża, pierwszy raz u nas — daj nam znać."
            value={form.notes}
            onChange={update("notes")}
          />
        </Field>

        <label className="flex items-start gap-3 text-[0.85rem] leading-relaxed text-graphite/65">
          <Checkbox
            checked={form.terms}
            onCheckedChange={(v) => setForm((f) => ({ ...f, terms: v === true }))}
            className="mt-0.5 border-graphite/40"
            aria-label="Akceptacja regulaminu"
          />
          <span>
            Akceptuję{" "}
            <Link to="/regulamin" className="underline underline-offset-2">
              regulamin zajęć
            </Link>{" "}
            Studio Balance.
          </span>
        </label>

        <label className="flex items-start gap-3 text-[0.85rem] leading-relaxed text-graphite/65">
          <Checkbox
            checked={form.consent}
            onCheckedChange={(v) => setForm((f) => ({ ...f, consent: v === true }))}
            className="mt-0.5 border-graphite/40"
            aria-label="Zgoda RODO"
          />
          <span>
            Wyrażam zgodę na przetwarzanie moich danych osobowych w celu
            realizacji rezerwacji, zgodnie z{" "}
            <Link to="/polityka-prywatnosci" className="underline underline-offset-2">
              polityką prywatności
            </Link>
            .
          </span>
        </label>

        {error && (
          <p role="alert" className="text-[0.82rem] leading-relaxed text-destructive">
            {error}
          </p>
        )}

        <button type="submit" disabled={sending} className="btn btn-primary w-full">
          {sending && <Loader2 className="h-4 w-4 animate-spin" />}
          {sending ? "Zapisywanie…" : full ? "Zapisz na listę rezerwową" : "Potwierdź rezerwację"}
        </button>
      </form>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-graphite/50">
        {label}
      </dt>
      <dd className="text-right text-graphite/80">{value}</dd>
    </div>
  );
}

function Field({ label, id, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.82rem] text-graphite/60"
      >
        {label}
      </label>
      {children}
    </div>
  );
}