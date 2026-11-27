import { useState } from "react";
import {
  Phone,
  MapPin,
  Facebook,
  Instagram,
  MessageCircle,
  Loader2,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { CONTACT } from "@/lib/images";
import { Checkbox } from "@/components/ui/checkbox";

const EMPTY = { name: "", email: "", phone: "", message: "", consent: false };

export default function Contact({ onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      setError("Zaznacz zgodę na przetwarzanie danych, aby wysłać wiadomość.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await onSubmit?.(form);
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      setError("Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na Messengerze.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="kontakt" className="bg-sand/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <SectionHeading
              overline="Kontakt"
              title="Przyjdź, zobacz, zostań."
              intro="Studio jest w Unia Art Residence — w centrum Lublina, z widokiem na zieleń."
            />

            <ul className="mt-9 space-y-6 text-[0.95rem] text-graphite/75">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
                <span>
                  {CONTACT.place}
                  <br />
                  {CONTACT.street}
                  <br />
                  {CONTACT.city}
                </span>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="flex gap-4 hover:text-graphite">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={CONTACT.messenger}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Messenger
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
                Facebook
              </a>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                Instagram
              </a>
            </div>

            <div className="mt-9 overflow-hidden rounded-[1.25rem] border border-graphite/15">
              <iframe
                title="Mapa dojazdu do Studio Balance, Aleje Racławickie 10/14, Lublin"
                src={CONTACT.mapEmbed}
                className="h-[260px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-graphite/15 bg-bone p-6 md:p-8">
              <h3 className="text-[1.6rem] leading-tight">Napisz do nas</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-graphite/55">
                Napisz, jeśli masz pytanie o zajęcia, termin lub trening
                personalny.
              </p>

              {sent ? (
                <div className="mt-8 border border-sage/40 bg-sage/10 p-6 text-[0.9rem] leading-relaxed text-graphite/75">
                  Dziękujemy za wiadomość. Odpowiemy na podany adres e-mail.
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <Field label="Imię" id="contact-name">
                    <input
                      id="contact-name"
                      required
                      value={form.name}
                      onChange={update("name")}
                      className="input"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="E-mail" id="contact-email">
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      className="input"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Telefon (opcjonalnie)" id="contact-phone">
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      className="input"
                      autoComplete="tel"
                    />
                  </Field>
                  <Field label="Wiadomość" id="contact-message">
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={update("message")}
                      className="input resize-none"
                    />
                  </Field>

                  <label className="flex items-start gap-3 pt-1 text-[0.78rem] leading-relaxed text-graphite/60">
                    <Checkbox
                      checked={form.consent}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, consent: v === true }))
                      }
                      className="mt-0.5 border-graphite/40"
                      aria-label="Zgoda na przetwarzanie danych"
                    />
                    <span>
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w celu
                      odpowiedzi na wiadomość, zgodnie z polityką prywatności.
                    </span>
                  </label>

                  {error && (
                    <p role="alert" className="text-[0.8rem] text-destructive">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn btn-primary w-full"
                  >
                    {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {sending ? "Wysyłanie…" : "Wyślij wiadomość"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.16em] text-graphite/50"
      >
        {label}
      </label>
      {children}
    </div>
  );
}