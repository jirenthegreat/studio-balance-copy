import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCollection, saveRecord, removeRecord } from "@/lib/useCollection";
import { useSettings } from "@/lib/useSettings";
import { PageTitle, PanelCard, PField, PEmpty, PLoading, SMALL_BTN } from "@/components/panel/ui";

export const Route = createFileRoute("/_authed/panel/cennik")({
  component: CennikPanel,
});

const BLANK = {
  name: "",
  description: "",
  price: "",
  unit: "karnet",
  featured: false,
  active: true,
  order: 99,
};

function CennikPanel() {
  const { items, loading, reload } = useCollection("PricingPlan", {}, { sort: "order" });
  const { settings, save, loading: settingsLoading } = useSettings();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [promo, setPromo] = useState(null);
  const [savedPromo, setSavedPromo] = useState(false);

  const promoState =
    promo ?? {
      promo_enabled: settings?.promo_enabled ?? true,
      promo_text: settings?.promo_text ?? "",
    };

  const savePromo = async () => {
    await save({
      promo_enabled: promoState.promo_enabled,
      promo_text: promoState.promo_text,
    });
    setSavedPromo(true);
    setTimeout(() => setSavedPromo(false), 2500);
  };

  return (
    <div>
      <PageTitle
        subtitle="Kwoty, karnety i baner promocyjny na stronie."
        action={
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="inline-flex min-h-[38px] items-center gap-1.5 bg-graphite px-3 text-[0.68rem] uppercase tracking-[0.1em] text-bone"
          >
            <Plus className="h-3.5 w-3.5" /> Nowa pozycja
          </button>
        }
      >
        Cennik
      </PageTitle>

      {creating && (
        <PanelCard className="mb-5" title="Nowa pozycja cennika">
          <PlanForm
            initial={BLANK}
            onCancel={() => setCreating(false)}
            onSaved={async () => {
              setCreating(false);
              await reload();
            }}
          />
        </PanelCard>
      )}

      <PanelCard>
        {loading ? (
          <PLoading />
        ) : items.length ? (
          <ul className="divide-y divide-graphite/10">
            {items.map((plan) => (
              <li key={plan.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[0.9rem]">
                      {plan.name}
                      {plan.featured && (
                        <span className="ml-2 text-[0.62rem] uppercase tracking-[0.1em] text-rose">
                          wyróżniona
                        </span>
                      )}
                    </p>
                    <p className="text-[0.72rem] text-graphite/45">
                      {plan.price ? `${plan.price} zł` : "cena nieuzupełniona"}
                      {plan.unit ? ` · ${plan.unit}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(editing === plan.id ? null : plan.id)}
                    className={SMALL_BTN}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edytuj
                  </button>
                </div>
                {editing === plan.id && (
                  <div className="mt-4 border-t border-graphite/10 pt-4">
                    <PlanForm
                      initial={plan}
                      onCancel={() => setEditing(null)}
                      onSaved={async () => {
                        setEditing(null);
                        await reload();
                      }}
                      onDelete={async () => {
                        if (!window.confirm(`Usunąć „${plan.name}” z cennika?`)) return;
                        await removeRecord("PricingPlan", plan.id);
                        setEditing(null);
                        await reload();
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <PEmpty>Cennik jest pusty.</PEmpty>
        )}
      </PanelCard>

      <PanelCard
        className="mt-5"
        title="Baner promocji"
        description="Wyświetla się nad cennikiem na stronie głównej."
      >
        {settingsLoading ? (
          <PLoading />
        ) : (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[0.82rem] text-graphite/70">
              <input
                type="checkbox"
                checked={promoState.promo_enabled}
                onChange={(e) =>
                  setPromo({ ...promoState, promo_enabled: e.target.checked })
                }
              />
              Pokazuj baner promocji
            </label>
            <PField label="Treść banera">
              <input
                className="input"
                value={promoState.promo_text || ""}
                onChange={(e) => setPromo({ ...promoState, promo_text: e.target.value })}
                placeholder="np. −50% na pierwszy trening personalny"
              />
            </PField>
            <div className="flex items-center gap-3">
              <button type="button" onClick={savePromo} className="btn btn-primary !min-h-[42px]">
                Zapisz baner
              </button>
              {savedPromo && (
                <span className="text-[0.75rem] text-graphite/50">Zapisano.</span>
              )}
            </div>
          </div>
        )}
      </PanelCard>
    </div>
  );
}

function PlanForm({ initial, onSaved, onCancel, onDelete }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
    price: initial.price ?? "",
    unit: initial.unit || "karnet",
    featured: !!initial.featured,
    active: initial.active !== false,
    order: initial.order ?? 99,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveRecord("PricingPlan", initial.id, {
        ...form,
        price: form.price === "" ? null : Number(form.price),
        order: Number(form.order) || 99,
      });
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <PField label="Nazwa">
          <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </PField>
        <PField label="Opis">
          <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </PField>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <PField label="Cena (zł)">
          <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </PField>
        <PField label="Jednostka">
          <input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="karnet / wejście" />
        </PField>
        <PField label="Kolejność">
          <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
        </PField>
      </div>
      <div className="flex flex-wrap gap-4 text-[0.8rem] text-graphite/65">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Wyróżnij
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Widoczna na stronie
        </label>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" disabled={saving} className="btn btn-primary !min-h-[42px]">
          {saving ? "Zapisywanie…" : "Zapisz"}
        </button>
        <button type="button" onClick={onCancel} className={SMALL_BTN}>
          Anuluj
        </button>
        {onDelete && (
          <button type="button" onClick={onDelete} className="ml-auto text-[0.7rem] uppercase tracking-[0.1em] text-rose">
            <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Usuń
          </button>
        )}
      </div>
    </form>
  );
}