import { createFileRoute, Link } from "@tanstack/react-router";
import Schedule from "@/components/site/Schedule";
import { getSiteContent } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/grafik")({
  validateSearch: (search) => ({
    instructor:
      typeof search.instructor === "string" ? search.instructor : undefined,
  }),
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Grafik zajęć — Studio Balance Lublin" },
      {
        name: "description",
        content:
          "Tygodniowy grafik zajęć w Studio Balance: pilates, spinning, stretching, fit mama i trening obwodowy. Zapis online, bez zakładania konta.",
      },
      { property: "og:title", content: "Grafik zajęć — Studio Balance" },
    ],
  }),
  component: GrafikPage,
});

function GrafikPage() {
  const { sessions, instructors } = Route.useLoaderData();
  const { instructor } = Route.useSearch();

  const person = instructors.find((i) => i.id === instructor);
  const filtered = instructor
    ? sessions.filter((s) => s.instructor_id === instructor)
    : sessions;

  return (
    <>
      <section className="pb-0 pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <h1 className="max-w-3xl text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.95]">
            {person ? `Zajęcia: ${person.name}` : <>Zaplanuj swój <em>tydzień.</em></>}
          </h1>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-[1.7] text-graphite/65">
            Kameralne grupy do czterech osób. Wybierz termin i zapisz się w
            kilka sekund — potwierdzenie przyjdzie mailem.
          </p>
          {person && (
            <Link
              to="/grafik"
              search={{}}
              className="mt-5 inline-block text-[0.85rem] underline underline-offset-4"
            >
              Pokaż wszystkie zajęcia
            </Link>
          )}
        </div>
      </section>

      <Schedule
        sessions={filtered}
        demo={!instructor}
        showAllLink={false}
        title="Najbliższe *zajęcia*"
        intro="Kliknij zajęcia, żeby zapisać się w kilka sekund. Gdy grupa jest pełna, dopiszemy Cię na listę rezerwową."
      />
    </>
  );
}