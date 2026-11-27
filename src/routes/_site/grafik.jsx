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
      <section className="border-b border-graphite/10 bg-bone pb-10 pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <p className="overline flex items-center gap-3 text-rose">
            <span className="h-px w-7 bg-rose/50" aria-hidden="true" />
            Grafik
          </p>
          <h1 className="mt-5 max-w-2xl text-[2.4rem] leading-[1.05] md:text-[3.4rem]">
            {person ? `Zajęcia z ${person.name}` : "Zaplanuj swój tydzień."}
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-[1.8] text-graphite/60">
            Kameralne grupy do czterech osób. Wybierz termin i zapisz się w
            kilka sekund — potwierdzenie przyjdzie mailem.
          </p>
          {person && (
            <Link
              to="/grafik"
              search={{}}
              className="mt-5 inline-block text-[0.72rem] uppercase tracking-[0.16em] underline underline-offset-4"
            >
              Pokaż wszystkie zajęcia
            </Link>
          )}
        </div>
      </section>

      <Schedule
        sessions={filtered}
        showAllLink={false}
        title="Terminy w tym tygodniu"
        intro="Kliknij „Zapisz się”, aby zarezerwować miejsce. Jeśli grupa jest pełna, dopiszemy Cię na listę rezerwową."
      />
    </>
  );
}