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
      <section className="pb-6 pt-32 md:pt-40">
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-5 md:grid-cols-[1.2fr_0.8fr] md:px-10">
          <div>
            <h1 className="text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.95]">
              Godzina tylko <em>dla Ciebie.</em>
            </h1>
            <p className="mt-5 max-w-xl text-[1.02rem] leading-[1.7] text-graphite/65">
              Plan dopasowany do Twojego ciała, celu i tygodnia. Pracujemy nad
              siłą, kondycją i techniką, w tempie, które do Ciebie pasuje.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {["60 minut", "indywidualnie lub w parze", "termin potwierdzany mailem"].map((t) => (
                <li key={t} className="rounded-full bg-linen px-4 py-2 text-[0.9rem] text-graphite/75">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden overflow-hidden rounded-[28px] md:block">
            <Image
              src={IMG.paula}
              alt="Paula Kruszyńska w Studio Balance"
              className="photo-warm aspect-[4/5] w-full"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-10"><div className="max-w-3xl">
          {instructors.length ? (
            <PersonalBookingFlow instructors={instructors} today={today} />
          ) : (
            <p className="rounded-2xl bg-linen p-6 text-[0.95rem] text-graphite/70">
              Zapisy online na treningi personalne są chwilowo wyłączone.
              Zadzwoń: <a href="tel:+48730730357" className="underline">730 730 357</a>,
              ustalimy termin.
            </p>
          )}
        </div></div>
      </section>
    </>
  );
}