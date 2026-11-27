import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useCollection, saveRecord, removeRecord } from "@/lib/useCollection";
import { PageTitle, PanelCard, PField, PEmpty, PLoading, PBadge, SMALL_BTN } from "@/components/panel/ui";

export const Route = createFileRoute("/_authed/panel/oferta")({
  component: OfertaPanel,
});

const BLANK = {
  name: "",
  description: "",
  duration: 60,
  level: "",
  for_whom: "",
  price: "",
  color: "#B9788F",
  icon: "flower",
  is_group: true,
  active: true,
  order: 99,
};

function OfertaPanel() {
  const { items, loading, reload } = useCollection(
    "ClassType",
    {},
    { sort: "order" }
  );
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageTitle
        subtitle="Karty widoczne w sekcji „Oferta” na stronie."
        action={
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="inline-flex min-h-[38px] items-center gap-1.5 bg-graphite px-3 text-[0.68rem] uppercase tracking-[0.1em] text-bone"
          >
            <Plus className="h-3.5 w-3.5" /> Nowe zajęcia
          </button>
        }
      >
        Oferta
      </PageTitle>

      {creating && (
        <PanelCard className="mb-5" title="Nowa pozycja w ofercie">
          <TypeForm
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
            {items.map((type) => (
              <li key={type.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-7 w-[3px]"
                      style={{ backgroundColor: type.color || "#B9788F" }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[0.9rem]">
                        {type.name}
                        {!type.active && (
                          <span className="ml-2 text-[0.65rem] uppercase tracking-[0.1em] text-graphite/40">
                            ukryte
                          </span>
                        )}
                      </p>
                      <p className="text-[0.72rem] text-graphite/45">
                        {type.duration} min · {type.level || "—"} ·{" "}
                        {type.price ? `${type.price} zł` : "cena nieuzupełniona"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PBadge tone={type.is_group === false ? "sand" : "green"}>
                      {type.is_group === false ? "indywidualne" : "grupowe"}
                    </PBadge>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(editing === type.id ? null : type.id);
                        setCreating(false);
                      }}
                      className={SMALL_BTN}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edytuj
                    </button>
                  </div>
                </div>

                {editing === type.id && (
                  <div className="mt-4 border-t border-graphite/10 pt-4">
                    <TypeForm
                      initial={type}
                      onCancel={() => setEditing(null)}
                      onSaved={async () => {
                        setEditing(null);
                        await reload();
                      }}
                      onDelete={async () => {
                        if (!window.confirm(`Usunąć „${type.name}” z oferty?`)) return;
                        await removeRecord("ClassType", type.id);
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
          <PEmpty>Nie masz jeszcze żadnej pozycji w ofercie.</PEmpty>
        )}
      </PanelCard>
    </div>
  );
}

function TypeForm({ initial, onSaved, onCancel, onDelete }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
    duration: initial.duration || 60,
    level: initial.level || "",
    for_whom: initial.for_whom || "",
    quote: initial.quote || "",
    price: initial.price ?? "",
    color: initial.color || "#B9788F",
    icon: initial.icon || "flower",
    is_group: initial.is_group !== false,
    active: initial.active !== false,
    order: initial.order ?? 99,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveRecord("ClassType", initial.id, {
        ...form,
        duration: Number(form.duration) || 60,
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
        <PField label="Czas trwania (min)">
          <input type="number" className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        </PField>
      </div>
      <PField label="Opis">
        <textarea rows={2} className="input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </PField>
      <div className="grid gap-3 sm:grid-cols-3">
        <PField label="Poziom">
          <input className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="np. średni" />
        </PField>
        <PField label="Cena (zł)">
          <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="opcjonalnie" />
        </PField>
        <PField label="Kolejność">
          <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
        </PField>
      </div>
      <PField label="Dla kogo">
        <input className="input" value={form.for_whom} onChange={(e) => setForm({ ...form, for_whom: e.target.value })} />
      </PField>
      <PField label="Wyróżniony cytat" hint="Opcjonalnie — np. krótka opinia klientki pod kafelkiem oferty.">
        <textarea rows={2} className="input resize-none" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
      </PField>
      <div className="grid gap-3 sm:grid-cols-2">
        <PField label="Kolor">
          <input type="color" className="input !p-1" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        </PField>
        <PField label="Ikona" hint="user, flower, bike, wind, activity, heart, baby">
          <input className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </PField>
      </div>
      <div className="flex flex-wrap gap-4 text-[0.8rem] text-graphite/65">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_group} onChange={(e) => setForm({ ...form, is_group: e.target.checked })} />
          Zajęcia grupowe (grafik)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Widoczne na stronie
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