import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/site/LegalPage";

const SECTIONS = [
  {
    heading: "1. Postanowienia ogólne",
    body: [
      "Regulamin określa zasady korzystania z zajęć i treningów organizowanych przez Studio Balance — Paula Kruszyńska, Aleje Racławickie 10/14, lok. 14, 20-037 Lublin.",
      "Zapisując się na zajęcia, akceptujesz niniejszy regulamin oraz politykę prywatności.",
    ],
  },
  {
    heading: "2. Rezerwacje",
    body: [
      "Rezerwacje przyjmujemy przez stronę internetową oraz telefonicznie. Zapis nie wymaga zakładania konta — wystarczy imię, nazwisko, telefon i adres e-mail.",
      "Liczba miejsc w grupie jest ograniczona (domyślnie 4 osoby). Rezerwacja jest ważna po otrzymaniu potwierdzenia e-mail.",
      "Jeśli grupa jest pełna, można zapisać się na listę rezerwową. O zwolnionym miejscu informujemy mailem; osoba z listy otrzymuje je w kolejności zgłoszeń.",
    ],
  },
  {
    heading: "3. Płatności",
    body: [
      "Płatność za zajęcia i treningi przyjmujemy na miejscu. Nie pobieramy opłat online.",
      "Honorujemy Lubelską Kartę Seniora — zniżka udzielana jest w studiu po okazaniu karty.",
    ],
  },
  {
    heading: "4. Odwoływanie zajęć",
    body: [
      "Rezerwację można odwołać bezpłatnie najpóźniej 12 godzin przed rozpoczęciem zajęć, korzystając z linku w mailu potwierdzającym lub telefonicznie.",
      "Późniejsze odwołanie lub nieobecność może skutkować potraktowaniem wizyty jako wykorzystanej — dotyczy to w szczególności karnetów.",
      "W przypadku odwołania zajęć przez studio informujemy zapisane osoby mailem, a wniesione opłaty są zwracane lub przenoszone na inny termin.",
    ],
  },
  {
    heading: "5. Zdrowie i bezpieczeństwo",
    body: [
      "Przed pierwszym treningiem poinformuj prowadzącą o kontuzjach, ciąży, przebytych operacjach i innych przeciwwskazaniach zdrowotnych.",
      "Zajęcia nie zastępują konsultacji lekarskiej. W przypadku wątpliwości zdrowotnych skonsultuj udział w treningu z lekarzem.",
      "Na terenie studia obowiązuje obuwie zmienne lub skarpetki antypoślizgowe oraz strój sportowy.",
    ],
  },
  {
    heading: "6. Odpowiedzialność",
    body: [
      "Studio dokłada starań, aby zajęcia prowadzone były bezpiecznie i przez wykwalifikowane osoby. Uczestniczki odpowiadają za swoje rzeczy osobiste pozostawione na terenie studia.",
    ],
  },
  {
    heading: "7. Reklamacje",
    body: [
      "Reklamacje i uwagi przyjmujemy telefonicznie (730 730 357). Rozpatrujemy je w ciągu 14 dni od zgłoszenia.",
    ],
  },
  {
    heading: "8. Postanowienia końcowe",
    body: [
      "Studio zastrzega prawo do zmiany grafiku, cen i niniejszego regulaminu. Zmiany obowiązują od dnia publikacji na stronie. W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego.",
    ],
  },
];

export const Route = createFileRoute("/_site/regulamin")({
  head: () => ({
    meta: [
      { title: "Regulamin zajęć — Studio Balance" },
      {
        name: "description",
        content:
          "Zasady rezerwacji, płatności i odwoływania zajęć w Studio Balance w Lublinie.",
      },
    ],
  }),
  component: () => (
    <LegalPage
      overline="Dokumenty"
      title="Regulamin zajęć"
      updated="26 listopada 2026"
      sections={SECTIONS}
    />
  ),
});