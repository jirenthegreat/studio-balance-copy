// Pomocnicze funkcje serwerowe dla rezerwacji, maili i slotów.

export const DEFAULT_SETTINGS = {
  cancellation_hours: 12,
  default_capacity: 4,
  promo_enabled: true,
  promo_text: "−50% na pierwszy trening personalny",
  senior_note: "Honorujemy Lubelską Kartę Seniora.",
  email_confirmation_subject: "Rezerwacja potwierdzona — {{zajecia}}, {{data}}",
  email_confirmation_body:
    "Dzień dobry {{imie}},\n\nTwoje miejsce na zajęciach „{{zajecia}}” w {{data}} o {{godzinie}} jest zarezerwowane.\n\nStudio Balance, Unia Art Residence, Aleje Racławickie 10/14, Lublin.\n\nJeśli nie możesz przyjść, odwołaj rezerwację najpóźniej {{godziny}} godzin przed zajęciami: {{link}}\n\nDo zobaczenia!",
  email_waitlist_subject: "Lista rezerwowa — {{zajecia}}, {{data}}",
  email_waitlist_body:
    "Dzień dobry {{imie}},\n\nZajęcia „{{zajecia}}” w {{data}} o {{godzinie}} są w tej chwili pełne, więc zapisujemy Cię na listę rezerwową. Jeśli ktoś odwoła udział, napiszemy do Ciebie od razu.\n\nMożesz też zrezygnować z listy: {{link}}\n\nStudio Balance",
  email_cancel_subject: "Rezerwacja odwołana — {{zajecia}}, {{data}}",
  email_cancel_body:
    "Dzień dobry {{imie}},\n\nTwoja rezerwacja na „{{zajecia}}” w {{data}} o {{godzinie}} została odwołana. Miejsce wróciło do grafiku.\n\nDo zobaczenia innym razem!\nStudio Balance",
  email_reminder_subject: "Przypomnienie: jutro {{zajecia}} o {{godzinie}}",
  email_reminder_body:
    "Dzień dobry {{imie}},\n\nPrzypominamy o jutrzejszych zajęciach „{{zajecia}}” o {{godzinie}}.\n\nDo zobaczenia w Studio Balance.",
  email_personal_subject: "Trening personalny — zgłoszenie przyjęte",
  email_personal_body:
    "Dzień dobry {{imie}},\n\nDziękujemy za zgłoszenie na trening personalny w {{data}} o {{godzinie}}. Potwierdzimy je mailem.\n\nStudio Balance",
  email_personal_confirmed_subject: "Trening personalny potwierdzony — {{data}}, {{godzina}}",
  email_personal_confirmed_body:
    "Dzień dobry {{imie}},\n\nTwój trening personalny w {{data}} o {{godzinie}} jest potwierdzony. Spotykamy się w Studio Balance, Unia Art Residence, Aleje Racławickie 10/14.\n\nDo zobaczenia!",
};

export const MONTHS_PL = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];

export const WEEKDAYS_PL = [
  "niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota",
];

export function arr(result) {
  if (Array.isArray(result)) return result;
  return result?.items ?? [];
}

export function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return isoDate(d);
}

/** 1 = poniedziałek … 7 = niedziela */
export function weekdayOf(dateStr) {
  const day = new Date(`${dateStr}T12:00:00`).getDay();
  return day === 0 ? 7 : day;
}

export function toMin(time) {
  const [h, m] = String(time || "0:0").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function toTime(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}`;
}

export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

export function formatDatePl(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T12:00:00`);
  return `${WEEKDAYS_PL[d.getDay()]}, ${d.getDate()} ${MONTHS_PL[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortPl(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T12:00:00`);
  return `${WEEKDAYS_PL[d.getDay()]} ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function fillTemplate(template, vars) {
  return String(template || "").replace(/\{\{(\w+)\}\}/g, (match, key) =>
    vars[key] !== undefined && vars[key] !== null ? String(vars[key]) : ""
  );
}

export async function getSettings(base44) {
  try {
    const list = await base44.asServiceRole.entities.StudioSettings.list({
      limit: 1,
    });
    const stored = arr(list)[0] || {};
    return { ...DEFAULT_SETTINGS, ...stored };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function emailLayout({ heading, body, ctaLabel, ctaUrl, footnote }) {
  const paragraphs = String(body || "")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map(
      (line) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.75;color:#3a3733">${line}</p>`
    )
    .join("");

  const button =
    ctaUrl && ctaLabel
      ? `<p style="margin:26px 0 6px"><a href="${ctaUrl}" style="display:inline-block;background:#2B2B2B;color:#F7F3EE;text-decoration:none;padding:14px 26px;font-size:12px;letter-spacing:.18em;text-transform:uppercase">${ctaLabel}</a></p>`
      : "";

  return `<div style="background:#F7F3EE;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">
  <div style="max-width:540px;margin:0 auto;background:#FFFDFA;border:1px solid #E8DCCB;padding:34px 30px">
    <p style="margin:0 0 26px;font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#2B2B2B">Studio Balance</p>
    <h1 style="margin:0 0 18px;font-family:Georgia,serif;font-weight:400;font-size:25px;line-height:1.25;color:#2B2B2B">${heading}</h1>
    ${paragraphs}
    ${button}
    <p style="margin:26px 0 0;padding-top:16px;border-top:1px solid #E8DCCB;font-size:12px;line-height:1.7;color:#8a827a">
      Studio Balance · Unia Art Residence<br/>
      Aleje Racławickie 10/14, 20-037 Lublin<br/>
      730 730 357${footnote ? `<br/>${footnote}` : ""}
    </p>
  </div>
</div>`;
}

export async function sendMail(base44, { to, subject, body, heading, ctaLabel, ctaUrl }) {
  if (!to) return false;
  try {
    await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      subject,
      body: emailLayout({
        heading: heading || subject,
        body,
        ctaLabel,
        ctaUrl,
      }),
    });
    return true;
  } catch (error) {
    console.error("Nie udało się wysłać maila:", error?.message);
    return false;
  }
}

export function siteUrl(context) {
  try {
    const url = new URL(context?.request?.url);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "https://studiobalance.base44.app";
  }
}