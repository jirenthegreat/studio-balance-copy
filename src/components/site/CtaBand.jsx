import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { IMG } from "@/lib/images";

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src={IMG.detail}
        alt="Detal maty i sprzętu w studiu Balance"
        className="photo-warm absolute inset-0 h-full w-full scale-105 opacity-60"
      />
      <div className="absolute inset-0 bg-ink/85" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:px-10 md:py-28">
        <span className="site-pill bg-canvas/10 text-canvas/70">Pierwszy krok</span>
        <h2 className="mt-6 text-[clamp(2rem,4.6vw,3.2rem)] font-medium leading-[1.03] tracking-[-0.03em] text-canvas">
          Zacznij od <em className="site-accent">jednego treningu</em>.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[0.95rem] leading-[1.8] text-canvas/65">
          Wybierz zajęcia z grafiku albo umów trening indywidualny. Reszta
          przyjdzie sama — spokojnie, w swoim tempie.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/grafik" className="btn btn-cream">
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