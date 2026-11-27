import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMG, CONTACT } from "@/lib/images";

/** Bento: najważniejsza obietnica studia, ocena w Google i trening 1:1. */
export default function Stats() {
  return (
    <section className="pb-8">
      <div className="mx-auto grid max-w-6xl gap-3 px-5 md:grid-cols-[1.5fr_1fr] md:grid-rows-2 md:px-10">
        <div className="flex flex-col justify-between rounded-[28px] bg-linen p-7 md:row-span-2 md:p-10">
          <div className="flex gap-2" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-5 w-5 rounded-full bg-graphite md:h-6 md:w-6" />
            ))}
          </div>
          <div className="mt-16 md:mt-24">
            <h2 className="text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95]">
              Nigdy więcej niż <em>cztery.</em>
            </h2>
            <p className="mt-5 max-w-md text-[1.02rem] leading-[1.7] text-graphite/70">
              W każdej grupie są najwyżej cztery osoby. Trenerka zna Twoje imię,
              poprawia technikę i dobiera obciążenie do Ciebie, czy zaczynasz,
              czy trenujesz od lat.
            </p>
          </div>
        </div>

        <a
          href={CONTACT.googleReviews}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col justify-between rounded-[28px] bg-sage/20 p-7 transition-colors hover:bg-sage/25"
        >
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4 w-4 fill-graphite text-graphite" />
            ))}
          </span>
          <span className="mt-10 block">
            <span className="block text-[3.6rem] font-medium leading-none tracking-[-0.05em]">5,0</span>
            <span className="mt-2 block text-[0.95rem] text-graphite/70">
              średnia z 14 opinii w Google
            </span>
          </span>
        </a>

        <Link
          to="/trening-personalny"
          className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[28px] p-7"
        >
          <Image
            src={IMG.paula}
            alt="Paula Kruszyńska w studiu"
            focalPointX={50}
            focalPointY={22}
            className="photo-warm absolute inset-0 h-full w-full object-[50%_22%] transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-graphite/75 to-transparent" aria-hidden="true" />
          <span className="relative text-[1.5rem] font-medium leading-tight tracking-[-0.03em] text-linen">
            Albo tylko Ty i <em className="accent">trenerka.</em>
          </span>
          <span className="relative mt-1 text-[0.92rem] text-linen/80">Trening personalny, 60 minut</span>
        </Link>
      </div>
    </section>
  );
}
