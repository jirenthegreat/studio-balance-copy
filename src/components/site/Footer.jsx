import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";
import Logo from "./Logo";
import { CONTACT } from "@/lib/images";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-clay">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-6 max-w-xs text-[0.92rem] leading-relaxed text-ink/55">
              Kameralne studio treningowe w Unia Art Residence. Ruch, oddech
              i spokój — w grupach do czterech osób.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Studio Balance na Facebooku"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink/70 transition-colors hover:bg-ink hover:text-surface"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Studio Balance na Instagramie (@studio_balance_lbn)"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink/70 transition-colors hover:bg-ink hover:text-surface"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.messenger}
                target="_blank"
                rel="noreferrer"
                aria-label="Napisz do nas na Messengerze"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink/70 transition-colors hover:bg-ink hover:text-surface"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[0.8rem] text-ink/40">Kontakt</p>
            <ul className="mt-5 space-y-3 text-[0.92rem] text-ink/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                <span>
                  {CONTACT.place}
                  <br />
                  {CONTACT.street}
                  <br />
                  {CONTACT.city}
                </span>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="flex gap-3 hover:text-ink">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                  {CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.8rem] text-ink/40">Studio</p>
            <ul className="mt-5 space-y-3 text-[0.92rem] text-ink/70">
              <li>
                <Link to="/grafik" className="hover:text-ink">
                  Grafik zajęć
                </Link>
              </li>
              <li>
                <Link to="/trening-personalny" className="hover:text-ink">
                  Trening personalny
                </Link>
              </li>
              <li>
                <Link to="/" hash="cennik" className="hover:text-ink">
                  Cennik
                </Link>
              </li>
              <li>
                <Link to="/" hash="faq" className="hover:text-ink">
                  Pytania i odpowiedzi
                </Link>
              </li>
              <li>
                <Link to="/panel" className="hover:text-ink">
                  Panel studia
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink/10 pt-6 text-[0.82rem] text-ink/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Studio Balance. Wszelkie prawa zastrzeżone.</p>
          <div className="flex flex-wrap gap-6">
            <Link to="/polityka-prywatnosci" className="hover:text-ink">
              Polityka prywatności
            </Link>
            <Link to="/regulamin" className="hover:text-ink">
              Regulamin zajęć
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("sb-consent-open"))}
              className="hover:text-ink"
            >
              Ustawienia cookies
            </button>
          </div>
        </div>
      </div>

      <div className="select-none px-3 pb-4 pt-6" aria-hidden="true">
        <p className="whitespace-nowrap text-center font-medium leading-[0.82] tracking-[-0.05em] text-ink/[0.88] [font-size:clamp(2.3rem,11.4vw,11rem)]">
          Studio Balance
        </p>
      </div>
    </footer>
  );
}