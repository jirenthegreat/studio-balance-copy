import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import BookingFlow from "@/components/booking/BookingFlow";
import { useIsMobile } from "@/hooks/use-mobile";
import { getSessionForBooking } from "@/lib/server-fns";
import { formatDatePl } from "@/lib/booking-format";
import { tint } from "@/components/site/Schedule";
import { cn } from "@/lib/utils";

const DEMO_CANCEL_HOURS = 12;

/** Panel zapisu wysuwany z prawej (desktop) lub od dołu (telefon). */
export default function BookingSheet({ session, onClose, onBooked }) {
  const isMobile = useIsMobile();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setDetails(null);
    setError("");
    if (!session) return;

    if (session.is_demo) {
      const capacity = session.capacity ?? 4;
      setDetails({
        ...session,
        capacity,
        free: Math.max(0, capacity - (session.booked ?? 0)),
        cancellation_hours: DEMO_CANCEL_HOURS,
      });
      return;
    }

    let cancelled = false;
    getSessionForBooking({ data: { sessionId: session.id } })
      .then((res) => {
        if (cancelled) return;
        if (res) setDetails({ ...res, is_demo: false });
        else setError("Tych zajęć nie ma już w grafiku. Wybierz inny termin.");
      })
      .catch(() => !cancelled && setError("Nie udało się wczytać zajęć. Spróbuj ponownie."));
    return () => {
      cancelled = true;
    };
  }, [session]);

  const open = !!session;
  const s = details || session;
  const capacity = s?.capacity ?? 4;
  const booked = Math.min(capacity, s?.booked ?? 0);
  const free = details ? details.free : capacity - booked;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "overflow-y-auto border-none bg-linen p-0",
          isMobile ? "max-h-[92svh] rounded-t-[28px]" : "w-full sm:max-w-[30rem]"
        )}
      >
        {s && (
          <>
            <div
              className="px-6 pb-6 pt-8"
              style={{ background: tint(s.color, 30) }}
            >
              {isMobile && (
                <span className="mx-auto -mt-4 mb-5 block h-1 w-10 rounded-full bg-graphite/20" aria-hidden="true" />
              )}
              <SheetTitle className="pr-8 text-[1.9rem] font-medium leading-[1.05] tracking-[-0.035em]">
                {s.name}
              </SheetTitle>
              <SheetDescription className="mt-2 text-[0.95rem] text-graphite/70">
                {formatDatePl(s.date)}, {s.time} · {s.duration} min · prowadzi {s.instructor || "Paula"}
              </SheetDescription>

              <div className="mt-5 flex items-center gap-3">
                <span className="flex gap-1" aria-hidden="true">
                  {Array.from({ length: capacity }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-3 w-3 rounded-full",
                        i < capacity - free ? "bg-graphite/75" : "border-[1.5px] border-graphite/40"
                      )}
                    />
                  ))}
                </span>
                <span className="text-[0.92rem] font-medium">
                  {free === 0
                    ? "Grupa pełna, zapiszesz się na listę rezerwową"
                    : free === 1
                      ? "Zostało ostatnie miejsce"
                      : `Wolne miejsca: ${free} z ${capacity}`}
                </span>
              </div>
            </div>

            <div className="px-6 pb-8 pt-6">
              {error ? (
                <p role="alert" className="text-[0.95rem] text-destructive">{error}</p>
              ) : details ? (
                <>
                  <BookingFlow
                    key={details.id}
                    session={details}
                    compact
                    onBooked={onBooked}
                    onClose={onClose}
                  />
                  <p className="mt-5 text-[0.82rem] leading-relaxed text-graphite/55">
                    Płatność na miejscu. Rezerwację odwołasz do {details.cancellation_hours} godzin
                    przed zajęciami, linkiem z maila.
                  </p>
                </>
              ) : (
                <p className="flex items-center gap-2 text-[0.92rem] text-graphite/60">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sprawdzam wolne miejsca…
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
