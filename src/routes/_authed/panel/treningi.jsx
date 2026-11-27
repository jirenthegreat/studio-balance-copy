import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Phone, Mail } from "lucide-react";
import { useCollection } from "@/lib/useCollection";
import { formatDatePl, isoDate } from "@/lib/booking-format";
import { cancelPersonalBooking, confirmPersonalBooking } from "@/lib/server-fns";
import { PageTitle, PanelCard, PBadge, PEmpty, PLoading, SMALL_BTN } from "@/components/panel/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/panel/treningi")({
  component: TreningiPanel,
});

const TABS = [
  { key: "oczekuje", label: "Oczekujące" },
  { key: "potwierdzona", label: "Potwierdzone" },
  { key: "odwolana", label: "Odwołane" },
  { key: "all", label: "Wszystkie" },
];

function TreningiPanel() {
  const [tab, setTab] = useState("oczekuje");
  const [busy, setBusy] = useState("");
  const today = isoDate(new Date());
  const { items, loading, reload } = useCollection(
    "PersonalBooking",
    tab === "all" ? {} : { status: tab },
    { sort: "date" }
  );

  const confirm = async (id) => {
    setBusy(id);
    try {
      const res = await confirmPersonalBooking({ data: { id } });
      await reload();
      if (!res?.emailSent) {
        window.alert("Trening potwierdzony. Mail do klientki nie został dostarczony.");
      }
    } finally {
      setBusy("");
    }
  };

  const cancel = async (id) => {
    if (!window.confirm("Odwołać ten trening?")) return;
    setBusy(id);
    try {
      await cancelPersonalBooking({ data: { id } });
      await reload();
    } finally {
      setBusy("");
    }
  };

  return (
    <div>
      <PageTitle subtitle="Zgłoszenia na treningi indywidualne i w parach.">
        Treningi 1:1
      </PageTitle>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "border px-3.5 py-2 text-[0.68rem] uppercase tracking-[0.12em] transition-colors",
              tab === t.key
                ? "border-graphite bg-graphite text-bone"
                : "border-graphite/20 text-graphite/60 hover:border-graphite/40"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <PanelCard>
        {loading ? (
          <PLoading />
        ) : items.length ? (
          <ul className="divide-y divide-graphite/10">
            {items.map((item) => {
              const past = item.date < today;
              return (
                <li key={item.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.95rem]">
                        {item.first_name} {item.last_name}
                        <span className="ml-2 text-[0.7rem] uppercase tracking-[0.1em] text-graphite/40">
                          {item.training_type === "para" ? "w parze" : "1:1"}
                        </span>
                      </p>
                      <p className="mt-0.5 text-[0.78rem] text-graphite/55">
                        {formatDatePl(item.date)}, {item.time} · {item.instructor_name}
                        {past && " · termin minął"}
                      </p>
                      <p className="mt-2 flex flex-wrap gap-3 text-[0.72rem] text-graphite/45">
                        <a href={`tel:${item.phone}`} className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {item.phone}
                        </a>
                        <a href={`mailto:${item.email}`} className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {item.email}
                        </a>
                      </p>
                      {item.goal && (
                        <p className="mt-2 max-w-xl border-l-2 border-rose/30 pl-3 text-[0.78rem] leading-relaxed text-graphite/60">
                          {item.goal}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <PBadge
                        tone={
                          item.status === "potwierdzona"
                            ? "green"
                            : item.status === "oczekuje"
                            ? "rose"
                            : "gray"
                        }
                      >
                        {item.status}
                      </PBadge>
                      <div className="flex gap-1.5">
                        {item.status === "oczekuje" && (
                          <button
                            type="button"
                            disabled={busy === item.id}
                            onClick={() => confirm(item.id)}
                            className={cn(SMALL_BTN, "border-sage/60")}
                          >
                            <Check className="h-3.5 w-3.5" /> Potwierdź
                          </button>
                        )}
                        {item.status !== "odwolana" && (
                          <button
                            type="button"
                            disabled={busy === item.id}
                            onClick={() => cancel(item.id)}
                            className={SMALL_BTN}
                          >
                            <X className="h-3.5 w-3.5" /> Odwołaj
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <PEmpty>Brak zgłoszeń w tej kategorii.</PEmpty>
        )}
      </PanelCard>
    </div>
  );
}