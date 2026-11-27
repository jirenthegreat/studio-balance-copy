import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Team({ instructors = [] }) {
  if (instructors.length < 2) return null;
  return <TeamInner instructors={instructors} />;
}

function TeamInner({ instructors }) {
  const [active, setActive] = useState(null);
  const [lead, ...rest] = instructors;

  return (
    <section id="zespol" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <SectionHeading
            overline="Zespół"
            title="Osoby, które *poprowadzą* Twój trening."
            intro="Każda z nas ma swój styl — wszystkie pracujemy w tym samym rytmie uważności."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <article className="site-card flex h-full flex-col overflow-hidden sm:flex-row">
              <Image
                src={lead.photo}
                alt={lead.name}
                className="photo-warm h-64 w-full sm:h-auto sm:w-1/2"
              />
              <div className="flex flex-1 flex-col justify-center p-7">
                <h3 className="text-[1.6rem] font-medium leading-tight tracking-[-0.02em]">
                  {lead.name}
                </h3>
                <p className="mt-1 text-[0.86rem] text-ink/45">
                  {lead.role}
                </p>
                <p className="mt-4 line-clamp-6 text-[0.9rem] leading-[1.75] text-ink/55">
                  {lead.bio}
                </p>
                <Link to="/trening-personalny" className="btn btn-primary mt-6 self-start">
                  Umów trening
                </Link>
              </div>
            </article>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            {rest.map((person, i) => (
              <Reveal key={person.id} delay={i * 80}>
                <article className="site-card flex items-center gap-4 p-4">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    className="photo-warm h-20 w-20 shrink-0 rounded-[16px]"
                  />
                  <div className="min-w-0">
                    <h3 className="text-[1.1rem] font-medium leading-tight tracking-[-0.02em]">
                      {person.name}
                    </h3>
                    <p className="text-[0.82rem] text-ink/45">
                      {person.role}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActive(person)}
                      className="mt-2 text-[0.82rem] underline underline-offset-4 hover:text-ink/70"
                    >
                      Poznaj mnie
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-lg rounded-[24px] border-ink/10 bg-surface">
          <DialogTitle className="font-sans text-[1.5rem] font-medium tracking-[-0.02em]">
            {active?.name}
          </DialogTitle>
          {active && (
            <div>
              <Image
                src={active.photo}
                alt={active.name}
                className="photo-warm mt-2 aspect-[4/5] w-full rounded-[20px]"
              />
              <p className="mt-5 text-[0.9rem] leading-[1.8] text-ink/60">
                {active.bio}
              </p>
              <Link
                to="/grafik"
                search={{ instructor: active.id }}
                className="btn btn-outline mt-6 w-full"
                onClick={() => setActive(null)}
              >
                Pokaż zajęcia w grafiku
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}