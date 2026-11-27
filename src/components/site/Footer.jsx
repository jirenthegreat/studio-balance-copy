import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";
import Logo, { SpiralMark } from "./Logo";
import { CONTACT } from "@/lib/images";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-sand/70">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-graphite/70">
              Kameralne studio treningowe w Unia Art Residence. Ruch, oddech
              i spokój — w grupach do czterech osób.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Studio Balance na Facebooku"
                className="flex h-11 w-11 items-center justify-center border border-graphite/25 transition-colors hover:bg-graphite hover:text-bone"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Studio Balance na Instagramie (@studio_balance_lbn)"
                className="flex h-11 w-11 items-center justify-center border border-graphite/25 transition-colors hover:bg-graphite hover:text-bone"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.messenger}
                target="_blank"
                rel="noreferrer"
                aria-label="Napisz do nas na Messengerze"
                className="flex h-11 w-11 items-center justify-center border border-graphite/25 transition-colors hover:bg-graphite hover:text-bone"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="overline text-graphite/50">Kontakt</p>
            <ul className="mt-5 space-y-3 text-sm text-graphite/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
                <span>
                  {CONTACT.place}
                  <br />
                  {CONTACT.street}
                  <br />
                  {CONTACT.city}
                </span>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="flex gap-3 hover:text-graphite">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
                  {CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="overline text-graphite/50">Studio</p>
            <ul className="mt-5 space-y-3 text-sm text-graphite/80">
              <li>
                <Link to="/grafik" className="hover:text-graphite">
                  Grafik zajęć
                </Link>
              </li>
              <li>
                <Link to="/trening-personalny" className="hover:text-graphite">
                  Trening personalny
                </Link>
              </li>
              <li>
                <Link to="/" hash="cennik" className="hover:text-graphite">
                  Cennik
                </Link>
              </li>
              <li>
                <Link to="/" hash="faq" className="hover:text-graphite">
                  Pytania i odpowiedzi
                </Link>
              </li>
              <li>
                <Link to="/panel" className="hover:text-graphite">
                  Panel studia
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-graphite/15 pt-6 text-[0.72rem] text-graphite/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Studio Balance. Wszelkie prawa zastrzeżone.</p>
          <div className="flex flex-wrap gap-6">
            <Link to="/polityka-prywatnosci" className="hover:text-graphite">
              Polityka prywatności
            </Link>
            <Link to="/regulamin" className="hover:text-graphite">
              Regulamin zajęć
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("sb-consent-open"))}
              className="hover:text-graphite"
            >
              Ustawienia cookies
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none flex items-center justify-center gap-6 pb-8 opacity-[0.09]">
        <span className="font-heading text-[13vw] leading-none tracking-[0.1em] uppercase">
          Studio
        </span>
        <SpiralMark className="h-[9vw] w-[9vw]" strokeWidth={1} />
        <span className="font-heading text-[13vw] leading-none tracking-[0.1em] uppercase">
          Balance
        </span>
      </div>
    </footer>
  );
}