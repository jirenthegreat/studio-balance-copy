import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Trash2, Plus } from "lucide-react";
import { useCollection, saveRecord, removeRecord } from "@/lib/useCollection";
import { addDays, formatDatePl, isoDate } from "@/lib/booking-format";
import { PageTitle, PanelCard, PBadge, PEmpty, PLoading, PField, SMALL_BTN } from "@/components/panel/ui";

export const Route = createFileRoute("/_authed/panel/klienci")({
  component: KlienciPanel,
});

function KlienciPanel() {
  const today = isoDate(new Date());
  const [search, setSearch] = useState("");
  const [pass, setPass] = useState({
    email: "",
    name: "",
    entries_total: 8,
    valid_until: addDays(today, 70),
  });
  const [saving, setSaving] = useState(false);

  const { items: bookings, loading } = useCollection(
    "Booking",
    { session_date: { $gte: addDays(today, -365) } },
    { sort: "-session_date" }
  );
  const { items: passes, reload: reloadPasses } = useCollection(
    "ClientPass",
    {},
    { sort: "-created_date" }
  );

  const clients = useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      const key = (b.email || "").toLowerCase();
      if (!key) return;
      const existing = map.get(key) || {
        email: key,
        name: `${b.first_name || ""} ${b.last_name || ""}`.trim(),
        phone: b.phone || "",
        visits: 0,
        last: "",
      };
      if (["potwierdzona", "obecna"].includes(b.status)) {
        existing.visits += 1;
        if (b.session_date > existing.last) existing.last = b.session_date;
      }
      if (!existing.phone && b.phone) existing.phone = b.phone;
      map.set(key, existing);
    });
    return Array.from(map.values()).sort((a, b) => (b.last || "").localeCompare(a.last || ""));
  }, [bookings]);

  const filtered = clients.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q);
  });

  const passFor = (email) =>
    passes.find(
      (p) =>
        (p.email || "").toLowerCase() === email &&
        (p.entries_total || 0) - (p.entries_used || 0) > 0
    );

  const addPass = async (e) => {
    e.preventDefault();
    if (!pass.email) return;
    setSaving(true);
    try {
      await saveRecord("ClientPass", null, {
        email: pass.email.toLowerCase(),
        name: pass.name,
        entries_total: Number(pass.entries_total) || 1,
        entries_used: 0,
        valid_until: pass.valid_until,
      });
      setPass({ ...pass, email: "", name: "" });
      await reloadPasses();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageTitle subtitle="Lista tworzy się automatycznie z rezerwacji.">
        Klientki
      </PageTitle>

      <div className="mb-4 flex items-center gap-2 border border-graphite/15 bg-bone px-3">
        <Search className="h-4 w-4 text-graphite/35" aria-hidden="true" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj po imieniu, mailu lub telefonie"
          className="min-h-[46px] w-full bg-transparent text-[0.85rem] outline-none"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <PanelCard title={`Klientki (${filtered.length})`}>
          {loading ? (
            <PLoading />
          ) : filtered.length ? (
            <ul className="divide-y divide-graphite/10">
              {filtered.map((client) => {
                const p = passFor(client.email);
                return (
                  <li key={client.email} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.88rem]">{client.name || client.email}</p>
                      <p className="truncate text-[0.72rem] text-graphite/45">
                        {client.email}
                        {client.phone ? ` · ${client.phone}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p && (
                        <PBadge tone="green">
                          karnet {(p.entries_total || 0) - (p.entries_used || 0)}
                        </PBadge>
                      )}
                      <span className="text-[0.72rem] text-graphite/45">
                        {client.visits} wejść
                        {client.last ? ` · ${formatDatePl(client.last).slice(-18)}` : ""}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <PEmpty>Brak klientek w bazie — pojawią się po pierwszej rezerwacji.</PEmpty>
          )}
        </PanelCard>

        <div className="space-y-5">
          <PanelCard title="Dodaj karnet" description="Ręcznie przypisz wejścia do adresu e-mail.">
            <form onSubmit={addPass} className="space-y-3">
              <PField label="E-mail klientki">
                <input
                  type="email"
                  required
                  className="input"
                  value={pass.email}
                  onChange={(e) => setPass({ ...pass, email: e.target.value })}
                />
              </PField>
              <PField label="Imię i nazwisko">
                <input
                  className="input"
                  value={pass.name}
                  onChange={(e) => setPass({ ...pass, name: e.target.value })}
                />
              </PField>
              <div className="grid grid-cols-2 gap-3">
                <PField label="Liczba wejść">
                  <input
                    type="number"
                    min="1"
                    className="input"
                    value={pass.entries_total}
                    onChange={(e) => setPass({ ...pass, entries_total: e.target.value })}
                  />
                </PField>
                <PField label="Ważny do">
                  <input
                    type="date"
                    className="input"
                    value={pass.valid_until}
                    onChange={(e) => setPass({ ...pass, valid_until: e.target.value })}
                  />
                </PField>
              </div>
              <button type="submit" disabled={saving} className="btn btn-primary !min-h-[44px] w-full">
                <Plus className="h-4 w-4" /> {saving ? "Zapisywanie…" : "Dodaj karnet"}
              </button>
            </form>
          </PanelCard>

          <PanelCard title="Aktywne karnety">
            {passes.length ? (
              <ul className="divide-y divide-graphite/10">
                {passes.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[0.82rem]">{p.name || p.email}</p>
                      <p className="text-[0.7rem] text-graphite/45">
                        {p.entries_total - (p.entries_used || 0)} z {p.entries_total} wejść
                        {p.valid_until ? ` · do ${p.valid_until}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await removeRecord("ClientPass", p.id);
                        await reloadPasses();
                      }}
                      aria-label="Usuń karnet"
                      className="text-graphite/35 hover:text-rose"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <PEmpty>Brak karnetów.</PEmpty>
            )}
          </PanelCard>
        </div>
      </div>
    </div>
  );
}