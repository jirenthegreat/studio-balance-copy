import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { Award } from "lucide-react";
import Reveal from "./Reveal";
import { IMG } from "@/lib/images";

const FALLBACK = {
  name: "Paula Kruszyńska",
  role: "Założycielka studia, trenerka",
  photo: IMG.paula,
  specializations: [
    "pilates",
    "spinning",
    "trening personalny",
    "zajęcia dla mam",
  ],
};

export default function MeetPaula({ instructor = FALLBACK }) {
  const person = { ...FALLBACK, ...instructor };
  const tags = person.specializations || FALLBACK.specializations;

  return (
    <section id="paula" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-[32px] bg-linen p-5 md:grid-cols-[1fr_0.85fr] md:gap-14 md:p-12 mx-5 md:mx-auto xl:mx-auto">
        <Reveal>
          <p className="eyebrow">Poznaj mnie</p>
          <h2 className="mt-5 text-[2.4rem] leading-[1] sm:text-[3rem] md:text-[3.6rem]">
            Paula <em>Kruszyńska</em>
          </h2>
          <p className="mt-2 text-[0.85rem] text-graphite/50">
            {person.role}
          </p>

          <div className="mt-7 space-y-5 text-[0.98rem] leading-[1.8] text-graphite/70">
            <p>
              Jestem Paula. Prowadzę Studio Balance – kameralne miejsce, w którym
              trening jest dopasowany do Ciebie, a nie Ty do treningu. Każdy plan
              układam pod Twój cel, możliwości i to, jak czuje się Twoje ciało,
              z dużą uważnością na technikę i ułożenie ciała.
            </p>
            <p>
              Prowadzę treningi personalne, pilates i spinning, a także zajęcia
              dla mam – jestem certyfikowaną trenerką aktywności w ciąży i po
              porodzie.
            </p>
            <p>
              W grupach do 4 osób nikt nie jest anonimowy. Znam każdą osobę, która
              do mnie przychodzi, i wiem, kiedy przyspieszyć, a kiedy odpuścić.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-graphite/[0.06] px-3.5 py-1.5 text-[0.85rem] text-graphite/75"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-start gap-4 rounded-2xl bg-sage/15 p-5">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-sage" aria-hidden="true" />
            <div>
              <p className="text-[0.85rem] text-graphite/55">Certyfikat</p>
              <p className="mt-1.5 text-[1.05rem] font-medium leading-snug">
                {person.certificate || "Aktywność w ciąży i po porodzie"}
              </p>
              <p className="text-[0.85rem] text-graphite/55">
                {person.certificate_issuer || "Fitness University"}
              </p>
            </div>
          </div>

          <Link to="/trening-personalny" className="btn btn-primary mt-8">
            Umów trening personalny
          </Link>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="overflow-hidden rounded-[24px]">
            <Image
              src={person.photo}
              alt={`${person.name} — założycielka Studio Balance`}
              className="photo-warm aspect-[3/4] w-full"
            />
          </div>
          <p className="absolute -bottom-3 left-4 -rotate-3 rounded-full bg-[#FFFDFA] px-4 py-1.5 font-hand text-[1.2rem] shadow-sm">
            do zobaczenia na zajęciach!
          </p>
        </Reveal>
      </div>
    </section>
  );
}