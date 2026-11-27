import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2, Plus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCollection, saveRecord, removeRecord } from "@/lib/useCollection";
import { PageTitle, PanelCard, PField, PEmpty, PLoading, SMALL_BTN } from "@/components/panel/ui";
import ImageUpload from "@/components/panel/ImageUpload";

export const Route = createFileRoute("/_authed/panel/galeria")({
  component: GaleriaPanel,
});

function GaleriaPanel() {
  const { items, loading, reload } = useCollection("GalleryImage", {}, { sort: "order" });
  const [draft, setDraft] = useState({ image: "", caption: "" });

  const add = async (e) => {
    e.preventDefault();
    if (!draft.image) return;
    await saveRecord("GalleryImage", null, {
      image: draft.image,
      caption: draft.caption,
      order: items.length + 1,
      active: true,
    });
    setDraft({ image: "", caption: "" });
    await reload();
  };

  const update = async (item, patch) => {
    await saveRecord("GalleryImage", item.id, patch);
    await reload();
  };

  return (
    <div>
      <PageTitle subtitle="Zdjęcia w sekcji „Galeria” na stronie głównej.">Galeria</PageTitle>

      <PanelCard title="Dodaj zdjęcie" className="mb-5">
        <form onSubmit={add} className="space-y-3">
          <ImageUpload value={draft.image} onChange={(url) => setDraft({ ...draft, image: url })} />
          <PField label="Podpis (opcjonalnie)">
            <input
              className="input"
              value={draft.caption}
              onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
            />
          </PField>
          <button type="submit" disabled={!draft.image} className="btn btn-primary !min-h-[42px]">
            <Plus className="h-4 w-4" /> Dodaj do galerii
          </button>
        </form>
      </PanelCard>

      <PanelCard title="Zdjęcia">
        {loading ? (
          <PLoading />
        ) : items.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id} className="border border-graphite/10">
                <Image src={item.image} alt={item.caption || "Zdjęcie ze studia"} className="h-40 w-full object-cover" />
                <div className="space-y-2 p-3">
                  <input
                    className="input !min-h-[38px] !text-[0.8rem]"
                    defaultValue={item.caption || ""}
                    placeholder="Podpis"
                    onBlur={(e) => {
                      if (e.target.value !== (item.caption || "")) {
                        update(item, { caption: e.target.value });
                      }
                    }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-[0.75rem] text-graphite/60">
                      <input
                        type="checkbox"
                        checked={item.active !== false}
                        onChange={(e) => update(item, { active: e.target.checked })}
                      />
                      Widoczne
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm("Usunąć to zdjęcie z galerii?")) return;
                        await removeRecord("GalleryImage", item.id);
                        await reload();
                      }}
                      className={SMALL_BTN}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Usuń
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <PEmpty>Galeria jest pusta.</PEmpty>
        )}
      </PanelCard>
    </div>
  );
}