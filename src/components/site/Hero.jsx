import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMG, CONTACT } from "@/lib/images";

const CHIPS = [
  { label: "Pilates", hash: "oferta" },
  { label: "Spinning", hash: "oferta" },
  { label: "Trening personalny", to: "/trening-personalny" },
  { label: "Fit Mama", hash: "oferta" },
];

const AVATARS = ["J", "K", "E", "I", "M"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bone">
      {/* Zdjęcie sali: na desktopie po prawej, wtopione w tło. */}
      <div className="absolute inset-x-0 top-0 h-[58svh] overflow-hidden md:inset-y-0 md:left-auto md:h-auto md:w-[62%]">
        <Image
          src={IMG.hero}
          alt="Sala Studio Balance z dużymi oknami i zielenią za szybą"
          className="photo-warm kenburns h-full w-full"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-bone via-bone/70 to-bone/0 md:bg-gradient-to-r md:from-bone md:via-bone/30 md:to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-10 pt-32 md:justify-center md:px-10 md:pb-16">
        <p className="eyebrow bg-linen/80 text-graphite/75 backdrop-blur">
          Studio treningowe · {CONTACT.place}, Lublin
        </p>

        <h1 className="mt-6 max-w-[11ch] text-[clamp(3rem,8vw,6.6rem)] leading-[0.95]">
          Znajdź swoją <em>równowagę.</em>
        </h1>

        <p className="mt-6 max-w-md text-[1.05rem] leading-[1.65] text-graphite/75">
          Trening personalny i zajęcia w grupach do czterech osób. Trenerka
          widzi każdy Twój ruch, a godzina na macie należy tylko do Ciebie.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link to="/grafik" className="btn btn-primary">
            Zarezerwuj zajęcia
          </Link>
          <Link to="/trening-personalny" className="btn btn-light">
            Trening personalny
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Rodzaje zajęć">
          {CHIPS.map((chip) => (
            <li key={chip.label}>
              <Link
                to={chip.to || "/"}
                hash={chip.hash}
                className="block rounded-full border border-graphite/10 bg-linen/70 px-3.5 py-1.5 text-[0.82rem] text-graphite/75 backdrop-blur transition-colors hover:bg-linen"
              >
                {chip.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="#opinie"
          className="mt-12 flex w-fit items-center gap-4 rounded-full bg-linen/80 py-2 pl-2 pr-5 backdrop-blur md:mt-16"
        >
          <span className="flex -space-x-2" aria-hidden="true">
            {AVATARS.map((letter, i) => (
              <span
                key={letter}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-linen font-serif text-[1.05rem] italic text-graphite"
                style={{ background: ["#E7D9CB", "#DCE3D6", "#EBD3CC", "#E4DCCF", "#D9E0DE"][i] }}
              >
                {letter}
              </span>
            ))}
          </span>
          <span>
            <span className="flex gap-0.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-graphite text-graphite" />
              ))}
            </span>
            <span className="mt-0.5 block text-[0.82rem] text-graphite/70">
              5,0 w Google, 14 opinii
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
