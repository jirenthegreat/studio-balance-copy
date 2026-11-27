import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const FAQ = [
  {
    q: "Czy muszę mieć doświadczenie w treningu?",
    a: "Nie. W grupie są najwyżej cztery osoby, więc trenerka dobiera ćwiczenia i obciążenie do każdej z nich. Jeśli zaczynasz albo wracasz po przerwie, napisz o tym w uwagach przy zapisie.",
  },
  {
    q: "Co zabrać na zajęcia?",
    a: "Wygodny strój i butelkę wody. Maty, drobny sprzęt, obciążniki i ręczniki są na miejscu. Na spinning przydadzą się buty z twardszą podeszwą, ale zwykłe adidasy też wystarczą.",
  },
  {
    q: "Jak odwołać zajęcia?",
    a: "W mailu potwierdzającym znajdziesz link do odwołania. Wystarczy kliknąć — najpóźniej 12 godzin przed zajęciami. Wtedy miejsce wraca do grafiku, a osoba z listy rezerwowej dostaje wiadomość.",
  },
  {
    q: "Czy prowadzicie zajęcia w ciąży i po porodzie?",
    a: "Tak. Fit Mama to zajęcia dla mam z dzieckiem, a trening personalny pozwala pracować indywidualnie — także w ciąży, po konsultacji z lekarzem. Paula ma certyfikat „Aktywność w ciąży i po porodzie” (Fitness University). Napisz do nas przed pierwszym spotkaniem.",
  },
  {
    q: "Gdzie zaparkować?",
    a: "Studio mieści się w Unia Art Residence przy Alejach Racławickich 10/14. Zapytaj przy zapisie, gdzie najwygodniej zaparkować — podpowiemy.",
  },
  {
    q: "Jak mogę zapłacić?",
    a: "Płatność na miejscu. Karnety i pakiety treningowe rozliczamy w studiu, przy pierwszej wizycie. Nie pobieramy żadnych opłat online.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:px-10">
        <Reveal>
          <SectionHeading
            overline="FAQ"
            title="Zanim przyjdziesz."
            intro="Najczęstsze pytania. Jeśli czegoś brakuje – napisz lub zadzwoń."
          />
        </Reveal>

        <Reveal delay={100}>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border-b border-graphite/15"
              >
                <AccordionTrigger className="py-5 text-left font-heading text-[1.15rem] font-normal leading-snug hover:no-underline [&>svg]:text-graphite/40">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-6 text-[0.9rem] leading-[1.8] text-graphite/65">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}