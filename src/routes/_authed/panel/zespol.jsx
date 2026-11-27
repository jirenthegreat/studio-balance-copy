import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCollection, saveRecord, removeRecord } from "@/lib/useCollection";
import { PageTitle, PanelCard, PField, PEmpty, PLoading, SMALL_BTN } from "@/components/panel/ui";
import ImageUpload from "@/components/panel/ImageUpload";

export const Route = createFileRoute("/_authed/panel/zespol")({
  component: ZespolPanel,
});

const BLANK = {
  name: "",
  role: "Trenerka",
  photo: "",
  bio: "",
  specializations: "",
  certificate: "",
  certificate_issuer: "",
  email: "",
  phone: "",
  does_personal_training: true,
  active: true,
  order: 99,
};

function ZespolPanel() {
  const { items, loading, reload } = useCollection("Instructor", {}, { sort: "order" });
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageTitle
        subtitle="Przy jednej trenerce sekcja „Zespół” nie pojawia się na stronie."
        action={
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="inline-flex min-h-[38px] items-center gap-1.5 bg-graphite px-3 text-[0.68rem] uppercase tracking-[0.1em] text-bone"
          >
            <Plus className="h-3.5 w-3.5" /> Nowa osoba
          </button>
        }
      >
        Zespół
      </PageTitle>

      {creating && (
        <PanelCard className="mb-5" title="Nowa osoba w zespole">
          <PersonForm
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
            {items.map((person) => (
              <li key={person.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[0.9rem]">
                      {person.name}
                      {!person.active && (
                        <span className="ml-2 text-[0.62rem] uppercase tracking-[0.1em] text-graphite/40">
                          nieaktywna
                        </span>
                      )}
                    </p>
                    <p className="text-[0.72rem] text-graphite/45">
                      {person.role}
                      {person.does_personal_training ? " · treningi personalne" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(editing === person.id ? null : person.id)}
                    className={SMALL_BTN}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edytuj
                  </button>
                </div>
                {editing === person.id && (
                  <div className="mt-4 border-t border-graphite/10 pt-4">
                    <PersonForm
                      initial={person}
                      onCancel={() => setEditing(null)}
                      onSaved={async () => {
                        setEditing(null);
                        await reload();
                      }}
                      onDelete={async () => {
                        if (!window.confirm(`Usunąć ${person.name} z zespołu?`)) return;
                        await removeRecord("Instructor", person.id);
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
          <PEmpty>Nie ma jeszcze żadnej osoby w zespole.</PEmpty>
        )}
      </PanelCard>
    </div>
  );
}

function PersonForm({ initial, onSaved, onCancel, onDelete }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    role: initial.role || "Trenerka",
    photo: initial.photo || "",
    bio: initial.bio || "",
    specializations: Array.isArray(initial.specializations)
      ? initial.specializations.join(", ")
      : initial.specializations || "",
    certificate: initial.certificate || "",
    certificate_issuer: initial.certificate_issuer || "",
    email: initial.email || "",
    phone: initial.phone || "",
    does_personal_training: initial.does_personal_training !== false,
    active: initial.active !== false,
    order: initial.order ?? 99,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveRecord("Instructor", initial.id, {
        ...form,
        specializations: form.specializations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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
        <PField label="Imię i nazwisko">
          <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </PField>
        <PField label="Rola">
          <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </PField>
      </div>
      <ImageUpload label="Zdjęcie" value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} />
      <PField label="Bio">
        <textarea rows={4} className="input resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </PField>
      <PField label="Specjalizacje" hint="Oddziel przecinkami">
        <input className="input" value={form.specializations} onChange={(e) => setForm({ ...form, specializations: e.target.value })} />
      </PField>
      <div className="grid gap-3 sm:grid-cols-2">
        <PField label="Certyfikat">
          <input className="input" value={form.certificate} onChange={(e) => setForm({ ...form, certificate: e.target.value })} />
        </PField>
        <PField label="Wydawca certyfikatu">
          <input className="input" value={form.certificate_issuer} onChange={(e) => setForm({ ...form, certificate_issuer: e.target.value })} />
        </PField>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <PField label="E-mail">
          <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </PField>
        <PField label="Telefon">
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </PField>
        <PField label="Kolejność">
          <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
        </PField>
      </div>
      <div className="flex flex-wrap gap-4 text-[0.8rem] text-graphite/65">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.does_personal_training} onChange={(e) => setForm({ ...form, does_personal_training: e.target.checked })} />
          Prowadzi treningi personalne
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Aktywna
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