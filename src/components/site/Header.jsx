import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { CONTACT } from "@/lib/images";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Studio", to: "/", hash: "o-studiu" },
  { label: "Oferta", to: "/", hash: "oferta" },
  { label: "Grafik", to: "/grafik" },
  { label: "Cennik", to: "/", hash: "cennik" },
  { label: "Kontakt", to: "/", hash: "kontakt" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2 transition-all duration-500",
          scrolled || open
            ? "bg-linen/80 shadow-[0_8px_30px_-12px_rgba(43,29,26,0.25)] backdrop-blur-xl"
            : "bg-linen/55 backdrop-blur-md"
        )}
      >
        <Link to="/" aria-label="Studio Balance — strona główna" className="py-1.5">
          <Logo />
        </Link>

        <nav aria-label="Nawigacja główna" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={item.hash}
              className="rounded-full px-3.5 py-2 text-[0.9rem] text-graphite/70 transition-colors hover:bg-graphite/5 hover:text-graphite"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={CONTACT.phoneHref}
            className="hidden rounded-full px-3 py-2 text-[0.88rem] text-graphite/70 transition-colors hover:text-graphite md:block"
          >
            {CONTACT.phone}
          </a>
          <Link to="/grafik" className="btn btn-primary hidden !min-h-[42px] md:inline-flex">
            Zarezerwuj
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-graphite text-linen lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Zamknij menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 -z-10 bg-bone/70 backdrop-blur-md lg:hidden"
        />
      )}
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-[28px] bg-linen p-3 shadow-[0_20px_50px_-20px_rgba(43,29,26,0.35)] lg:hidden">
          <nav aria-label="Nawigacja mobilna" className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                className="rounded-2xl px-4 py-3.5 text-[1.35rem] font-medium tracking-[-0.03em] hover:bg-graphite/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-2 grid gap-2 p-1 sm:grid-cols-2">
            <Link to="/grafik" className="btn btn-primary w-full">
              Zarezerwuj zajęcia
            </Link>
            <Link to="/trening-personalny" className="btn btn-outline w-full">
              Trening personalny
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
