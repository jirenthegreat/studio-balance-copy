import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import PersonalBookingFlow from "@/components/personal/PersonalBookingFlow";
import { getPersonalInstructors } from "@/lib/server-fns";
import { isoDate } from "@/lib/booking-format";
import { IMG } from "@/lib/images";

export const Route = createFileRoute("/_site/trening-personalny")({
  loader: async () => ({
    instructors: await getPersonalInstructors(),
    today: isoDate(new Date()),
  }),
  head: () => ({
    meta: [
      { title: "Trening personalny w Lublinie — Studio Balance" },
      {
        name: "description",
        content:
          "Trening personalny 1:1 lub w parze w Studio Balance, Lublin. Wybierz wolny termin w kalendarzu i wyślij zgłoszenie — potwierdzimy je mailem.",
      },
      { property: "og:title", content: "Trening personalny — Studio Balance Lublin" },
      { property: "og:image", content: IMG.paula },
    ],
  }),
  component: PersonalPage,
});

function PersonalPage() {
  const { instructors, today } = Route.useLoaderData();

  return (
    <>
      <section className="relative overflow-hidden bg-graphite pb-16 pt-32 md:pt-40">
        <Image
          src={IMG.paula}
          alt="Paula Kruszyńska w studiu Balance"
          className="photo-warm absolute inset-0 h-full w-full opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/85 to-graphite/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-10">
          <p className="overline flex items-center gap-3 text-sand/70">
            <span className="h-px w-7 bg-sand/40" aria-hidden="true" />
            Trening personalny
          </p>
          <h1 className="mt-5 max-w-2xl text-[2.3rem] leading-[1.05] text-bone md:text-[3.4rem]">
            Godzina tylko dla Ciebie.
          </h1>
          <p className="mt-5 max-w-xl text-[0.95rem] leading-[1.8] text-bone/75">
            Plan dopasowany do Twojego ciała, celu i tygodnia. Pracujemy nad
            siłą, kondycją i techniką — w tempie, które do Ciebie pasuje.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <div className="mb-10 grid gap-6 border border-graphite/12 bg-bone p-6 sm:grid-cols-3">
            {[
              ["60 minut", "czas jednej sesji"],
              ["1:1 lub w parze", "forma treningu"],
              ["Potwierdzenie", "mailem od Pauli"],
            ].map(([title, sub]) => (
              <div key={title}>
                <p className="text-[0.82rem] uppercase tracking-[0.14em]">{title}</p>
                <p className="mt-1 text-[0.78rem] text-graphite/50">{sub}</p>
              </div>
            ))}
          </div>

          {instructors.length ? (
            <PersonalBookingFlow instructors={instructors} today={today} />
          ) : (
            <p className="border border-graphite/15 bg-sand/30 p-6 text-[0.9rem] text-graphite/60">
              Zapisy na treningi personalne są chwilowo wstrzymane. Napisz do
              nas na Messengerze — ustalimy termin indywidualnie.
            </p>
          )}
        </div>
      </section>
    </>
  );
}