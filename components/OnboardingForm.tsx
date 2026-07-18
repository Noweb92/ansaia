"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
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

const STORAGE_KEY = "ansa-onboarding-v1";
const MAX_MENU_MB = 6;

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

export default function OnboardingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(0);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [restored, setRestored] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  /* ---------- localStorage draft ---------- */

  function saveDraft() {
    const form = formRef.current;
    if (!form) return;
    const data: Record<string, string[]> = {};
    for (const [k, v] of new FormData(form).entries()) {
      if (typeof v !== "string" || k === "company_website") continue;
      (data[k] ??= []).push(v);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    } catch {
      /* storage full/blocked — drafts are best-effort */
    }
  }

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { step: savedStep, data } = JSON.parse(raw) as {
          step: number;
          data: Record<string, string[]>;
        };
        for (const [name, values] of Object.entries(data)) {
          const els = form.querySelectorAll<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >(`[name="${CSS.escape(name)}"]`);
          els.forEach((el) => {
            if (el instanceof HTMLInputElement && el.type === "checkbox") {
              el.checked = values.includes(el.value);
            } else if (el.type !== "file") {
              el.value = values[0] ?? "";
            }
          });
        }
        if (Object.keys(data).length > 0) setRestored(true);
        if (savedStep >= 0 && savedStep < STEP_TITLES.length) {
          setStep(savedStep);
        }
      }
    } catch {
      /* corrupt draft — start fresh */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formRef.current) saveDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* ---------- step navigation ---------- */

  function fieldsOfStep(i: number) {
    return Array.from(
      formRef.current?.querySelectorAll<HTMLInputElement>(
        `[data-step="${i}"] input, [data-step="${i}"] select, [data-step="${i}"] textarea`,
      ) ?? [],
    );
  }

  function validateStep(i: number): boolean {
    for (const el of fieldsOfStep(i)) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
  }

  function goTo(next: number) {
    // moving forward requires the current step to be valid; backward is free
    if (next > step && !validateStep(step)) return;
    setStep(Math.max(0, Math.min(next, STEP_TITLES.length - 1)));
    document
      .getElementById("onboarding-top")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- submit ---------- */

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(String(reader.result).replace(/^data:[^;]+;base64,/, ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // full validation — jump to the first step containing an invalid field
    for (let i = 0; i < STEP_TITLES.length; i++) {
      for (const el of fieldsOfStep(i)) {
        if (!el.checkValidity()) {
          setStep(i);
          setTimeout(() => el.reportValidity(), 50);
          return;
        }
      }
    }

    const fd = new FormData(form);
    const entries: Record<string, unknown> = {};
    for (const [key, value] of fd.entries()) {
      if (typeof value !== "string") continue;
      const v = value.trim();
      if (!v) continue;
      entries[key] = entries[key] ? `${entries[key]}, ${v}` : v;
    }

    if (menuFile) {
      if (menuFile.size > MAX_MENU_MB * 1024 * 1024) {
        setStatus("error");
        setErrorMsg(
          `The menu file is over ${MAX_MENU_MB} MB — please email it to ${SITE.email} instead, then submit the form without it.`,
        );
        return;
      }
      try {
        entries["_menuFile"] = {
          filename: menuFile.name,
          content: await fileToBase64(menuFile),
        };
      } catch {
        /* unreadable file — submit without it */
      }
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
        track("onboarding_submitted");
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        form.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // Email service not configured (or failed) → mailto fallback
      const body = Object.entries(entries)
        .filter(([k]) => k !== "_menuFile")
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

  /* ---------- step bodies ---------- */

  const stepBodies: React.ReactNode[] = [
    /* 1 — Venue */
    <div key="s1" className="grid gap-4 sm:grid-cols-2">
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
    </div>,

    /* 2 — Phone line */
    <div key="s2">
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
    </div>,

    /* 3 — Opening hours */
    <div key="s3">
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
    </div>,

    /* 4 — Reservations */
    <div key="s4" className="grid gap-4 sm:grid-cols-3">
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
    </div>,

    /* 5 — Menu */
    <div key="s5">
      <div className="mb-4">
        <label className="field-label" htmlFor="menu-file">
          Upload your current menu (photo or PDF, max {MAX_MENU_MB} MB)
        </label>
        <input
          id="menu-file"
          type="file"
          accept=".pdf,image/*"
          className="field-input file:mr-3 file:rounded-md file:border-0 file:bg-cyan file:px-3 file:py-1.5 file:font-semibold file:text-navy3"
          onChange={(e) => setMenuFile(e.target.files?.[0] ?? null)}
        />
        <p className="mt-1.5 text-xs text-muted">
          She learns it by heart, prices included. You can also email it later
          to {SITE.email}.
        </p>
      </div>
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2.5">
        {["Menu uploaded above / I’ll email it", "Menu is on our website (link in step 1)"].map(
          (opt) => (
            <label key={opt} className="check-label">
              <input type="checkbox" name="Menu source" value={opt} />
              {opt}
            </label>
          ),
        )}
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
    </div>,

    /* 6 — FAQs */
    <div key="s6" className="grid gap-4 sm:grid-cols-2">
      <Field label="Parking" name="Parking" placeholder="e.g. free on Mews Rd after 6pm" />
      <Field label="BYO? Corkage fee?" name="BYO / corkage" />
      <Field label="Dogs / kids / dress code" name="Dogs / kids / dress code" />
      <Field label="Payment methods accepted" name="Payment methods" />
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="other-info">
          Anything else she should know? (specials nights, live music, functions…)
        </label>
        <textarea className="field-input" id="other-info" name="Other info" rows={3} />
      </div>
    </div>,

    /* 7 — Human handover */
    <div key="s7">
      <div className="mb-4">
        <Field label="Transfer urgent calls to (name + mobile)" name="Urgent transfer to" required />
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
    </div>,

    /* 8 — Voice & style */
    <div key="s8">
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
    </div>,

    /* 9 — Confirmation */
    <div key="s9">
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
        48 hours, call you for a live test, then switch on the divert together.
        You get two weeks of included fine-tuning — anything she says can be
        adjusted.
      </div>
    </div>,
  ];

  const last = STEP_TITLES.length - 1;

  return (
    <form ref={formRef} onSubmit={handleSubmit} onInput={saveDraft} noValidate>
      <div id="onboarding-top" className="scroll-mt-24" />

      {restored && status === "idle" && (
        <p role="status" className="no-print mb-4 rounded-lg border border-cyan/40 bg-cyan/10 p-3 text-center text-sm">
          Welcome back — we saved your answers where you left off.
        </p>
      )}

      {/* Honeypot — real users never see or fill this */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Progress */}
      <div className="no-print mb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-cyan">
            Step {step + 1} of {STEP_TITLES.length} — {STEP_TITLES[step]}
          </span>
          <span className="text-xs text-muted">
            {Math.round(((step + 1) / STEP_TITLES.length) * 100)}%
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEP_TITLES.length}
          aria-label="Form progress"
        >
          <div
            className="h-full rounded-full bg-cyan transition-all duration-300"
            style={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STEP_TITLES.map((title, i) => (
            <button
              key={title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to step ${i + 1}: ${title}`}
              aria-current={i === step ? "step" : undefined}
              className={`h-8 w-8 rounded-full text-xs font-bold transition-colors ${
                i === step
                  ? "bg-cyan text-navy3"
                  : i < step
                    ? "border border-cyan/60 text-cyan"
                    : "border border-white/15 text-muted hover:border-cyan/40"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Steps — all rendered (for print); only the active one shown on screen */}
      {stepBodies.map((body, i) => (
        <fieldset
          key={STEP_TITLES[i]}
          data-step={i}
          className={`card mb-6 !p-6 sm:!p-8 ${i === step ? "" : "step-hidden"}`}
        >
          <legend className="sr-only">{STEP_TITLES[i]}</legend>
          <h2 className="mb-1 flex items-center gap-3 text-base font-bold uppercase tracking-[0.1em]">
            <span
              className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-cyan text-sm font-bold text-navy3"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            {STEP_TITLES[i]}
          </h2>
          {STEP_HINTS[i] && (
            <p className="mb-5 text-[0.85rem] text-muted">{STEP_HINTS[i]}</p>
          )}
          {body}
        </fieldset>
      ))}

      {status === "error" && (
        <p role="alert" className="mb-4 rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-sm">
          {errorMsg}
        </p>
      )}
      {status === "mailto" && (
        <p role="status" className="mb-4 rounded-lg border border-cyan/40 bg-cyan/10 p-4 text-sm">
          Your email app should have opened with your answers pre-filled — just
          press send (and attach your menu). If not, email us at {SITE.email}.
        </p>
      )}

      {/* Navigation / submit */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          className={`btn btn-ghost ${step === 0 ? "invisible" : ""}`}
          onClick={() => goTo(step - 1)}
        >
          ← Back
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
            Download as PDF
          </button>
          {step < last ? (
            <button type="button" className="btn btn-primary" onClick={() => goTo(step + 1)}>
              Next →
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Submit onboarding form"}
            </button>
          )}
        </div>
      </div>
      <p className="no-print mt-4 text-center text-xs text-muted">
        Your answers save automatically in this browser — you can leave and
        come back anytime. Prefer paper? Download the PDF and email it to{" "}
        <a className="text-cyan" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        .
      </p>
    </form>
  );
}

const STEP_TITLES = [
  "Your venue",
  "Your phone line",
  "Opening hours",
  "Reservations",
  "Menu & takeaway",
  "Customer FAQs",
  "Human handover",
  "Her voice & style",
  "Confirmation",
];

const STEP_HINTS: (string | null)[] = [
  "The basics — exactly as they should be said to your customers.",
  "Keep your existing number — we simply divert calls. Two minutes with your provider, and we walk you through it.",
  "Include kitchen close times if different — she’ll stop taking orders when your kitchen does.",
  null,
  "Upload your menu below — she learns it by heart, prices included.",
  "She answers these dozens of times a week so your team doesn’t have to.",
  null,
  null,
  null,
];
