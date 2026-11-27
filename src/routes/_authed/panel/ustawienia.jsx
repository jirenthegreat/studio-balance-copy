import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "@/lib/useSettings";
import { PageTitle, PanelCard, PField, PLoading } from "@/components/panel/ui";

export const Route = createFileRoute("/_authed/panel/ustawienia")({
  component: UstawieniaPanel,
});

const EMAILS = [
  { label: "Potwierdzenie zapisu na zajęcia", s: "email_confirmation_subject", b: "email_confirmation_body" },
  { label: "Lista rezerwowa", s: "email_waitlist_subject", b: "email_waitlist_body" },
  { label: "Odwołanie rezerwacji", s: "email_cancel_subject", b: "email_cancel_body" },
  { label: "Przypomnienie dzień przed", s: "email_reminder_subject", b: "email_reminder_body" },
  { label: "Zgłoszenie treningu personalnego", s: "email_personal_subject", b: "email_personal_body" },
  { label: "Potwierdzenie treningu personalnego", s: "email_personal_confirmed_subject", b: "email_personal_confirmed_body" },
];

function UstawieniaPanel() {
  const { settings, loading, save } = useSettings();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setForm({
      cancellation_hours: settings.cancellation_hours ?? 12,
      default_capacity: settings.default_capacity ?? 4,
      senior_note: settings.senior_note || "",
      ...Object.fromEntries(
        EMAILS.flatMap((e) => [
          [e.s, settings[e.s] || ""],
          [e.b, settings[e.b] || ""],
        ])
      ),
    });
  }, [settings?.id]);

  const submit = async (e) => {
    e.preventDefault();
    await save({
      ...form,
      cancellation_hours: Number(form.cancellation_hours) || 12,
      default_capacity: Number(form.default_capacity) || 4,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading || !form) {
    return (
      <div>
        <PageTitle>Ustawienia</PageTitle>
        <PanelCard>
          <PLoading />
        </PanelCard>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <PageTitle subtitle="Zasady rezerwacji i treści wiadomości wysyłanych do klientek.">
        Ustawienia
      </PageTitle>

      <div className="grid gap-5 lg:grid-cols-2">
        <PanelCard title="Rezerwacje">
          <div className="grid gap-3 sm:grid-cols-2">
            <PField label="Odwołanie najpóźniej (godz.)" hint="Przed rozpoczęciem zajęć">
              <input
                type="number"
                min="0"
                className="input"
                value={form.cancellation_hours}
                onChange={(e) => setForm({ ...form, cancellation_hours: e.target.value })}
              />
            </PField>
            <PField label="Domyślna liczba miejsc">
              <input
                type="number"
                min="1"
                className="input"
                value={form.default_capacity}
                onChange={(e) => setForm({ ...form, default_capacity: e.target.value })}
              />
            </PField>
          </div>
          <PField label="Notka o Lubelskiej Karcie Seniora" className="mt-3">
            <textarea
              rows={3}
              className="input resize-none"
              value={form.senior_note}
              onChange={(e) => setForm({ ...form, senior_note: e.target.value })}
            />
          </PField>
        </PanelCard>

        <PanelCard title="Zmienne w mailach">
          <p className="text-[0.82rem] leading-relaxed text-graphite/60">
            W treści i temacie możesz użyć:{" "}
            <span className="text-graphite">{"{{imie}}"}</span>,{" "}
            <span className="text-graphite">{"{{zajecia}}"}</span>,{" "}
            <span className="text-graphite">{"{{data}}"}</span>,{" "}
            <span className="text-graphite">{"{{godzina}}"}</span>,{" "}
            <span className="text-graphite">{"{{instruktor}}"}</span>,{" "}
            <span className="text-graphite">{"{{godziny}}"}</span>,{" "}
            <span className="text-graphite">{"{{link}}"}</span>.
          </p>
          <p className="mt-3 text-[0.78rem] leading-relaxed text-graphite/45">
            Link do anulowania rezerwacji dodawany jest automatycznie jako przycisk
            w wiadomości.
          </p>
        </PanelCard>
      </div>

      <div className="mt-5 space-y-5">
        {EMAILS.map((email) => (
          <PanelCard key={email.s} title={email.label}>
            <div className="space-y-3">
              <PField label="Temat">
                <input
                  className="input"
                  value={form[email.s]}
                  onChange={(e) => setForm({ ...form, [email.s]: e.target.value })}
                />
              </PField>
              <PField label="Treść">
                <textarea
                  rows={4}
                  className="input resize-none"
                  value={form[email.b]}
                  onChange={(e) => setForm({ ...form, [email.b]: e.target.value })}
                />
              </PField>
            </div>
          </PanelCard>
        ))}
      </div>

      <div className="sticky bottom-0 mt-5 flex items-center gap-3 border-t border-graphite/10 bg-[#F3EFE8]/95 py-4">
        <button type="submit" className="btn btn-primary !min-h-[44px]">
          Zapisz ustawienia
        </button>
        {saved && <span className="text-[0.78rem] text-graphite/50">Zapisano.</span>}
      </div>
    </form>
  );
}