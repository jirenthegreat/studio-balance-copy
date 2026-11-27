import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import MeetPaula from "@/components/site/MeetPaula";
import Team from "@/components/site/Team";
import Offer from "@/components/site/Offer";
import Marquee from "@/components/site/Marquee";
import HowItWorks from "@/components/site/HowItWorks";
import Stats from "@/components/site/Stats";
import MobileCta from "@/components/site/MobileCta";
import Schedule from "@/components/site/Schedule";
import Pricing from "@/components/site/Pricing";
import Gallery from "@/components/site/Gallery";
import Reviews from "@/components/site/Reviews";
import CtaBand from "@/components/site/CtaBand";
import Faq from "@/components/site/Faq";
import Contact from "@/components/site/Contact";
import { getSiteContent, sendContactMessage } from "@/lib/server-fns";
import { IMG, CONTACT } from "@/lib/images";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: "Studio Balance",
  description:
    "Butikowe studio treningowe w Lublinie: pilates, spinning, stretching, trening personalny i zajęcia dla mam w grupach do 4 osób.",
  image: IMG.hero,
  telephone: "+48730730357",
  priceRange: "$$",
  currenciesAccepted: "PLN",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Aleje Racławickie 10/14, lok. 14",
    addressLocality: "Lublin",
    postalCode: "20-037",
    addressCountry: "PL",
  },
  areaServed: "Lublin",
  sameAs: [CONTACT.facebook],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "20:00",
    },
  ],
};

export const Route = createFileRoute("/_site/")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      {
        title:
          "Studio Balance — pilates, spinning i trening personalny w Lublinie",
      },
      {
        name: "description",
        content:
          "Kameralne studio treningowe w Unia Art Residence w Lublinie. Pilates Lublin, trening personalny Lublin, spinning Lublin, zajęcia dla mam Lublin — grupy do 4 osób.",
      },
      {
        name: "keywords",
        content:
          "pilates Lublin, trening personalny Lublin, spinning Lublin, zajęcia dla mam Lublin, studio treningowe Lublin",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Studio Balance — znajdź swoją równowagę" },
      {
        property: "og:description",
        content:
          "Treningi personalne i zajęcia w kameralnych grupach do 4 osób, w Unia Art Residence w Lublinie.",
      },
      { property: "og:image", content: IMG.hero },
      { property: "og:locale", content: "pl_PL" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { types, sessions, plans, gallery, reviews, instructors, settings } =
    Route.useLoaderData();

  const lead = instructors[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Hero />
      <About />
      <MeetPaula
        instructor={
          lead
            ? {
                name: lead.name,
                role: lead.role,
                photo: lead.photo,
                specializations: lead.specializations,
                certificate: lead.certificate,
                certificate_issuer: lead.certificate_issuer,
              }
            : undefined
        }
      />
      <Offer offers={types.length ? types : undefined} />
      <Marquee />
      <HowItWorks />
      <Stats />
      <Schedule sessions={sessions} />
      <Pricing
        plans={plans.length ? plans : undefined}
        promo={
          settings
            ? { enabled: settings.promo_enabled, text: settings.promo_text }
            : undefined
        }
      />
      <Gallery images={gallery.length ? gallery : undefined} />
      <Reviews reviews={reviews} />
      <CtaBand />
      <Team instructors={instructors} />
      <Faq />
      <Contact
        onSubmit={(form) => sendContactMessage({ data: { ...form } })}
      />
      <div className="h-16 md:hidden" aria-hidden="true" />
      <MobileCta />
    </>
  );
}