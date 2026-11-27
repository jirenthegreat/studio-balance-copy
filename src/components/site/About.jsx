import { useState } from "react";
import { Image } from "@/components/ui/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SectionHeading from "./SectionHeading";
import { IMG } from "@/lib/images";

// Zdjęcia studia jako polaroidy z odręcznym dopiskiem.
const POLAROIDS = [
  { image: IMG.hero, title: "Sala", note: "zieleń za każdym oknem", rotate: -4 },
  { image: IMG.pilatesClass, title: "Na macie", note: "oddech i precyzja", rotate: 3 },
  { image: IMG.room, title: "Przestrzeń", note: "bez tłumu, bez pośpiechu", rotate: -2 },
  { image: IMG.bikes, title: "Spinning", note: "rowery czekają", rotate: 4 },
  { image: IMG.pilatesGroup, title: "W grupie", note: "najwyżej cztery osoby", rotate: -3 },
  { image: IMG.paulaClass, title: "Paula", note: "do zobaczenia!", rotate: 2 },
];

function Polaroid({ item, onOpen, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`Powiększ zdjęcie: ${item.title}`}
      className={`polaroid group shrink-0 bg-[#FFFDFA] p-2.5 pb-4 text-left shadow-[0_14px_30px_-16px_rgba(43,29,26,0.45)] ${className}`}
      style={{ "--r": `${item.rotate}deg` }}
    >
      <Image
        src={item.image}
        alt={item.title}
        className="photo-warm aspect-[4/5] w-full"
      />
      <span className="mt-2.5 block px-1 font-serif text-[1.25rem] italic leading-none">
        {item.title}
      </span>
      <span className="mt-1 block px-1 font-hand text-[1.05rem] leading-tight text-graphite/55">
        {item.note}
      </span>
    </button>
  );
}

export default function About({ images }) {
  const [active, setActive] = useState(null);
  const items =
    images?.length
      ? images.map((g, i) => ({
          image: g.image,
          title: g.caption || "Studio Balance",
          note: "",
          rotate: [-4, 3, -2, 4, -3, 2][i % 6],
        }))
      : POLAROIDS;

  return (
    <section id="o-studiu" className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1fr_1fr] md:items-end md:px-10">
        <SectionHeading overline="Studio" title="Miejsce, w którym *zwalniasz.*" />
        <div className="space-y-4 text-[1.02rem] leading-[1.7] text-graphite/70">
          <p>
            Studio Balance to kameralna sala w Unia Art Residence, w centrum
            Lublina. Duże okna, matowa podłoga i zieleń za szybą.
          </p>
          <p>
            Zajęcia prowadzimy w grupach do czterech osób, więc trenerka widzi
            każdy ruch, niezależnie od tego, czy dopiero zaczynasz, czy
            trenujesz od lat.
          </p>
        </div>
      </div>

      {/* Telefon: przewijany pasek polaroidów. Desktop: porozrzucane na stole. */}
      <div className="no-scrollbar mt-14 flex gap-5 overflow-x-auto px-6 pb-8 pt-4 md:hidden">
        {items.map((item) => (
          <Polaroid key={item.title + item.image} item={item} onOpen={setActive} className="w-[62vw] max-w-[260px]" />
        ))}
      </div>
      <div className="mx-auto mt-16 hidden max-w-6xl grid-cols-6 gap-3 px-10 md:grid">
        {items.slice(0, 6).map((item, i) => (
          <Polaroid
            key={item.title + item.image}
            item={item}
            onOpen={setActive}
            className={i % 2 ? "mt-10" : ""}
          />
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{active?.title || "Zdjęcie"}</DialogTitle>
          {active && (
            <Image
              src={active.image}
              alt={active.title}
              fittingType="fit"
              className="photo-warm max-h-[80vh] w-full rounded-2xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
