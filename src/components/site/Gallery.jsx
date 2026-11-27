import { useState } from "react";
import { Image } from "@/components/ui/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Expand } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { IMG } from "@/lib/images";

// Dane przykładowe — galeria zarządzana z panelu.
export const SAMPLE_GALLERY = [
  { id: "g1", image: IMG.pilatesGroup, caption: "Pilates w grupie do czterech osób", ratio: "aspect-[4/5]" },
  { id: "g2", image: IMG.paulaClass, caption: "Paula przed zajęciami", ratio: "aspect-[3/4]" },
  { id: "g4", image: IMG.pilatesClass, caption: "Wspólny trening", ratio: "aspect-[4/3]" },
];

export default function Gallery({ images = SAMPLE_GALLERY }) {
  const [active, setActive] = useState(null);

  return (
    <section id="galeria" className="bg-sand/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <SectionHeading
            overline="Galeria"
            title="Zajrzyj do środka."
            intro="Tak wygląda zwykły poranek w Studio Balance — dużo światła, maty i spokój."
          />
        </Reveal>

        <div className="mt-12 columns-2 gap-3 md:columns-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
          {images.map((item, i) => (
            <Reveal key={item.id || item.image} delay={i * 80} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setActive(item)}
                className="group relative block w-full overflow-hidden"
                aria-label={`Powiększ zdjęcie: ${item.caption}`}
              >
                <Image
                  src={item.image}
                  alt={item.caption || "Zdjęcie ze studia Balance"}
                  className={`photo-warm w-full ${item.ratio || "aspect-[4/5]"}`}
                />
                <span className="absolute inset-0 flex items-end justify-end bg-graphite/0 p-3 transition-colors duration-500 group-hover:bg-graphite/15">
                  <span className="flex h-9 w-9 items-center justify-center bg-bone/90 text-graphite opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Expand className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
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
                className="photo-warm max-h-[80vh] w-full"
              />
              <figcaption className="mt-3 text-center text-[0.7rem] uppercase tracking-[0.18em] text-bone/80">
                {active.caption}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}