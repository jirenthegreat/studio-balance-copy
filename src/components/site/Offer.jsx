import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bike,
  Wind,
  Activity,
  HeartHandshake,
  Baby,
  Flower2,
  UserRound,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { IMG } from "@/lib/images";

const ICONS = {
  user: UserRound,
  flower: Flower2,
  bike: Bike,
  wind: Wind,
  activity: Activity,
  heart: HeartHandshake,
  baby: Baby,
};

const PASTEL = {
  personalny: "#EFE3D9",
  pilates: "#F0E2E7",
  spinning: "#F1E4D8",
  stretching: "#E3E9E0",
  obwodowy: "#EAE5DC",
  "fit-mama": "#E9E3EE",
  "baby-gym": "#F2E8DA",
};

// Dane przykładowe — w wersji produkcyjnej pochodzą z panelu studia.
export const SAMPLE_OFFERS = [
  {
    id: "personalny",
    name: "Trening personalny",
    description:
      "Praca jeden na jeden lub w parze, dopasowana do Twojego ciała i celu. Obejmuje też treningi medyczne i prozdrowotne — przy bólach kręgosłupa, po kontuzjach — dobierane indywidualnie.",
    duration: "60 min",
    level: "każdy poziom",
    for_whom: "dla osób, które chcą trenować precyzyjnie i z planem",
    price: null,
    image: IMG.paula,
    icon: "user",
    link: "/trening-personalny",
    is_group: false,
  },
  {
    id: "pilates",
    name: "Pilates + relaksacja",
    description:
      "Spokojny pilates na macie z elementami oddechu i rozluźniania. Wzmacnia głębokie mięśnie i wycisza głowę.",
    duration: "60 min",
    level: "każdy poziom",
    for_whom: "dla osób, które chcą wzmocnić ciało i się wyciszyć",
    price: null,
    image: IMG.pilatesClass,
    icon: "flower",
  },
  {
    id: "spinning",
    name: "Spinning Fit",
    description:
      "Energiczne interwały na rowerach stacjonarnych przy muzyce. Dużo serca, zero monotonii.",
    duration: "50 min",
    level: "średni / zaawansowany",
    for_whom: "dla osób z kondycją, które lubią intensywną pracę",
    price: null,
    image: IMG.bikes,
    icon: "bike",
  },
  {
    id: "stretching",
    name: "Stretching",
    description:
      "Godzina na rozluźnienie napiętych pleców, bioder i barków. Idealne uzupełnienie mocniejszych treningów.",
    duration: "55 min",
    level: "każdy poziom",
    for_whom: "dla osób, które dużo siedzą lub intensywnie trenują",
    price: null,
    icon: "wind",
  },
  {
    id: "obwodowy",
    name: "Trening obwodowy",
    description:
      "Krótkie stacje, pełne ciało, wyraźny plan. Siła i kondycja w jednym treningu.",
    duration: "50 min",
    level: "średni",
    for_whom: "dla ćwiczących regularnie, którzy chcą urozmaicić tydzień",
    price: null,
    icon: "activity",
  },
  {
    id: "fit-mama",
    name: "Fit Mama",
    description:
      "Zajęcia dla mam z dzieckiem — bezpieczny powrót do formy, praca z dnem miednicy i brzuchem.",
    quote: "Nigdzie nie znajdziesz miejsca bardziej przyjaznego dla matki z dzieckiem.",
    duration: "55 min",
    level: "łagodny",
    for_whom: "dla mam w okresie połogu i później, z maluchem obok",
    price: null,
    icon: "heart",
  },
  {
    id: "baby-gym",
    name: "Baby Gym",
    description:
      "Ogólnorozwojowe zajęcia dla dzieci — ruch, równowaga i zabawa razem z rodzicem.",
    duration: "45 min",
    level: "dla dzieci",
    for_whom: "dla dzieci od 6. miesiąca życia z opiekunem",
    price: null,
    icon: "baby",
  },
];

function FeaturedTile({ offer }) {
  return (
    <Link
      to={offer.link || "/grafik"}
      className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-[24px] bg-ink p-7 md:p-9"
    >
      <Image
        src={offer.image || IMG.paulaClass}
        alt={offer.name}
        className="photo-warm absolute inset-0 h-full w-full opacity-85 transition-transform duration-[1400ms] group-hover:scale-[1.05]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 to-ink/10"
        aria-hidden="true"
      />
      <div className="relative">
        <span className="site-pill bg-surface/15 text-canvas/85 backdrop-blur-sm">
          {offer.is_group === false ? "Indywidualnie" : "W grupie"}
        </span>
        <h3 className="mt-3 text-[2rem] font-medium leading-[1.03] tracking-[-0.03em] text-canvas md:text-[2.6rem]">
          {offer.name}
        </h3>
        <p className="mt-4 max-w-md text-[0.92rem] leading-[1.75] text-canvas/70">
          {offer.description}
        </p>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-canvas/20 pt-4">
          <span className="text-[0.8rem] text-canvas/55">
            {[offer.duration, offer.level].filter(Boolean).join(" · ")}
          </span>
          <span className="flex items-center gap-2 text-[0.85rem] font-medium text-canvas">
            Zobacz
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Tile({ offer }) {
  const Icon = ICONS[offer.icon] || Flower2;
  const pastel = PASTEL[offer.id] || "#EDE3D9";
  return (
    <Link
      to={offer.link || "/grafik"}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-ink/[0.07] bg-surface transition-colors duration-500 hover:border-ink/20"
    >
      <div className="relative h-36 overflow-hidden" style={{ background: pastel }}>
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.name}
            className="photo-warm h-full w-full transition-transform duration-[1200ms] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon
              className="h-10 w-10 text-ink/30"
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
        )}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-ink opacity-0 transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.2rem] font-medium leading-tight tracking-[-0.02em]">
          {offer.name}
        </h3>
        <p className="mt-2 text-[0.85rem] leading-[1.7] text-ink/55">
          {offer.description}
        </p>
        {offer.quote && (
          <blockquote className="mt-4 border-l-2 border-blush/60 pl-3 text-[0.95rem] leading-snug text-ink/70">
            „{offer.quote}”
          </blockquote>
        )}
        <p className="mt-auto pt-5 text-[0.78rem] text-ink/40">
          {[offer.duration, offer.level].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

export default function Offer({ offers = SAMPLE_OFFERS }) {
  const featured = offers.find((offer) => offer.is_group === false) || offers[0];
  const rest = offers.filter((offer) => offer !== featured);

  return (
    <section id="oferta" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <SectionHeading
            overline="Oferta"
            title="Siedem sposobów,|żeby *zadbać o siebie*."
            intro="Zajęcia grupowe w małych grupach i treningi indywidualne. Każda forma ma swój rytm — wybierz tę, która pasuje do Twojego tygodnia."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="h-full sm:col-span-2 lg:row-span-2">
            <FeaturedTile offer={featured} />
          </Reveal>
          {rest.map((offer, i) => (
            <Reveal
              key={offer.id || offer.name}
              delay={i * 60}
              className={
                i >= 4 ? "h-full sm:col-span-2 lg:col-span-2" : "h-full"
              }
            >
              <Tile offer={offer} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}