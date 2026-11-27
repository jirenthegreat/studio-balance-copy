import { createFileRoute, Link } from "@tanstack/react-router";
import BookingFlow from "@/components/booking/BookingFlow";
import { getSessionForBooking } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/rezerwacja/$sessionId")({
  loader: ({ params }) =>
    getSessionForBooking({ data: { sessionId: params.sessionId } }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Zapis na ${loaderData.name} — Studio Balance`
          : "Rezerwacja zajęć — Studio Balance",
      },
      {
        name: "description",
        content:
          "Zapisz się na zajęcia w Studio Balance w Lublinie. Bez zakładania konta, potwierdzenie mailem.",
      },
    ],
  }),
  component: RezerwacjaPage,
});

function RezerwacjaPage() {
  const session = Route.useLoaderData();

  return (
    <section className="pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Link
          to="/grafik"
          className="text-[0.7rem] uppercase tracking-[0.18em] text-graphite/50 hover:text-graphite"
        >
          ← Wróć do grafiku
        </Link>

        {session ? (
          <div className="mt-8">
            <h1 className="max-w-xl text-[2.1rem] leading-[1.08] md:text-[2.8rem]">
              Zapis na zajęcia
            </h1>
            <p className="mt-3 max-w-lg text-[0.92rem] leading-relaxed text-graphite/60">
              Wypełnij dane — potwierdzenie i link do odwołania przyjdą na
              podany adres e-mail.
            </p>
            <div className="mt-10">
              <BookingFlow session={session} />
            </div>
          </div>
        ) : (
          <div className="mt-10 border border-graphite/15 bg-bone p-10 text-center">
            <h1 className="text-[1.8rem] leading-tight">Nie znaleźliśmy tych zajęć</h1>
            <p className="mx-auto mt-3 max-w-sm text-[0.9rem] leading-relaxed text-graphite/60">
              Termin mógł zostać odwołany lub już się odbył. Zajrzyj do
              aktualnego grafiku.
            </p>
            <Link to="/grafik" className="btn btn-primary mt-7">
              Zobacz grafik
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}