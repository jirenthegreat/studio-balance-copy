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
        <span className="site-pill bg-canvas/10 text-canvas/70">Do zobaczenia</span>
        <h2 className="mt-6 text-[clamp(2.2rem,6vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-canvas">
          Zwolnij. Ruszaj się{" "}
          <em className="site-accent">dobrze</em>.
        </h2>
        <div className="mt-9 flex justify-center">
          <Link to="/grafik" className="btn btn-cream">
            Zarezerwuj zajęcia
          </Link>
        </div>
      </div>
    </section>
  );
}