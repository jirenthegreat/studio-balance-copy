import CountUp from "./CountUp";
import Reveal from "./Reveal";

export default function Statement() {
  return (
    <section className="overflow-hidden bg-clay py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-[1fr_auto] md:gap-20 md:px-10">
        <Reveal>
          <p className="overline">Kameralnie</p>
          <h2 className="site-accent mt-6 text-[clamp(2.8rem,8.5vw,6.4rem)] leading-[0.92] tracking-[-0.02em] text-ink">
            Nigdy więcej
            <br />
            niż cztery.
          </h2>
          <p className="mt-7 max-w-lg text-[1rem] leading-[1.8] text-ink/60">
            W każdej grupie są maksymalnie cztery osoby. Trenerka widzi każdy
            ruch, poprawia technikę i dobiera obciążenie do Ciebie – niezależnie
            od tego, czy zaczynasz, czy trenujesz od lat.
          </p>
        </Reveal>

        <Reveal delay={120} className="justify-self-center md:justify-self-end">
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-ink/10 md:h-56 md:w-56">
            <span
              className="absolute inset-3 rounded-full border border-dashed border-blush/45"
              aria-hidden="true"
            />
            <div className="text-center">
              <CountUp
                to={4}
                className="site-accent block text-[4.5rem] leading-none text-ink md:text-[6rem]"
              />
              <span className="mt-1 block text-[0.8rem] text-ink/45">
                osoby w grupie
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}