import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { CONTACT } from "@/lib/images";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "O studiu", to: "/", hash: "o-studiu" },
  { label: "Oferta", to: "/", hash: "oferta" },
  { label: "Grafik", to: "/grafik" },
  { label: "Cennik", to: "/", hash: "cennik" },
  { label: "Galeria", to: "/", hash: "galeria" },
  { label: "Kontakt", to: "/", hash: "kontakt" },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const transparent = pathname === "/" && !solid;

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent py-4 text-bone"
          : "border-b border-graphite/10 bg-bone/90 py-2.5 text-graphite backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 md:px-10">
        <Link to="/" aria-label="Studio Balance — strona główna" className="py-2">
          <Logo />
        </Link>

        <nav aria-label="Nawigacja główna" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={item.hash}
              className="text-[0.72rem] uppercase tracking-[0.18em] opacity-80 transition-opacity hover:opacity-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CONTACT.phoneHref}
            className="hidden items-center gap-2 text-[0.78rem] tracking-wide opacity-80 transition-opacity hover:opacity-100 md:flex"
          >
            {CONTACT.phone}
          </a>
          <Link to="/grafik" className="btn btn-primary hidden md:inline-flex">
            Zarezerwuj
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            className="flex h-12 w-12 items-center justify-center lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[68px] z-40 overflow-y-auto bg-bone px-5 pb-12 pt-6 text-graphite lg:hidden">
          <nav aria-label="Nawigacja mobilna" className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                className="border-b border-graphite/10 py-5 font-heading text-2xl"
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