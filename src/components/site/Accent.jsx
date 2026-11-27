import { Fragment } from "react";

/**
 * Zamienia fragmenty w gwiazdkach na kursywę szeryfową:
 * "Znajdź swoją *równowagę*." → Znajdź swoją <em>równowagę</em>.
 */
export default function Accent({ text }) {
  const parts = String(text ?? "").split("*");
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="site-accent">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}