"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="field-label" htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        className="field-input"
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function Section({
  num,
  title,
  hint,
  children,
}: {
  num: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="card mb-6 !p-6 sm:!p-8">
      <legend className="sr-only">{title}</legend>
      <h2 className="mb-1 flex items-center gap-3 text-base font-bold uppercase tracking-[0.1em]">
        <span
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-cyan text-sm font-bold text-navy3"
          aria-hidden="true"
        >
          {num}
        </span>
        {title}
      </h2>
      {hint && <p className="mb-5 text-[0.85rem] text-muted">{hint}</p>}
      {children}
    </fieldset>
  );
}

export default function OnboardingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const entries: Record<string, string> = {};
    for (const [key, value] of fd.entries()) {
      const v = String(value).trim();
      if (!v) continue;
      entries[key] = entries[key] ? `${entries[key]}, ${v}` : v;
    }

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.sent) {
        setStatus("sent");
        form.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // Email service not configured (or failed) → mailto fallback
      const body = Object.entries(entries)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        `Onboarding form — ${entries["Venue name"] ?? "new venue"}`,
      )}&body=${encodeURIComponent(body).slice(0, 1800)}`;
      setStatus("mailto");
    } catch {
      setStatus("error");
      setErrorMsg(
        `Something went wrong. Please email your answers to ${SITE.email} or call ${SITE.phoneDisplay}.`,
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="card !border-cyan bg-cyan/10 text-center">
        <h2 className="mb-2 text-xl font-bold">Form received — thank you! 🎉</h2>
        <p className="text-muted">
          We’ve emailed you a copy for your records. We’ll now build and train
          your receptionist, call you for a live test, and switch on the divert
          together. <b className="text-ink">You’ll be live within 48 hours.</b>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 1 — Venue */}
      <Section
        num="1"
        title="Your venue"
        hint="The basics — exactly as they should be said to your customers."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Venue name (as answered on the phone)" name="Venue name" required />
          <Field
            label="Venue name pronunciation (if tricky)"
            name="Pronunciation"
            placeholder="e.g. ‘Chez Pierre’ = shay pee-AIR"
          />
          <Field label="Street address" name="Street address" />
          <Field label="Suburb" name="Suburb" />
          <Field label="Contact person (owner / manager)" name="Contact person" required />
          <Field label="Their mobile" name="Contact mobile" type="tel" required />
          <Field label="Email" name="Contact email" type="email" required />
          <Field label="ABN" name="ABN" />
          <Field
            label="Website / Instagram / Facebook"
            name="Website / socials"
            className="sm:col-span-2"
          />
        </div>
      </Section>

      {/* 2 — Phone line */}
      <Section
        num="2"
        title="Your phone line"
        hint="Keep your existing number — we simply divert calls. Two minutes with your provider, and we walk you through it."
      >
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <Field label="Restaurant phone number" name="Restaurant phone" type="tel" required />
          <Field
            label="Phone provider"
            name="Phone provider"
            placeholder="Telstra, Optus, Vodafone, other"
          />
        </div>
        <p className="field-label">When should ANSA answer?</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
          {[
            "All calls, all the time (recommended)",
            "Only calls we miss (after ~20 seconds)",
            "Only outside opening hours",
            "Only during service rush (specify in notes)",
          ].map((opt) => (
            <label key={opt} className="check-label">
              <input type="checkbox" name="Answering mode" value={opt} />
              {opt}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <Field label="Notes" name="Phone notes" />
        </div>
      </Section>

      {/* 3 — Opening hours */}
      <Section
        num="3"
        title="Opening hours"
        hint="Include kitchen close times if different — she’ll stop taking orders when your kitchen does."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left" scope="col">
                  <span className="sr-only">Day</span>
                </th>
                {["Lunch (open–close)", "Dinner (open–close)", "Kitchen closes", "Closed?"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="bg-navy p-2 text-left text-xs font-semibold tracking-wide text-ink"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <th scope="row" className="p-2 text-left font-bold text-cyan">
                    {day}
                  </th>
                  {["Lunch", "Dinner", "Kitchen closes", "Closed"].map((col) => (
                    <td key={col} className="border border-cyan/15 p-1">
                      <input
                        className="w-full bg-transparent p-1.5 text-sm text-ink focus:outline-none"
                        type="text"
                        name={`${day} — ${col}`}
                        aria-label={`${day} ${col}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Field label="Public holidays / seasonal closures" name="Holidays / closures" />
        </div>
      </Section>

      {/* 4 — Reservations */}
      <Section num="4" title="Reservations">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="booking-system">
              Booking system
            </label>
            <select className="field-input" id="booking-system" name="Booking system">
              <option value="">— Select —</option>
              <option>Now Book It</option>
              <option>SevenRooms</option>
              <option>OpenTable</option>
              <option>ResDiary</option>
              <option>Google Calendar</option>
              <option>Paper diary / none</option>
              <option>Other</option>
            </select>
          </div>
          <Field label="Total seats" name="Total seats" />
          <Field
            label="Max party size she can confirm alone"
            name="Max party size"
            placeholder="e.g. 8"
          />
          <Field
            label="Larger groups — what should she do?"
            name="Larger groups"
            placeholder="e.g. take details, manager calls back"
            className="sm:col-span-3"
          />
          <Field
            label="Areas she can offer (terrace, bar, private room…)"
            name="Areas"
            className="sm:col-span-2"
          />
          <Field label="Do you hold tables? How long?" name="Table holds" placeholder="e.g. 15 minutes" />
          <Field
            label="Anything she should ask on every booking?"
            name="Ask on every booking"
            placeholder="e.g. allergies, pram/highchair, occasion"
            className="sm:col-span-3"
          />
        </div>
      </Section>

      {/* 5 — Menu */}
      <Section
        num="5"
        title="Menu & takeaway"
        hint="Email your current menu (photo, PDF or link) after submitting — she learns it by heart, prices included."
      >
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2.5">
          {["I’ll email the menu", "Menu is on our website (link in section 1)"].map((opt) => (
            <label key={opt} className="check-label">
              <input type="checkbox" name="Menu source" value={opt} />
              {opt}
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="takeaway">
              Do you do takeaway phone orders?
            </label>
            <select className="field-input" id="takeaway" name="Takeaway orders">
              <option value="">— Select —</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <Field label="Average prep time" name="Prep time" placeholder="e.g. 20 min" />
          <Field
            label="Your 5 best sellers (she’ll recommend them)"
            name="Best sellers"
            className="sm:col-span-2"
          />
          <Field label="Dietary options to highlight (GF, vegan, halal…)" name="Dietary options" />
          <Field label="Items that often run out / seasonal items" name="Seasonal items" />
        </div>
      </Section>

      {/* 6 — FAQs */}
      <Section
        num="6"
        title="Questions your customers always ask"
        hint="She answers these dozens of times a week so your team doesn’t have to."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Parking" name="Parking" placeholder="e.g. free on Mews Rd after 6pm" />
          <Field label="BYO? Corkage fee?" name="BYO / corkage" />
          <Field label="Dogs / kids / dress code" name="Dogs / kids / dress code" />
          <Field label="Payment methods accepted" name="Payment methods" />
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="other-info">
              Anything else she should know? (specials nights, live music, functions…)
            </label>
            <textarea
              className="field-input"
              id="other-info"
              name="Other info"
              rows={3}
            />
          </div>
        </div>
      </Section>

      {/* 7 — Human handover */}
      <Section num="7" title="When to hand over to a human">
        <div className="mb-4">
          <Field
            label="Transfer urgent calls to (name + mobile)"
            name="Urgent transfer to"
            required
          />
        </div>
        <p className="field-label">What counts as urgent for you?</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
          {[
            "Complaints",
            "Suppliers / deliveries",
            "Media / partnerships",
            "Functions & large events",
            "Anything she’s unsure about",
          ].map((opt) => (
            <label key={opt} className="check-label">
              <input type="checkbox" name="Urgent categories" value={opt} />
              {opt}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <Field
            label="Kitchen / staff mobile for SMS notifications (bookings & orders)"
            name="SMS notifications mobile"
            type="tel"
          />
        </div>
      </Section>

      {/* 8 — Voice & style */}
      <Section num="8" title="Her voice & style">
        <div className="mb-4">
          <Field
            label="How should she greet callers?"
            name="Greeting"
            placeholder="e.g. G’day, thanks for calling [venue]! This is ANSA — how can I help?"
          />
        </div>
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2.5">
          {[
            "Relaxed & friendly (most venues)",
            "Polished & formal (fine dining)",
            "Match our vibe — see notes",
          ].map((opt) => (
            <label key={opt} className="check-label">
              <input type="checkbox" name="Voice style" value={opt} />
              {opt}
            </label>
          ))}
        </div>
        <Field label="Words or phrases you love (or hate)" name="Words love / hate" />
      </Section>

      {/* 9 — Confirmation */}
      <Section num="9" title="Confirmation">
        <div className="mb-5 flex flex-col gap-2.5">
          <label className="check-label">
            <input type="checkbox" name="Recording notice accepted" value="Yes" required />
            I understand calls will begin with a short recording notice (required in WA). *
          </label>
          <label className="check-label">
            <input type="checkbox" name="Details confirmed current" value="Yes" required />
            I confirm the menu, prices and details provided are current. *
          </label>
          <label className="check-label">
            <input type="checkbox" name="Terms accepted" value="Yes" required />
            <span>
              I’ve read and accept the{" "}
              <a href="/terms" target="_blank" className="text-cyan underline">
                Terms of Service
              </a>
              . *
            </span>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Full name (acts as signature)" name="Signature name" required />
          <div>
            <label className="field-label" htmlFor="plan-chosen">
              Plan chosen *
            </label>
            <select className="field-input" id="plan-chosen" name="Plan chosen" required>
              <option value="">— Select —</option>
              <option>Essential — 12 months</option>
              <option>Essential — month-to-month</option>
              <option>Growth — 12 months</option>
              <option>Growth — month-to-month</option>
            </select>
          </div>
          <Field
            label="Referred by (venue name — if any)"
            name="Referred by"
            placeholder="Referral: their next month’s free"
          />
        </div>
        <div className="mt-5 rounded-lg border-l-4 border-cyan bg-cyan/10 p-4 text-sm text-ink">
          <b>What happens next:</b> we build and train your receptionist within
          48 hours, call you for a live test, then switch on the divert
          together. You get two weeks of included fine-tuning — anything she
          says can be adjusted.
        </div>
      </Section>

      {status === "error" && (
        <p role="alert" className="mb-4 rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-sm">
          {errorMsg}
        </p>
      )}
      {status === "mailto" && (
        <p role="status" className="mb-4 rounded-lg border border-cyan/40 bg-cyan/10 p-4 text-sm">
          Your email app should have opened with your answers pre-filled — just
          press send. If not, email us at {SITE.email}.
        </p>
      )}

      <div className="no-print flex flex-wrap items-center justify-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Submit onboarding form"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => window.print()}
        >
          Download as PDF
        </button>
      </div>
      <p className="no-print mt-4 text-center text-xs text-muted">
        Prefer to fill it in later? Download the PDF and email it to{" "}
        <a className="text-cyan" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        .
      </p>
    </form>
  );
}
