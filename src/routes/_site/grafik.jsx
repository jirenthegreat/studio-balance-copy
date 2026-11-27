import { createFileRoute, Link } from "@tanstack/react-router";
import Schedule from "@/components/site/Schedule";
import Accent from "@/components/site/Accent";
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
      <section className="pb-10 pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <p className="overline mb-6">Grafik</p>
          <h1 className="max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em]">
            {person ? (
              <>
                Zajęcia z <em className="site-accent">{person.name}</em>
              </>
            ) : (
              <Accent text="Zaplanuj swój *tydzień*." />
            )}
          </h1>
          <p className="mt-5 max-w-xl text-[0.95rem] leading-[1.8] text-ink/55">
            Kameralne grupy do czterech osób. Kliknij zajęcia, żeby
            zarezerwować miejsce — potwierdzenie przyjdzie mailem.
          </p>
          {person && (
            <Link
              to="/grafik"
              search={{}}
              className="mt-6 inline-block rounded-full bg-surface px-5 py-2.5 text-[0.84rem] text-ink/65 transition-colors hover:text-ink"
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
        heading={null}
        note={null}
      />
    </>
  );
}