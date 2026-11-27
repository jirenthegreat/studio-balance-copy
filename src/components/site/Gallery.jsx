import { useState } from "react";
import { Image } from "@/components/ui/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Expand } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";
import { IMG } from "@/lib/images";

// Dane przykładowe — galeria zarządzana z panelu.
export const SAMPLE_GALLERY = [
  { id: "g1", image: IMG.pilatesGroup, caption: "Pilates w grupie do czterech osób", ratio: "aspect-[4/5]" },
  { id: "g2", image: IMG.paulaClass, caption: "Paula przed zajęciami", ratio: "aspect-[3/4]" },
  { id: "g4", image: IMG.pilatesClass, caption: "Wspólny trening", ratio: "aspect-[4/3]" },
];

const TILT = [
  "-rotate-[3deg]",
  "rotate-[2.5deg]",
  "-rotate-[1.5deg]",
  "rotate-[3.5deg]",
  "-rotate-[2deg]",
  "rotate-[1.5deg]",
];

const OFFSET = ["mt-0", "mt-8", "mt-3", "mt-10", "mt-1", "mt-6"];

export default function Gallery({ images = SAMPLE_GALLERY }) {
  const [active, setActive] = useState(null);

  return (
    <section id="galeria" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <SectionHeading
            overline="Galeria"
            title="Zajrzyj *do środka*."
            intro="Tak wygląda zwykły poranek w Studio Balance — dużo światła, maty i spokój."
          />
        </Reveal>

        <div className="mt-16 flex flex-wrap items-start justify-center gap-x-6 gap-y-10 md:gap-x-10">
          {images.map((item, i) => (
            <Reveal
              key={item.id || item.image}
              delay={i * 80}
              className={cn(
                "w-[78%] sm:w-[44%] lg:w-[30%]",
                OFFSET[i % OFFSET.length]
              )}
            >
              <button
                type="button"
                onClick={() => setActive(item)}
                className="group block w-full text-left"
                aria-label={`Powiększ zdjęcie: ${item.caption}`}
              >
                <figure className={cn("polaroid", TILT[i % TILT.length])}>
                  <span className="relative block overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.caption || "Zdjęcie ze studia Balance"}
                      className={cn("photo-warm w-full object-cover", item.ratio || "aspect-[4/5]")}
                    />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm">
                        <Expand className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                  <figcaption className="polaroid-caption mt-3.5 text-center">
                    {item.caption}
                  </figcaption>
                </figure>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{active?.caption || "Zdjęcie"}</DialogTitle>
          {active && (
            <figure>
              <Image
                src={active.image}
                alt={active.caption || "Zdjęcie ze studia Balance"}
                fittingType="fit"
                className="photo-warm max-h-[80vh] w-full rounded-[24px]"
              />
              <figcaption className="polaroid-caption mt-4 text-center !text-canvas/85">
                {active.caption}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}