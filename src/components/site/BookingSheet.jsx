import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarPlus, Check, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Seats } from "./ClassCard";
import { withInstructor } from "./schedule-data";
import { createGroupBooking } from "@/lib/server-fns";
import { formatShortPl } from "@/lib/booking-format";
import { downloadIcs } from "@/lib/ics";
import { CONTACT } from "@/lib/images";
import { cn } from "@/lib/utils";

const EMPTY = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  notes: "",
  terms: false,
  consent: false,
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function Field({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.72rem] text-ink/50">
        {label}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-[0.78rem] text-ink/45">{label}</dt>
      <dd className="text-right text-[0.88rem] text-ink/80">{value}</dd>
    </div>
  );
}

function BookingPanel({ session, onBooked, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const full = session.booked >= session.capacity;
  const free = Math.max(0, session.capacity - session.booked);

  const update = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.terms || !form.consent) {
      setError("Zaznacz obie zgody, aby dokończyć rezerwację.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = session.is_demo
        ? {
            ok: true,
            status: full ? "lista_rezerwowa" : "potwierdzona",
            emailSent: false,
            booking: {
              class_name: session.name,
              date: session.date,
              time: session.time,
              instructor: session.instructor,
              first_name: form.first_name,
              cancel_token: null,
            },
          }
        : await createGroupBooking({
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
      onBooked(res);
    } catch {
      setError(
        "Nie udało się zapisać. Spróbuj ponownie lub zadzwoń: 730 730 357."
      );
    } finally {
      setSending(false);
    }
  };

  if (result) {
    const waitlist = result.status === "lista_rezerwowa";

    return (
      <div className="p-6 md:p-8">
        <div className="step-enter text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/25">
            <Check className="h-8 w-8 text-ink" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-[1.7rem] leading-tight tracking-[-0.02em] text-ink">
            {waitlist ? "Jesteś na liście rezerwowej" : "Do zobaczenia na macie!"}
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-[0.88rem] leading-relaxed text-ink/55">
            {waitlist
              ? "Grupa jest pełna, ale zapisaliśmy Cię na listę. Jeśli ktoś odwoła udział, odezwiemy się od razu."
              : "Twoje miejsce jest zarezerwowane. Szczegóły wysłaliśmy też mailem."}
          </p>
        </div>

        <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-5">
          <SummaryRow label="Zajęcia" value={result.booking.class_name} />
          <SummaryRow
            label="Termin"
            value={`${formatShortPl(result.booking.date)}, ${result.booking.time}`}
          />
          <SummaryRow
            label="Prowadząca"
            value={withInstructor(result.booking.instructor)}
          />
          <SummaryRow label="Zapisana osoba" value={result.booking.first_name} />
        </dl>

        {session.is_demo && (
          <p className="mt-4 text-[0.75rem] leading-relaxed text-ink/40">
            To zajęcia przykładowe — rezerwacja nie została zapisana w studiu.
          </p>
        )}

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() =>
              downloadIcs({
                title: `${session.name} — Studio Balance`,
                description: `Zajęcia w Studio Balance. Prowadzi ${session.instructor}.`,
                location: `Studio Balance, ${CONTACT.street}, ${CONTACT.city}`,
                date: session.date,
                time: session.time,
                duration: session.duration || 60,
              })
            }
            className="btn btn-outline btn-no-arrow w-full justify-center"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Dodaj do kalendarza
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary w-full justify-center"
          >
            Wróć do grafiku
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: session.style.edge }}
        aria-hidden="true"
      />

      <div className="p-6 pr-12 md:p-8 md:pr-12">
        <p className="text-[0.78rem] text-ink/45">{session.style.label}</p>
        <h3 className="mt-1.5 text-[1.55rem] leading-tight tracking-[-0.02em] text-ink">
          {session.name}
        </h3>
        <p className="mt-2 text-[0.88rem] text-ink/60">
          {formatShortPl(session.date)} · {session.time} ·{" "}
          {session.duration} min
        </p>
        <p className="text-[0.88rem] text-ink/60">
          prowadzi {withInstructor(session.instructor)}
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-[14px] bg-clay/70 px-4 py-3">
          <Seats booked={session.booked} capacity={session.capacity} />
          <span className="text-[0.82rem] text-ink/60">
            {free === 0
              ? "Grupa pełna — lista rezerwowa"
              : `Zostały ${free} ${free === 1 ? "miejsce" : "miejsca"}`}
          </span>
        </div>

        <div className="mt-6 space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="Imię" id="sheet-first">
              <input
                id="sheet-first"
                required
                className="input"
                value={form.first_name}
                onChange={update("first_name")}
                autoComplete="given-name"
              />
            </Field>
            <Field label="Nazwisko" id="sheet-last">
              <input
                id="sheet-last"
                required
                className="input"
                value={form.last_name}
                onChange={update("last_name")}
                autoComplete="family-name"
              />
            </Field>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="Telefon" id="sheet-phone">
              <input
                id="sheet-phone"
                type="tel"
                required
                className="input"
                value={form.phone}
                onChange={update("phone")}
                autoComplete="tel"
              />
            </Field>
            <Field label="E-mail" id="sheet-email">
              <input
                id="sheet-email"
                type="email"
                required
                className="input"
                value={form.email}
                onChange={update("email")}
                autoComplete="email"
              />
            </Field>
          </div>

          <Field label="Uwagi (opcjonalnie)" id="sheet-notes">
            <textarea
              id="sheet-notes"
              rows={3}
              className="input resize-none"
              placeholder="Kontuzja, ciąża, pierwszy raz u nas — daj nam znać."
              value={form.notes}
              onChange={update("notes")}
            />
          </Field>

          <label className="flex items-start gap-2.5 text-[0.76rem] leading-relaxed text-ink/60">
            <Checkbox
              checked={form.terms}
              onCheckedChange={(value) =>
                setForm((prev) => ({ ...prev, terms: value === true }))
              }
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

          <label className="flex items-start gap-2.5 text-[0.76rem] leading-relaxed text-ink/60">
            <Checkbox
              checked={form.consent}
              onCheckedChange={(value) =>
                setForm((prev) => ({ ...prev, consent: value === true }))
              }
              className="mt-0.5 border-ink/40"
              aria-label="Zgoda RODO"
            />
            <span>
              Wyrażam zgodę na przetwarzanie moich danych osobowych w celu
              realizacji rezerwacji, zgodnie z{" "}
              <Link
                to="/polityka-prywatnosci"
                className="underline underline-offset-2"
              >
                polityką prywatności
              </Link>
              .
            </span>
          </label>

          {error && (
            <p role="alert" className="text-[0.8rem] leading-relaxed text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="btn btn-primary w-full justify-center"
          >
            {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {sending
              ? "Zapisywanie…"
              : full
                ? "Zapisz na listę rezerwową"
                : "Potwierdź rezerwację"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function BookingSheet({ session, onClose, onBooked }) {
  const isMobile = useIsMobile();

  return (
    <Sheet open={!!session} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "overflow-y-auto border-ink/10 bg-surface p-0",
          isMobile
            ? "max-h-[92svh] w-full rounded-t-[24px]"
            : "w-full sm:max-w-[460px]"
        )}
      >
        <SheetTitle className="sr-only">
          {session ? `Rezerwacja: ${session.name}` : "Rezerwacja zajęć"}
        </SheetTitle>
        {session && (
          <BookingPanel
            key={session.id}
            session={session}
            onBooked={onBooked}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}