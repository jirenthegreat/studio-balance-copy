import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, AlertCircle, Check } from "lucide-react";
import { cancelBookingByToken, getBookingByToken } from "@/lib/server-fns";
import { formatDatePl } from "@/lib/booking-format";

export const Route = createFileRoute("/_site/odwolaj/$token")({
  loader: ({ params }) => getBookingByToken({ data: { token: params.token } }),
  head: () => ({
    meta: [
      { title: "Twoja rezerwacja — Studio Balance" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CancelPage,
});

function CancelPage() {
  const booking = Route.useLoaderData();
  const { token } = Route.useParams();
  const [state, setState] = useState({ busy: false, done: false, error: "", promoted: null });

  const cancel = async () => {
    setState({ busy: true, done: false, error: "", promoted: null });
    try {
      const res = await cancelBookingByToken({ data: { token } });
      if (!res?.ok) {
        setState({ busy: false, done: false, error: res?.error || "Nie udało się odwołać.", promoted: null });
        return;
      }
      setState({ busy: false, done: true, error: "", promoted: res.promoted });
    } catch {
      setState({
        busy: false,
        done: false,
        error: "Nie udało się odwołać rezerwacji. Zadzwoń: 730 730 357.",
        promoted: null,
      });
    }
  };

  return (
    <section className="pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-xl px-5 md:px-10">
        {!booking ? (
          <div className="border border-graphite/15 bg-bone p-8 text-center">
            <h1 className="text-[1.7rem] leading-tight">Nie znaleźliśmy rezerwacji</h1>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-graphite/60">
              Link mógł wygasnąć lub rezerwacja została już odwołana. Jeśli
              potrzebujesz pomocy — zadzwoń: 730 730 357.
            </p>
            <Link to="/grafik" className="btn btn-outline mt-7">
              Wróć do grafiku
            </Link>
          </div>
        ) : state.done ? (
          <div className="border border-graphite/15 bg-bone p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/20 text-sage">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="mt-6 text-[1.8rem] leading-tight">Rezerwacja odwołana</h1>
            <p className="mt-3 text-[0.92rem] leading-[1.8] text-graphite/65">
              Miejsce wróciło do grafiku. Dziękujemy za informację — do
              zobaczenia na innym treningu.
            </p>
            {state.promoted && (
              <p className="mt-4 border border-sage/40 bg-sage/10 p-4 text-[0.82rem] text-graphite/70">
                O zwolnionym miejscu poinformowaliśmy osobę z listy rezerwowej.
              </p>
            )}
            <Link to="/grafik" className="btn btn-outline mt-7">
              Zobacz grafik
            </Link>
          </div>
        ) : (
          <div className="border border-graphite/15 bg-bone p-8">
            <p className="overline text-rose">Twoja rezerwacja</p>
            <h1 className="mt-4 text-[1.9rem] leading-tight">{booking.class_name}</h1>
            <dl className="mt-6 space-y-3 border-t border-graphite/10 pt-5 text-[0.9rem]">
              <div className="flex justify-between gap-6">
                <dt className="text-[0.68rem] uppercase tracking-[0.14em] text-graphite/45">Termin</dt>
                <dd className="text-right">{formatDatePl(booking.date)}, {booking.time}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-[0.68rem] uppercase tracking-[0.14em] text-graphite/45">Prowadząca</dt>
                <dd className="text-right">{booking.instructor}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-[0.68rem] uppercase tracking-[0.14em] text-graphite/45">Status</dt>
                <dd className="text-right capitalize">{booking.status.replace("_", " ")}</dd>
              </div>
            </dl>

            {booking.can_cancel ? (
              <>
                <p className="mt-6 text-[0.85rem] leading-relaxed text-graphite/60">
                  Rezerwację możesz odwołać do {booking.cancellation_hours} godzin
                  przed zajęciami.
                </p>
                <button
                  type="button"
                  onClick={cancel}
                  disabled={state.busy}
                  className="btn btn-primary mt-5 w-full"
                >
                  {state.busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {state.busy ? "Odwoływanie…" : "Odwołaj rezerwację"}
                </button>
              </>
            ) : (
              <div className="mt-6 flex items-start gap-3 border border-rose/30 bg-rose/[0.07] p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
                <p className="text-[0.82rem] leading-relaxed text-graphite/70">
                  Termin odwołania minął (próg {booking.cancellation_hours} h).
                  Jeśli nie możesz przyjść, zadzwoń: 730 730 357.
                </p>
              </div>
            )}

            {state.error && (
              <p role="alert" className="mt-4 text-[0.82rem] leading-relaxed text-destructive">
                {state.error}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}