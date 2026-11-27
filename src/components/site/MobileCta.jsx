import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Pływający przycisk rezerwacji na telefonie — pojawia się po przewinięciu hero. */
export default function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-500 md:hidden",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      )}
    >
      <Link
        to="/grafik"
        className="btn btn-primary w-full shadow-[0_18px_40px_-18px_rgba(43,29,26,0.65)]"
      >
        Zarezerwuj zajęcia
      </Link>
    </div>
  );
}