import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useCollection, saveRecord, removeRecord } from "@/lib/useCollection";
import { formatDatePl, isoDate } from "@/lib/booking-format";
import { PageTitle, PanelCard, PField, PEmpty, PLoading } from "@/components/panel/ui";

export const Route = createFileRoute("/_authed/panel/dostepnosc")({
  component: DostepnoscPanel,
});

const WEEKDAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

function DostepnoscPanel() {
  const { items: instructors } = useCollection("Instructor", { active: true }, { sort: "order" });
  const { items: availability, loading, reload } = useCollection(
    "Availability",
    {},
    { sort: "weekday" }
  );
  const { items: blocks, reload: reloadBlocks } = useCollection(
    "BlockedSlot",
    { date: { $gte: isoDate(new Date()) } },
    { sort: "date" }
  );

  const [slot, setSlot] = useState({
    instructor_id: "",
    weekday: 1,
    start_time: "08:00",
    end_time: "14:00",
  });
  const [block, setBlock] = useState({
    date: isoDate(new Date()),
    start_time: "08:00",
    end_time: "14:00",
    reason: "",
  });

  const instructorId = slot.instructor_id || instructors[0]?.id || "";

  const addSlot = async (e) => {
    e.preventDefault();
    const person = instructors.find((i) => i.id === instructorId);
    if (!person) return;
    await saveRecord("Availability", null, {
      instructor_id: person.id,
      instructor_name: person.name,
      weekday: Number(slot.weekday),
      start_time: slot.start_time,
      end_time: slot.end_time,
      active: true,
    });
    await reload();
  };

  const addBlock = async (e) => {
    e.preventDefault();
    const person = instructors[0];
    if (!person) return;
    await saveRecord("BlockedSlot", null, {
      instructor_id: person.id,
      instructor_name: person.name,
      date: block.date,
      start_time: block.start_time,
      end_time: block.end_time,
      reason: block.reason,
    });
    await reloadBlocks();
  };

  return (
    <div>
      <PageTitle subtitle="Godziny, w których klientki mogą rezerwować treningi personalne.">
        Dostępność
      </PageTitle>

      <div className="grid gap-5 lg:grid-cols-2">
        <PanelCard title="Godziny przyjęć" description="Sloty 60-minutowe w podanych widełkach.">
          {loading ? (
            <PLoading />
          ) : availability.length ? (
            <ul className="mb-4 divide-y divide-graphite/10 border border-graphite/10">
              {availability.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-2.5 text-[0.85rem]">
                  <span>
                    {WEEKDAYS[a.weekday - 1] || a.weekday} · {a.start_time}–{a.end_time}
                    <span className="ml-2 text-[0.7rem] text-graphite/40">{a.instructor_name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await removeRecord("Availability", a.id);
                      await reload();
                    }}
                    aria-label="Usuń godziny"
                    className="text-graphite/35 hover:text-rose"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <PEmpty>Brak zdefiniowanych godzin.</PEmpty>
          )}

          <form onSubmit={addSlot} className="grid gap-3 sm:grid-cols-2">
            <PField label="Trenerka">
              <select
                className="input"
                value={instructorId}
                onChange={(e) => setSlot({ ...slot, instructor_id: e.target.value })}
              >
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </PField>
            <PField label="Dzień">
              <select
                className="input"
                value={slot.weekday}
                onChange={(e) => setSlot({ ...slot, weekday: e.target.value })}
              >
                {WEEKDAYS.map((d, i) => (
                  <option key={d} value={i + 1}>
                    {d}
                  </option>
                ))}
              </select>
            </PField>
            <PField label="Od">
              <input type="time" className="input" value={slot.start_time} onChange={(e) => setSlot({ ...slot, start_time: e.target.value })} />
            </PField>
            <PField label="Do">
              <input type="time" className="input" value={slot.end_time} onChange={(e) => setSlot({ ...slot, end_time: e.target.value })} />
            </PField>
            <div className="sm:col-span-2">
              <button type="submit" className="btn btn-outline !min-h-[42px] w-full">
                <Plus className="h-4 w-4" /> Dodaj godziny
              </button>
            </div>
          </form>
        </PanelCard>

        <PanelCard title="Blokady i urlopy" description="Terminy, w których nie przyjmujesz rezerwacji.">
          {blocks.length ? (
            <ul className="mb-4 divide-y divide-graphite/10 border border-graphite/10">
              {blocks.map((b) => (
                <li key={b.id} className="flex items-center justify-between px-4 py-2.5 text-[0.85rem]">
                  <span>
                    {formatDatePl(b.date)} · {b.start_time}–{b.end_time}
                    {b.reason && (
                      <span className="ml-2 text-[0.7rem] text-graphite/40">{b.reason}</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await removeRecord("BlockedSlot", b.id);
                      await reloadBlocks();
                    }}
                    aria-label="Usuń blokadę"
                    className="text-graphite/35 hover:text-rose"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <PEmpty>Brak blokad.</PEmpty>
          )}

          <form onSubmit={addBlock} className="grid gap-3 sm:grid-cols-2">
            <PField label="Data">
              <input type="date" className="input" value={block.date} onChange={(e) => setBlock({ ...block, date: e.target.value })} />
            </PField>
            <PField label="Powód">
              <input className="input" value={block.reason} onChange={(e) => setBlock({ ...block, reason: e.target.value })} placeholder="np. urlop" />
            </PField>
            <PField label="Od">
              <input type="time" className="input" value={block.start_time} onChange={(e) => setBlock({ ...block, start_time: e.target.value })} />
            </PField>
            <PField label="Do">
              <input type="time" className="input" value={block.end_time} onChange={(e) => setBlock({ ...block, end_time: e.target.value })} />
            </PField>
            <div className="sm:col-span-2">
              <button type="submit" className="btn btn-outline !min-h-[42px] w-full">
                <Plus className="h-4 w-4" /> Dodaj blokadę
              </button>
            </div>
          </form>
        </PanelCard>
      </div>
    </div>
  );
}