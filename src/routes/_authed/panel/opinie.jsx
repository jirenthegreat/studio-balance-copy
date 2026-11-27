import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useCollection, saveRecord, removeRecord } from "@/lib/useCollection";
import { PageTitle, PanelCard, PField, PEmpty, PLoading, PBadge, SMALL_BTN } from "@/components/panel/ui";

export const Route = createFileRoute("/_authed/panel/opinie")({
  component: OpiniePanel,
});

const BLANK = {
  author: "",
  text: "",
  rating: 5,
  source: "Google",
  published: true,
  order: 99,
};

function OpiniePanel() {
  const { items, loading, reload } = useCollection("Review", {}, { sort: "order" });
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageTitle
        subtitle="Opinie widoczne w sekcji „Opinie” na stronie głównej."
        action={
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="inline-flex min-h-[38px] items-center gap-1.5 bg-graphite px-3 text-[0.68rem] uppercase tracking-[0.1em] text-bone"
          >
            <Plus className="h-3.5 w-3.5" /> Dodaj opinię
          </button>
        }
      >
        Opinie
      </PageTitle>

      {creating && (
        <PanelCard className="mb-5" title="Nowa opinia">
          <ReviewForm
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
            {items.map((review) => (
              <li key={review.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[0.9rem]">
                      {review.author}
                      <span className="ml-2 inline-flex items-center gap-0.5 align-middle text-rose">
                        {Array.from({ length: review.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                    </p>
                    <p className="mt-1 line-clamp-2 text-[0.78rem] leading-relaxed text-graphite/55">
                      {review.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PBadge tone={review.published ? "green" : "gray"}>
                      {review.published ? "widoczna" : "ukryta"}
                    </PBadge>
                    <button
                      type="button"
                      onClick={() => setEditing(editing === review.id ? null : review.id)}
                      className={SMALL_BTN}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edytuj
                    </button>
                  </div>
                </div>
                {editing === review.id && (
                  <div className="mt-4 border-t border-graphite/10 pt-4">
                    <ReviewForm
                      initial={review}
                      onCancel={() => setEditing(null)}
                      onSaved={async () => {
                        setEditing(null);
                        await reload();
                      }}
                      onDelete={async () => {
                        if (!window.confirm("Usunąć tę opinię?")) return;
                        await removeRecord("Review", review.id);
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
          <PEmpty>Nie ma jeszcze żadnej opinii.</PEmpty>
        )}
      </PanelCard>
    </div>
  );
}

function ReviewForm({ initial, onSaved, onCancel, onDelete }) {
  const [form, setForm] = useState({
    author: initial.author || "",
    text: initial.text || "",
    rating: initial.rating || 5,
    source: initial.source || "Google",
    published: initial.published !== false,
    order: initial.order ?? 99,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveRecord("Review", initial.id, {
        ...form,
        rating: Number(form.rating) || 5,
        order: Number(form.order) || 99,
      });
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <PField label="Autorka">
          <input required className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        </PField>
        <PField label="Źródło">
          <input className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Facebook / Google" />
        </PField>
        <PField label="Ocena">
          <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
            {[5, 4, 3].map((n) => (
              <option key={n} value={n}>
                {n} / 5
              </option>
            ))}
          </select>
        </PField>
      </div>
      <PField label="Treść opinii">
        <textarea required rows={4} className="input resize-none" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
      </PField>
      <div className="grid gap-3 sm:grid-cols-2">
        <PField label="Kolejność">
          <input type="number" className="input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
        </PField>
        <label className="flex items-end gap-2 pb-3 text-[0.8rem] text-graphite/65">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
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