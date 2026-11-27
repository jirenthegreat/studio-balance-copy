import { Link } from "@tanstack/react-router";

export default function CtaBand() {
  return (
    <section className="py-24 text-center md:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.98]">
          Zwolnij. <em>Ruszaj się dobrze.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[1.02rem] leading-relaxed text-graphite/65">
          Kameralne zajęcia i trening personalny w Unia Art Residence w Lublinie.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link to="/grafik" className="btn btn-primary">
            Zarezerwuj zajęcia
          </Link>
          <Link to="/trening-personalny" className="btn btn-outline">
            Trening personalny
          </Link>
        </div>
      </div>
    </section>
  );
}
