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
      <section className="relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div className="absolute inset-0">
          <Image
            src={IMG.paula}
            alt="Paula Kruszyńska w studiu Balance"
            className="photo-warm h-full w-full"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/85 to-canvas/20 md:bg-gradient-to-r md:from-canvas md:via-canvas/88 md:to-canvas/0"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-5 md:px-10">
          <p className="overline mb-6">Trening personalny</p>
          <h1 className="max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">
            Godzina <em className="site-accent">tylko dla Ciebie</em>.
          </h1>
          <p className="mt-5 max-w-xl text-[0.95rem] leading-[1.8] text-ink/55">
            Plan dopasowany do Twojego ciała, celu i tygodnia. Pracujemy nad
            siłą, kondycją i techniką — w tempie, które do Ciebie pasuje.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <div className="site-card mb-10 grid gap-6 p-6 sm:grid-cols-3">
            {[
              ["60 minut", "czas jednej sesji"],
              ["1:1 lub w parze", "forma treningu"],
              ["Potwierdzenie", "mailem od Pauli"],
            ].map(([title, sub]) => (
              <div key={title}>
                <p className="text-[0.95rem] font-medium tracking-[-0.01em]">{title}</p>
                <p className="mt-1 text-[0.82rem] text-ink/45">{sub}</p>
              </div>
            ))}
          </div>

          {instructors.length ? (
            <PersonalBookingFlow instructors={instructors} today={today} />
          ) : (
            <p className="rounded-[20px] bg-clay p-6 text-[0.9rem] text-ink/55">
              Zapisy na treningi personalne są chwilowo wstrzymane. Napisz do
              nas na Messengerze — ustalimy termin indywidualnie.
            </p>
          )}
        </div>
      </section>
    </>
  );
}