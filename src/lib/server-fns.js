import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import {
  arr,
  addDays,
  isoDate,
  weekdayOf,
  toMin,
  toTime,
  overlaps,
  formatDatePl,
  fillTemplate,
  getSettings,
  sendMail,
  siteUrl,
  DEFAULT_SETTINGS,
} from "@/lib/booking.server";

const NAME = z.string().trim().min(2).max(60);
const PHONE = z.string().trim().max(30).optional().default("");
const EMAIL = z.string().trim().email().max(120);
const NOTES = z.string().trim().max(600).optional().default("");

function requireAdmin(context) {
  if (context.user?.role !== "admin") {
    throw Object.assign(new Error("Brak uprawnień"), { status: 403 });
  }
}

function requireStaff(context) {
  const role = context.user?.role;
  if (role !== "admin" && role !== "user") {
    throw Object.assign(new Error("Brak uprawnień"), { status: 403 });
  }
}

async function loadSchedule(base44, { from, to, instructorId } = {}) {
  const sr = base44.asServiceRole;
  const start = from || isoDate(new Date());
  const end = to || addDays(start, 27);
  const query = { date: { $gte: start, $lte: end } };
  if (instructorId) query.instructor_id = instructorId;

  const sessions = arr(
    await sr.entities.ClassSession.filter(query, { sort: "date" })
  )
    .filter((s) => s.status !== "odwolane")
    .sort((a, b) =>
      `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
    );

  const ids = sessions.map((s) => s.id);
  const bookings = ids.length
    ? arr(await sr.entities.Booking.filter({ session_id: { $in: ids } }))
    : [];

  const counts = {};
  bookings.forEach((b) => {
    if (b.status === "potwierdzona" || b.status === "obecna") {
      counts[b.session_id] = (counts[b.session_id] || 0) + 1;
    }
  });

  return sessions.map((s) => ({
    id: s.id,
    date: s.date,
    time: s.time,
    name: s.class_name,
    color: s.color,
    duration: s.duration,
    instructor: s.instructor_name,
    instructor_id: s.instructor_id,
    instructor_photo: s.instructor_photo,
    capacity: s.capacity ?? 4,
    booked: counts[s.id] || 0,
    class_type_id: s.class_type_id,
    is_demo: s.is_demo,
  }));
}

/* ---------------------------- treści strony ---------------------------- */

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;

    const [typesRes, plansRes, galleryRes, reviewsRes, instructorsRes, settings] =
      await Promise.all([
        sr.entities.ClassType.filter({ active: true }, { sort: "order" }),
        sr.entities.PricingPlan.filter({ active: true }, { sort: "order" }),
        sr.entities.GalleryImage.filter({ active: true }, { sort: "order" }),
        sr.entities.Review.filter({ published: true }, { sort: "order" }),
        sr.entities.Instructor.filter({ active: true }, { sort: "order" }),
        getSettings(base44),
      ]);

    const sessions = await loadSchedule(base44);

    return {
      types: arr(typesRes).map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        duration: t.duration ? `${t.duration} min` : "",
        level: t.level,
        for_whom: t.for_whom,
        quote: t.quote,
        price: t.price,
        image: t.image,
        icon: t.icon,
        is_group: t.is_group !== false,
        link: t.is_group === false ? "/trening-personalny" : "/grafik",
      })),
      plans: arr(plansRes),
      gallery: arr(galleryRes).map((g) => ({
        id: g.id,
        image: g.image,
        caption: g.caption,
      })),
      reviews: arr(reviewsRes),
      instructors: arr(instructorsRes),
      sessions,
      settings: {
        promo_enabled: settings.promo_enabled,
        promo_text: settings.promo_text,
        cancellation_hours: settings.cancellation_hours,
        default_capacity: settings.default_capacity,
        senior_note: settings.senior_note,
      },
    };
  }
);

/* ------------------------- zajęcia grupowe ------------------------- */

export const getSessionForBooking = createServerFn({ method: "GET" })
  .validator(z.object({ sessionId: z.string().min(1).max(64) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    let session;
    try {
      session = await sr.entities.ClassSession.get(data.sessionId);
    } catch {
      return null;
    }
    if (!session || session.status === "odwolane") return null;

    const bookings = arr(
      await sr.entities.Booking.filter({ session_id: session.id })
    );
    const booked = bookings.filter(
      (b) => b.status === "potwierdzona" || b.status === "obecna"
    ).length;
    const settings = await getSettings(base44);

    return {
      id: session.id,
      name: session.class_name,
      color: session.color,
      date: session.date,
      time: session.time,
      duration: session.duration,
      instructor: session.instructor_name,
      capacity: session.capacity ?? settings.default_capacity,
      booked,
      free: Math.max(0, (session.capacity ?? settings.default_capacity) - booked),
      cancellation_hours: settings.cancellation_hours,
    };
  });

export const createGroupBooking = createServerFn({ method: "POST" })
  .validator(
    z.object({
      session_id: z.string().min(1).max(64),
      first_name: NAME,
      last_name: NAME,
      phone: PHONE,
      email: EMAIL,
      notes: NOTES,
      consent: z.literal(true),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const settings = await getSettings(base44);

    let session;
    try {
      session = await sr.entities.ClassSession.get(data.session_id);
    } catch {
      return { ok: false, error: "Nie znaleźliśmy tych zajęć." };
    }
    if (!session || session.status === "odwolane") {
      return { ok: false, error: "Te zajęcia zostały odwołane." };
    }

    const startsAt = new Date(`${session.date}T${session.time}:00`);
    if (startsAt.getTime() < Date.now()) {
      return { ok: false, error: "Ten termin już się odbył." };
    }

    const existing = arr(
      await sr.entities.Booking.filter({
        session_id: session.id,
        email: data.email.toLowerCase(),
      })
    ).filter((b) => b.status === "potwierdzona" || b.status === "lista_rezerwowa");
    if (existing.length) {
      return {
        ok: false,
        error: "Ten adres e-mail jest już zapisany na te zajęcia.",
      };
    }

    const all = arr(await sr.entities.Booking.filter({ session_id: session.id }));
    const confirmed = all.filter(
      (b) => b.status === "potwierdzona" || b.status === "obecna"
    ).length;
    const capacity = session.capacity ?? settings.default_capacity;
    const status = confirmed < capacity ? "potwierdzona" : "lista_rezerwowa";
    const cancelToken = crypto.randomUUID();

    const booking = await sr.entities.Booking.create({
      session_id: session.id,
      session_date: session.date,
      session_time: session.time,
      class_name: session.class_name,
      instructor_name: session.instructor_name,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email.toLowerCase(),
      notes: data.notes,
      status,
      cancel_token: cancelToken,
      reminder_sent: false,
    });

    const cancelUrl = `${siteUrl(context)}/odwolaj/${cancelToken}`;
    const vars = {
      imie: data.first_name,
      zajecia: session.class_name,
      data: formatDatePl(session.date),
      godzina: session.time,
      instruktor: session.instructor_name,
      godziny: settings.cancellation_hours,
      link: cancelUrl,
    };

    const isWaitlist = status === "lista_rezerwowa";
    const subject = fillTemplate(
      isWaitlist ? settings.email_waitlist_subject : settings.email_confirmation_subject,
      vars
    );
    const body = fillTemplate(
      isWaitlist ? settings.email_waitlist_body : settings.email_confirmation_body,
      vars
    );
    const emailSent = await sendMail(base44, {
      to: booking.email,
      subject,
      body,
      heading: isWaitlist
        ? "Jesteś na liście rezerwowej"
        : "Twoje miejsce jest zarezerwowane",
      ctaLabel: isWaitlist ? "Zobacz rezerwację" : "Szczegóły rezerwacji",
      ctaUrl: cancelUrl,
    });

    return {
      ok: true,
      status,
      emailSent,
      booking: {
        id: booking.id,
        first_name: booking.first_name,
        email: booking.email,
        class_name: booking.class_name,
        date: booking.session_date,
        time: booking.session_time,
        instructor: booking.instructor_name,
        cancel_token: booking.cancel_token,
      },
    };
  });

export const getBookingByToken = createServerFn({ method: "GET" })
  .validator(z.object({ token: z.string().min(8).max(80) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const list = arr(
      await sr.entities.Booking.filter({ cancel_token: data.token })
    );
    const booking = list[0];
    if (!booking) return null;

    const settings = await getSettings(base44);
    const startsAt = new Date(
      `${booking.session_date}T${booking.session_time}:00`
    ).getTime();
    const limit = startsAt - settings.cancellation_hours * 3600 * 1000;

    return {
      id: booking.id,
      first_name: booking.first_name,
      last_name: booking.last_name,
      class_name: booking.class_name,
      instructor: booking.instructor_name,
      date: booking.session_date,
      time: booking.session_time,
      status: booking.status,
      cancellation_hours: settings.cancellation_hours,
      can_cancel:
        ["potwierdzona", "lista_rezerwowa"].includes(booking.status) &&
        Date.now() < limit,
      starts_at: startsAt,
    };
  });

export const cancelBookingByToken = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(8).max(80) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const settings = await getSettings(base44);

    const list = arr(
      await sr.entities.Booking.filter({ cancel_token: data.token })
    );
    const booking = list[0];
    if (!booking) return { ok: false, error: "Nie znaleźliśmy rezerwacji." };
    if (!["potwierdzona", "lista_rezerwowa"].includes(booking.status)) {
      return { ok: false, error: "Ta rezerwacja nie jest już aktywna." };
    }

    const startsAt = new Date(
      `${booking.session_date}T${booking.session_time}:00`
    ).getTime();
    if (Date.now() > startsAt - settings.cancellation_hours * 3600 * 1000) {
      return {
        ok: false,
        error: `Rezerwację można odwołać najpóźniej ${settings.cancellation_hours} godzin przed zajęciami. Zadzwoń do nas: 730 730 357.`,
      };
    }

    const wasConfirmed = booking.status === "potwierdzona";
    await sr.entities.Booking.update(booking.id, { status: "odwolana" });

    const vars = {
      imie: booking.first_name,
      zajecia: booking.class_name,
      data: formatDatePl(booking.session_date),
      godzina: booking.session_time,
      godziny: settings.cancellation_hours,
      link: "",
    };
    await sendMail(base44, {
      to: booking.email,
      subject: fillTemplate(settings.email_cancel_subject, vars),
      body: fillTemplate(settings.email_cancel_body, vars),
      heading: "Rezerwacja odwołana",
    });

    let promoted = null;
    if (wasConfirmed) {
      const waitlist = arr(
        await sr.entities.Booking.filter({
          session_id: booking.session_id,
          status: "lista_rezerwowa",
        })
      ).sort((a, b) =>
        String(a.created_date).localeCompare(String(b.created_date))
      );
      const next = waitlist[0];
      if (next) {
        await sr.entities.Booking.update(next.id, { status: "potwierdzona" });
        const nextVars = {
          ...vars,
          imie: next.first_name,
          link: `${siteUrl(context)}/odwolaj/${next.cancel_token}`,
        };
        await sendMail(base44, {
          to: next.email,
          subject: fillTemplate(settings.email_confirmation_subject, nextVars),
          body: fillTemplate(settings.email_confirmation_body, nextVars),
          heading: "Zwolniło się miejsce — masz je!",
          ctaLabel: "Szczegóły rezerwacji",
          ctaUrl: nextVars.link,
        });
        promoted = next.first_name;
      }
    }

    return { ok: true, promoted };
  });

/* ------------------------- trening personalny ------------------------- */

export const getPersonalInstructors = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const base44 = context.getBase44();
    const list = arr(
      await base44.asServiceRole.entities.Instructor.filter(
        { active: true, does_personal_training: true },
        { sort: "order" }
      )
    );
    return list.map((i) => ({
      id: i.id,
      name: i.name,
      role: i.role,
      photo: i.photo,
    }));
  }
);

export const getPersonalAvailability = createServerFn({ method: "GET" })
  .validator(
    z.object({
      instructorId: z.string().min(1).max(64),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const weekday = weekdayOf(data.date);
    if (weekday > 5) return { slots: [] };

    const availability = arr(
      await sr.entities.Availability.filter({
        instructor_id: data.instructorId,
        weekday,
        active: true,
      })
    );
    if (!availability.length) return { slots: [] };

    const [sessionsRes, blockedRes, personalRes] = await Promise.all([
      sr.entities.ClassSession.filter({
        instructor_id: data.instructorId,
        date: data.date,
      }),
      sr.entities.BlockedSlot.filter({
        instructor_id: data.instructorId,
        date: data.date,
      }),
      sr.entities.PersonalBooking.filter({
        instructor_id: data.instructorId,
        date: data.date,
      }),
    ]);

    const busy = [];
    arr(sessionsRes)
      .filter((s) => s.status !== "odwolane")
      .forEach((s) => {
        const start = toMin(s.time);
        busy.push([start, start + (s.duration || 60)]);
      });
    arr(blockedRes).forEach((b) => {
      busy.push([toMin(b.start_time), toMin(b.end_time)]);
    });
    arr(personalRes)
      .filter((p) => p.status !== "odwolana")
      .forEach((p) => {
        const start = toMin(p.time);
        busy.push([start, start + (p.duration || 60)]);
      });

    const slots = [];
    availability.forEach((a) => {
      for (let t = toMin(a.start_time); t + 60 <= toMin(a.end_time); t += 60) {
        const end = t + 60;
        if (busy.some(([bs, be]) => overlaps(t, end, bs, be))) continue;
        slots.push(toTime(t));
      }
    });

    const now = new Date();
    const isToday = data.date === isoDate(now);
    const nowMin = now.getHours() * 60 + now.getMinutes();

    return {
      slots: [...new Set(slots)]
        .sort()
        .filter((s) => !isToday || toMin(s) > nowMin + 60),
    };
  });

export const createPersonalBookingRequest = createServerFn({ method: "POST" })
  .validator(
    z.object({
      instructor_id: z.string().min(1).max(64),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      time: z.string().regex(/^\d{2}:\d{2}$/),
      training_type: z.enum(["solo", "para"]),
      first_name: NAME,
      last_name: NAME,
      phone: PHONE,
      email: EMAIL,
      goal: z.string().trim().max(800).optional().default(""),
      consent: z.literal(true),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const settings = await getSettings(base44);

    const startsAt = new Date(`${data.date}T${data.time}:00`);
    if (startsAt.getTime() < Date.now()) {
      return { ok: false, error: "Wybierz termin z przyszłości." };
    }

    const [sessionsRes, blockedRes, personalRes] = await Promise.all([
      sr.entities.ClassSession.filter({
        instructor_id: data.instructor_id,
        date: data.date,
      }),
      sr.entities.BlockedSlot.filter({
        instructor_id: data.instructor_id,
        date: data.date,
      }),
      sr.entities.PersonalBooking.filter({
        instructor_id: data.instructor_id,
        date: data.date,
      }),
    ]);

    const start = toMin(data.time);
    const end = start + 60;
    const taken =
      arr(sessionsRes).some((s) => {
        if (s.status === "odwolane") return false;
        const s0 = toMin(s.time);
        return overlaps(start, end, s0, s0 + (s.duration || 60));
      }) ||
      arr(blockedRes).some((b) =>
        overlaps(start, end, toMin(b.start_time), toMin(b.end_time))
      ) ||
      arr(personalRes).some((p) => {
        if (p.status === "odwolana") return false;
        const p0 = toMin(p.time);
        return overlaps(start, end, p0, p0 + (p.duration || 60));
      });

    if (taken) {
      return { ok: false, error: "Ten termin został właśnie zajęty. Wybierz inny." };
    }

    let instructor;
    try {
      instructor = await sr.entities.Instructor.get(data.instructor_id);
    } catch {
      return { ok: false, error: "Nie znaleźliśmy trenerki." };
    }

    const cancelToken = crypto.randomUUID();
    const booking = await sr.entities.PersonalBooking.create({
      instructor_id: data.instructor_id,
      instructor_name: instructor?.name || "",
      date: data.date,
      time: data.time,
      duration: 60,
      training_type: data.training_type,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email.toLowerCase(),
      goal: data.goal,
      status: "oczekuje",
      cancel_token: cancelToken,
    });

    const vars = {
      imie: data.first_name,
      data: formatDatePl(data.date),
      godzina: data.time,
      instruktor: instructor?.name || "",
    };
    const emailSent = await sendMail(base44, {
      to: booking.email,
      subject: fillTemplate(settings.email_personal_subject, vars),
      body: fillTemplate(settings.email_personal_body, vars),
      heading: "Zgłoszenie przyjęte",
    });

    return {
      ok: true,
      emailSent,
      booking: {
        date: booking.date,
        time: booking.time,
        instructor: booking.instructor_name,
        training_type: booking.training_type,
      },
    };
  });

/* ----------------------------- kontakt ----------------------------- */

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: NAME,
      email: EMAIL,
      phone: PHONE,
      message: z.string().trim().min(5).max(2000),
      consent: z.literal(true),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await base44.asServiceRole.entities.ContactMessage.create({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      message: data.message,
      handled: false,
    });
    return { ok: true };
  });

/* ------------------------------- panel ------------------------------- */

export const markAttendance = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      bookingId: z.string().min(1).max(64),
      status: z.enum(["obecna", "nieobecna", "potwierdzona"]),
    })
  )
  .handler(async ({ data, context }) => {
    requireStaff(context);
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;

    let booking;
    try {
      booking = await sr.entities.Booking.get(data.bookingId);
    } catch {
      return { ok: false, error: "Nie znaleźliśmy rezerwacji." };
    }

    await sr.entities.Booking.update(booking.id, { status: data.status });

    if (data.status === "obecna" && booking.status !== "obecna") {
      const passes = arr(
        await sr.entities.ClientPass.filter({ email: booking.email })
      ).filter(
        (p) =>
          (p.entries_total || 0) - (p.entries_used || 0) > 0 &&
          (!p.valid_until || p.valid_until >= isoDate(new Date()))
      );
      if (passes[0]) {
        await sr.entities.ClientPass.update(passes[0].id, {
          entries_used: (passes[0].entries_used || 0) + 1,
        });
      }
    }

    return { ok: true };
  });

export const confirmPersonalBooking = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const settings = await getSettings(base44);

    const booking = await sr.entities.PersonalBooking.update(data.id, {
      status: "potwierdzona",
    });

    const vars = {
      imie: booking.first_name,
      data: formatDatePl(booking.date),
      godzina: booking.time,
      instruktor: booking.instructor_name,
    };
    const emailSent = await sendMail(base44, {
      to: booking.email,
      subject: fillTemplate(settings.email_personal_confirmed_subject, vars),
      body: fillTemplate(settings.email_personal_confirmed_body, vars),
      heading: "Trening potwierdzony",
    });

    return { ok: true, emailSent };
  });

export const cancelPersonalBooking = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().min(1).max(64) }))
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const base44 = context.getBase44();
    await base44.asServiceRole.entities.PersonalBooking.update(data.id, {
      status: "odwolana",
    });
    return { ok: true };
  });

export const cancelSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      id: z.string().min(1).max(64),
      reason: z.string().trim().max(300).optional().default(""),
    })
  )
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const settings = await getSettings(base44);

    const session = await sr.entities.ClassSession.update(data.id, {
      status: "odwolane",
      cancel_reason: data.reason,
    });

    const bookings = arr(
      await sr.entities.Booking.filter({
        session_id: data.id,
        status: { $in: ["potwierdzona", "lista_rezerwowa"] },
      })
    );

    let emailed = 0;
    for (const booking of bookings) {
      await sr.entities.Booking.update(booking.id, { status: "odwolana" });
      const vars = {
        imie: booking.first_name,
        zajecia: session.class_name,
        data: formatDatePl(session.date),
        godzina: session.time,
        godziny: settings.cancellation_hours,
        link: "",
      };
      const sent = await sendMail(base44, {
        to: booking.email,
        subject: `Odwołane zajęcia — ${session.class_name}, ${vars.data}`,
        body: `${fillTemplate(settings.email_cancel_body, vars)}${
          data.reason ? `\n\nPowód: ${data.reason}` : ""
        }`,
        heading: "Zajęcia zostały odwołane",
      });
      if (sent) emailed += 1;
    }

    return { ok: true, emailed, total: bookings.length };
  });

export const generateSessions = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ weeks: z.number().min(1).max(12).default(4) }))
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;

    const slots = arr(await sr.entities.RecurringSlot.filter({ active: true }));
    if (!slots.length) return { created: 0, skipped: 0 };

    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() + (day === 0 ? 1 : 1 - day));
    const mondayIso = isoDate(monday);

    const existing = arr(
      await sr.entities.ClassSession.filter({
        date: { $gte: mondayIso, $lte: addDays(mondayIso, data.weeks * 7) },
      })
    );
    const taken = new Set(
      existing.map((s) => `${s.date}|${s.time}|${s.class_name}`)
    );

    const toCreate = [];
    for (let week = 0; week < data.weeks; week += 1) {
      slots.forEach((slot) => {
        const date = addDays(mondayIso, week * 7 + (slot.weekday - 1));
        const key = `${date}|${slot.time}|${slot.class_name}`;
        if (taken.has(key)) return;
        taken.add(key);
        toCreate.push({
          class_type_id: slot.class_type_id,
          class_name: slot.class_name,
          color: slot.color,
          instructor_id: slot.instructor_id,
          instructor_name: slot.instructor_name,
          instructor_photo: slot.instructor_photo,
          date,
          time: slot.time,
          duration: slot.duration,
          capacity: slot.capacity ?? 4,
          status: "zaplanowane",
          is_demo: false,
        });
      });
    }

    if (toCreate.length) {
      await sr.entities.ClassSession.bulkCreate(toCreate);
    }
    return { created: toCreate.length, skipped: 0 };
  });

export const sendReminders = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    requireAdmin(context);
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const settings = await getSettings(base44);

    const tomorrow = addDays(isoDate(new Date()), 1);
    const bookings = arr(
      await sr.entities.Booking.filter({
        session_date: tomorrow,
        status: "potwierdzona",
      })
    );

    let sent = 0;
    for (const booking of bookings) {
      if (booking.reminder_sent) continue;
      const vars = {
        imie: booking.first_name,
        zajecia: booking.class_name,
        data: formatDatePl(booking.session_date),
        godzina: booking.session_time,
        godziny: settings.cancellation_hours,
        link: `${siteUrl(context)}/odwolaj/${booking.cancel_token}`,
      };
      const ok = await sendMail(base44, {
        to: booking.email,
        subject: fillTemplate(settings.email_reminder_subject, vars),
        body: fillTemplate(settings.email_reminder_body, vars),
        heading: "Do zobaczenia jutro",
      });
      if (ok) {
        await sr.entities.Booking.update(booking.id, { reminder_sent: true });
        sent += 1;
      }
    }

    return { ok: true, sent, total: bookings.length };
  });

export const ensureSettings = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    requireAdmin(context);
    const base44 = context.getBase44();
    const sr = base44.asServiceRole;
    const list = arr(await sr.entities.StudioSettings.list({ limit: 1 }));
    if (list.length) return { ok: true, id: list[0].id };
    const created = await sr.entities.StudioSettings.create(DEFAULT_SETTINGS);
    return { ok: true, id: created.id };
  });