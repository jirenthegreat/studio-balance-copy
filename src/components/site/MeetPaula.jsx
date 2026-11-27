import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { Award } from "lucide-react";
import Reveal from "./Reveal";
import Accent from "./Accent";
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
    <section id="paula" className="bg-clay py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1fr_0.9fr] md:gap-16 md:px-10">
        <Reveal>
          <p className="overline mb-6">Poznaj mnie</p>
          <h2 className="text-[clamp(2.05rem,4.2vw,3.2rem)] font-medium leading-[1.03] tracking-[-0.03em]">
            <Accent text="Paula *Kruszyńska*" />
          </h2>
          <p className="mt-3 text-[0.9rem] text-ink/50">{person.role}</p>

          <div className="mt-7 space-y-5 text-[0.98rem] leading-[1.8] text-ink/60">
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
                className="site-pill bg-surface text-ink/60"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="site-card mt-8 flex items-start gap-4 p-5">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />
            <div>
              <p className="text-[0.76rem] text-ink/45">Certyfikat</p>
              <p className="mt-1 text-[1.02rem] font-medium leading-snug tracking-[-0.01em]">
                {person.certificate || "Aktywność w ciąży i po porodzie"}
              </p>
              <p className="text-[0.82rem] text-ink/50">
                {person.certificate_issuer || "Fitness University"}
              </p>
            </div>
          </div>

          <Link to="/trening-personalny" className="btn btn-primary mt-8">
            Umów trening personalny
          </Link>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="site-photo">
            <Image
              src={person.photo}
              alt={`${person.name} — założycielka Studio Balance`}
              className="photo-warm aspect-[3/4] w-full"
            />
          </div>
          <div
            className="pointer-events-none absolute -left-6 bottom-10 hidden h-24 w-24 rounded-full border border-blush/40 md:block"
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>
  );
}