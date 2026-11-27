import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const KEY = "sb-consent-v1";

function pushConsent(granted) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved) pushConsent(saved === "granted");
    else setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener("sb-consent-open", reopen);
    return () => window.removeEventListener("sb-consent-open", reopen);
  }, []);

  const choose = (granted) => {
    window.localStorage.setItem(KEY, granted ? "granted" : "denied");
    pushConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Zgoda na pliki cookies"
      className="fixed inset-x-0 bottom-0 z-[9999] border-t border-graphite/15 bg-bone/98 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="max-w-2xl text-[0.8rem] leading-relaxed text-graphite/70">
          Używamy plików cookies, żeby strona działała poprawnie i żebyśmy
          wiedzieli, które treści są przydatne. Możesz zaakceptować wszystkie
          albo tylko te niezbędne. Szczegóły w{" "}
          <Link to="/polityka-prywatnosci" className="underline underline-offset-2">
            polityce prywatności
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose(false)}
            className="btn btn-outline !min-h-[44px] flex-1 !px-5 !text-[0.62rem] md:flex-none"
          >
            Tylko niezbędne
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="btn btn-primary !min-h-[44px] flex-1 !px-5 !text-[0.62rem] md:flex-none"
          >
            Akceptuję wszystkie
          </button>
        </div>
      </div>
    </div>
  );
}