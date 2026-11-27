import { addDays, isoDate } from "@/lib/booking-format";

export const TYPE_STYLES = {
  pilates: { label: "Pilates", bg: "#F3E4E8", edge: "#C9958F" },
  spinning: { label: "Spinning", bg: "#F1E3D4", edge: "#C08552" },
  stretching: { label: "Stretching", bg: "#E4EBE0", edge: "#8FA58A" },
  "fit-mama": { label: "Fit Mama", bg: "#F8E6D9", edge: "#D99B72" },
  obwodowy: { label: "Trening obwodowy", bg: "#EFE8DA", edge: "#B7A588" },
};

const MATCHERS = [
  ["fit-mama", /mama/i],
  ["spinning", /spinning|rower|indoor/i],
  ["stretching", /stretch/i],
  ["obwodowy", /obwod/i],
  ["pilates", /pilates|mata/i],
];

export function typeKey(name) {
  const found = MATCHERS.find(([, re]) => re.test(name || ""));
  return found ? found[0] : "pilates";
}

export function styleFor(name) {
  return TYPE_STYLES[typeKey(name)] || TYPE_STYLES.pilates;
}

export const FILTERS = [
  { key: "all", label: "Wszystkie" },
  { key: "pilates", label: "Pilates" },
  { key: "spinning", label: "Spinning" },
  { key: "stretching", label: "Stretching" },
  { key: "fit-mama", label: "Fit Mama" },
  { key: "obwodowy", label: "Trening obwodowy" },
];

/** „Paula” → „Paulą”, inne imiona zostawiamy bez odmiany. */
export function withInstructor(name) {
  const first = String(name || "Paula").trim().split(" ")[0];
  return /a$/i.test(first) ? `${first.slice(0, -1)}ą` : first;
}

/** Poniedziałek najbliższego tygodnia (dziś, jeśli dziś jest poniedziałek). */
export function upcomingMonday() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  const day = d.getDay();
  const shift = day === 1 ? 0 : (8 - day) % 7;
  d.setDate(d.getDate() + shift);
  return isoDate(d);
}

export function weekStart(weekIndex = 0) {
  return addDays(upcomingMonday(), weekIndex * 7);
}

export function weekDays(weekIndex = 0) {
  const start = weekStart(weekIndex);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

const DEMO_TEMPLATE = [
  { weekday: 1, time: "10:00", name: "Pilates + relaksacja", duration: 60, booked: [2, 1] },
  { weekday: 2, time: "10:00", name: "Fit Mama", duration: 55, booked: [3, 0] },
  { weekday: 3, time: "18:00", name: "Spinning Fit", duration: 50, booked: [4, 2] },
  { weekday: 4, time: "18:00", name: "Stretching", duration: 55, booked: [1, 3] },
  { weekday: 5, time: "18:00", name: "Pilates + relaksacja", duration: 60, booked: [0, 1] },
];

/** Przykładowe zajęcia na wybrany tydzień — do czasu aż w studiu pojawią się prawdziwe. */
export function demoWeek(weekIndex = 0) {
  const start = weekStart(weekIndex);
  return DEMO_TEMPLATE.map((slot, i) => ({
    id: `demo-${weekIndex}-${i}`,
    date: addDays(start, slot.weekday - 1),
    time: slot.time,
    name: slot.name,
    duration: slot.duration,
    instructor: "Paula",
    capacity: 4,
    booked: slot.booked[weekIndex] ?? slot.booked[0],
    is_demo: true,
  }));
}

/** Ujednolica zajęcia z bazy i dane przykładowe. */
export function normalizeSession(session) {
  return {
    ...session,
    capacity: session.capacity ?? 4,
    booked: session.booked ?? 0,
    style: styleFor(session.name),
  };
}