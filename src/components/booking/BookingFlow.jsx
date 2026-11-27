import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, CalendarDays, Clock, User } from "lucide-react";
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

export default function BookingFlow({ session }) {
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
    } catch (err) {
      setError("Nie udało się zapisać. Spróbuj ponownie lub zadzwoń: 730 730 357.");
    } finally {
      setSending(false);
    }
  };

  if (result) {
    const waitlist = result.status === "lista_rezerwowa";
    return (
      <div className="step-enter site-card p-7 md:p-10">
        <BookingSuccess />
        <h2 className="mt-6 text-[1.8rem] leading-tight md:text-[2.1rem]">
          {waitlist ? "Jesteś na liście rezerwowej" : "Twoje miejsce jest zarezerwowane"}
        </h2>
        <p className="mt-3 max-w-md text-[0.92rem] leading-[1.8] text-ink/65">
          {waitlist
            ? "Grupa jest pełna, ale zapisaliśmy Cię na listę. Jeśli ktoś odwoła udział, napiszemy do Ciebie od razu."
            : "Do zobaczenia w studiu. Szczegóły poniżej — wysłaliśmy je też mailem."}
        </p>

        <dl className="mt-7 space-y-3 border-t border-ink/10 pt-6 text-[0.9rem]">
          <Row label="Zajęcia" value={result.booking.class_name} />
          <Row label="Termin" value={`${formatShortPl(result.booking.date)}, ${result.booking.time}`} />
          <Row label="Prowadząca" value={result.booking.instructor} />
          <Row label="Zapisana osoba" value={result.booking.first_name} />
        </dl>

        <div className="mt-7 rounded-[16px] bg-clay p-5">
          <p className="text-[0.78rem] leading-relaxed text-ink/70">
            Rezerwację możesz odwołać do {session.cancellation_hours} godzin przed
            zajęciami, korzystając z linku w mailu:
          </p>
          <Link
            to="/odwolaj/$token"
            params={{ token: result.booking.cancel_token }}
            className="mt-3 inline-block break-all text-[0.78rem] underline underline-offset-4"
          >
            Odwołaj tę rezerwację
          </Link>
        </div>

        {!result.emailSent && (
          <p className="mt-4 text-[0.78rem] leading-relaxed text-ink/50">
            Mail z potwierdzeniem nie został jeszcze dostarczony — zapisz link
            powyżej, żeby móc odwołać rezerwację.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/grafik" className="btn btn-outline">
            Wróć do grafiku
          </Link>
          <Link to="/" className="btn btn-primary">
            Strona główna
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
      <aside className="h-fit rounded-[20px] bg-clay p-6 md:sticky md:top-28">
        <span
          className="block h-[3px] w-12"
          style={{ backgroundColor: session.color || "#B9788F" }}
          aria-hidden="true"
        />
        <h2 className="mt-5 text-[1.7rem] leading-tight">{session.name}</h2>
        <ul className="mt-5 space-y-3 text-[0.88rem] text-ink/70">
          <li className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-leaf" aria-hidden="true" />
            {formatShortPl(session.date)}
          </li>
          <li className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-leaf" aria-hidden="true" />
            {session.time} · {session.duration} min
          </li>
          <li className="flex items-center gap-3">
            <User className="h-4 w-4 text-leaf" aria-hidden="true" />
            {session.instructor}
          </li>
        </ul>
        <p className="mt-5 border-t border-ink/15 pt-4 text-[0.75rem] uppercase tracking-[0.14em] text-ink/50">
          {full
            ? "Grupa pełna — lista rezerwowa"
            : `${session.free} z ${session.capacity} miejsc wolnych`}
        </p>
        <p className="mt-3 text-[0.78rem] leading-relaxed text-ink/55">
          Płatność na miejscu. Odwołanie możliwe do{" "}
          {session.cancellation_hours} h przed zajęciami.
        </p>
      </aside>

      <form onSubmit={submit} className="space-y-4">
        <h2 className="text-[1.6rem] leading-tight">
          {full ? "Zapisz się na listę rezerwową" : "Twoje dane"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Imię" id="b-first">
            <input id="b-first" required className="input" value={form.first_name} onChange={update("first_name")} autoComplete="given-name" />
          </Field>
          <Field label="Nazwisko" id="b-last">
            <input id="b-last" required className="input" value={form.last_name} onChange={update("last_name")} autoComplete="family-name" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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

        <label className="flex items-start gap-3 text-[0.78rem] leading-relaxed text-ink/65">
          <Checkbox
            checked={form.terms}
            onCheckedChange={(v) => setForm((f) => ({ ...f, terms: v === true }))}
            className="mt-0.5 border-ink/40"
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

        <label className="flex items-start gap-3 text-[0.78rem] leading-relaxed text-ink/65">
          <Checkbox
            checked={form.consent}
            onCheckedChange={(v) => setForm((f) => ({ ...f, consent: v === true }))}
            className="mt-0.5 border-ink/40"
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
      <dt className="text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">
        {label}
      </dt>
      <dd className="text-right text-ink/80">{value}</dd>
    </div>
  );
}

function Field({ label, id, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.16em] text-ink/50"
      >
        {label}
      </label>
      {children}
    </div>
  );
}