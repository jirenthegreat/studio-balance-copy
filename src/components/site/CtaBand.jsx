import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { IMG } from "@/lib/images";

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src={IMG.detail}
        alt="Detal maty i sprzętu w studiu Balance"
        className="photo-warm absolute inset-0 h-full w-full scale-105 blur-[2px]"
      />
      <div className="absolute inset-0 bg-graphite/80" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:px-10 md:py-28">
        <p className="overline text-sand/70">Pierwszy krok</p>
        <h2 className="mt-5 text-[2rem] leading-[1.1] text-bone sm:text-[2.6rem] md:text-[3.1rem]">
          Zacznij od jednego treningu.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-[1.8] text-bone/75">
          Wybierz zajęcia z grafiku albo umów trening indywidualny. Reszta
          przyjdzie sama — spokojnie, w swoim tempie.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/grafik" className="btn bg-bone text-graphite hover:bg-sand">
            Zarezerwuj zajęcia
          </Link>
          <Link to="/trening-personalny" className="btn btn-light">
            Trening personalny
          </Link>
        </div>
      </div>
    </section>
  );
}