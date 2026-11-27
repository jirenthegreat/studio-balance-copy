import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/site/LegalPage";

const SECTIONS = [
  {
    heading: "1. Administrator danych",
    body: [
      "Administratorem danych osobowych jest Studio Balance — Paula Kruszyńska, Aleje Racławickie 10/14, lok. 14, 20-037 Lublin. Kontakt w sprawach danych osobowych: tel. 730 730 357.",
    ],
  },
  {
    heading: "2. Jakie dane zbieramy",
    body: [
      "W formularzu rezerwacji zajęć grupowych: imię, nazwisko, numer telefonu, adres e-mail oraz opcjonalne uwagi (np. informacja o ciąży lub kontuzji).",
      "W formularzu treningu personalnego: dodatkowo informacje o celu treningowym i przeciwwskazaniach zdrowotnych, które podajesz dobrowolnie.",
      "W formularzu kontaktowym: imię, adres e-mail, opcjonalnie telefon i treść wiadomości.",
      "Dane techniczne: adres IP, informacje o urządzeniu i przeglądarce, zapisywane w logach serwera oraz — po Twojej zgodzie — w plikach cookies.",
    ],
  },
  {
    heading: "3. Cel i podstawa prawna",
    body: [
      "Dane przetwarzamy w celu realizacji rezerwacji i obsługi zajęć (art. 6 ust. 1 lit. b RODO — wykonanie umowy), w celu odpowiedzi na wiadomość (art. 6 ust. 1 lit. f — prawnie uzasadniony interes), a także w celu prowadzenia statystyk i poprawy działania strony na podstawie Twojej zgody (art. 6 ust. 1 lit. a).",
    ],
  },
  {
    heading: "4. Jak długo przechowujemy dane",
    body: [
      "Dane z rezerwacji przechowujemy przez 24 miesiące od ostatniej wizyty, dane z formularza kontaktowego — do 12 miesięcy od zakończenia korespondencji. Dane rozliczeniowe przechowujemy przez okres wymagany przepisami podatkowymi.",
    ],
  },
  {
    heading: "5. Odbiorcy danych",
    body: [
      "Dane mogą być przekazywane wyłącznie podmiotom wspierającym działanie studia: dostawcy hostingu i poczty elektronicznej oraz dostawcy systemu rezerwacji. Nie sprzedajemy ani nie udostępniamy danych w celach marketingowych.",
    ],
  },
  {
    heading: "6. Twoje prawa",
    body: [
      "Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu. Zgodę możesz wycofać w każdej chwili. Wniesienie skargi jest możliwe do Prezesa Urzędu Ochrony Danych Osobowych.",
    ],
  },
  {
    heading: "7. Pliki cookies",
    body: [
      "Strona używa plików cookies niezbędnych do działania (m.in. zapamiętanie decyzji o zgodzie) oraz — po wyrażeniu zgody — cookies analitycznych. Zgodę możesz zmienić w każdej chwili, klikając „Ustawienia cookies” w stopce.",
    ],
  },
];

export const Route = createFileRoute("/_site/polityka-prywatnosci")({
  head: () => ({
    meta: [
      { title: "Polityka prywatności — Studio Balance" },
      {
        name: "description",
        content:
          "Zasady przetwarzania danych osobowych i wykorzystania plików cookies w Studio Balance w Lublinie.",
      },
    ],
  }),
  component: () => (
    <LegalPage
      overline="Dokumenty"
      title="Polityka prywatności"
      updated="26 listopada 2026"
      sections={SECTIONS}
    />
  ),
});