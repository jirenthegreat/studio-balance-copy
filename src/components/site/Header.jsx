import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { CONTACT } from "@/lib/images";

const NAV = [
  { label: "O studiu", to: "/", hash: "o-studiu" },
  { label: "Oferta", to: "/", hash: "oferta" },
  { label: "Grafik", to: "/grafik" },
  { label: "Cennik", to: "/", hash: "cennik" },
  { label: "Galeria", to: "/", hash: "galeria" },
  { label: "Kontakt", to: "/", hash: "kontakt" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-ink/10 bg-surface/75 px-3 py-2 shadow-[0_14px_44px_-28px_rgba(43,29,26,0.6)] backdrop-blur-xl md:px-4">
        <Link
          to="/"
          aria-label="Studio Balance — strona główna"
          className="pl-2 pr-1"
        >
          <Logo />
        </Link>

        <nav aria-label="Nawigacja główna" className="hidden items-center lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={item.hash}
              className="rounded-full px-3.5 py-2 text-[0.86rem] text-ink/65 transition-colors hover:bg-ink/[0.05] hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CONTACT.phoneHref}
            className="hidden text-[0.84rem] text-ink/55 transition-colors hover:text-ink md:block"
          >
            {CONTACT.phone}
          </a>
          <Link
            to="/grafik"
            className="btn btn-primary hidden !min-h-[42px] !px-5 !text-[0.8rem] md:inline-flex"
          >
            Zarezerwuj
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 -z-10 bg-canvas px-6 pb-12 pt-28 lg:hidden">
          <nav aria-label="Nawigacja mobilna" className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                className="border-b border-ink/10 py-4 text-[1.5rem] font-medium tracking-[-0.02em]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/grafik" className="btn btn-primary w-full">
              Zarezerwuj zajęcia
            </Link>
            <Link to="/trening-personalny" className="btn btn-outline w-full">
              Trening personalny
            </Link>
            <a href={CONTACT.phoneHref} className="btn btn-outline w-full">
              {CONTACT.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}