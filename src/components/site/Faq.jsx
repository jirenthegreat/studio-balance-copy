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
    a: "Nie musisz być wytrenowana, ale większość osób u nas ćwiczy regularnie — i to jest dobry punkt wyjścia. Technikę dopasowujemy do poziomu grupy, a przy treningu indywidualnym zaczynamy od Twojego aktualnego stanu. Jeśli wracasz po dłuższej przerwie, powiedz o tym przed zajęciami.",
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
    a: "Studio mieści się w Unia Art Residence przy Alejach Racławickich 10/14. Miejsca parkingowe znajdziesz wzdłuż Alej oraz na parkingach sąsiednich budynków. Wieczorami bywa tłoczno, więc warto przyjść kilka minut wcześniej.",
  },
  {
    q: "Jak mogę zapłacić?",
    a: "Płatność na miejscu. Karnety i pakiety treningowe rozliczamy w studiu, przy pierwszej wizycie. Nie pobieramy żadnych opłat online.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="bg-clay py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:px-10">
        <Reveal>
          <SectionHeading
            overline="FAQ"
            title="Zanim *przyjdziesz*."
            intro="Najczęstsze pytania. Jeśli czegoś brakuje – napisz lub zadzwoń."
          />
        </Reveal>

        <Reveal delay={100}>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border-b border-ink/10"
              >
                <AccordionTrigger className="py-5 text-left text-[1.05rem] font-medium leading-snug tracking-[-0.01em] hover:no-underline [&>svg]:text-ink/35">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-6 text-[0.92rem] leading-[1.8] text-ink/60">
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