import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ANSA collects, uses and protects personal information — compliant with the Australian Privacy Principles.",
  alternates: { canonical: "/privacy" },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 mt-8 text-lg font-bold text-cyan">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <main className="px-6 pb-20 pt-14">
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
        <p className="mb-8 mt-1.5 text-sm text-muted">
          {SITE.fullName} · Perth, Western Australia · Last updated 17 July 2026
        </p>

        <p className="text-muted">
          This policy explains how we handle personal information when you use
          the ANSA service or this website. We comply with the Privacy Act 1988
          (Cth) and the Australian Privacy Principles (APPs).
        </p>

        <H2>What we collect</H2>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>
            <b className="text-ink">From our clients:</b> business and contact
            details you provide during onboarding (venue information, menus,
            opening hours, staff contact numbers).
          </li>
          <li>
            <b className="text-ink">From callers:</b> names, phone numbers and
            booking details captured during calls, plus call recordings and
            transcripts. Every call begins with a recording disclosure, as
            required in Western Australia.
          </li>
          <li>
            <b className="text-ink">From this website:</b> anonymous usage
            analytics. We do not use tracking that identifies you personally.
          </li>
        </ul>

        <H2>How we use it</H2>
        <p className="text-muted">
          Personal information is used solely to deliver the Service — answering
          calls, taking bookings, sending confirmations and recaps, and
          improving each venue’s configuration. We never sell personal
          information, never share it with third parties for marketing, and
          never use caller data for advertising.
        </p>

        <H2>Storage &amp; security</H2>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Data is encrypted in transit and at rest.</li>
          <li>Data is stored in Australia.</li>
          <li>
            Call recordings and transcripts are retained for 90 days, then
            automatically deleted.
          </li>
          <li>
            Access is limited to what is necessary to operate the Service.
          </li>
        </ul>

        <H2>Your rights</H2>
        <p className="text-muted">
          You can request access to, correction of, or deletion of your
          personal information at any time — clients and callers alike. Email{" "}
          <a href={`mailto:${SITE.email}`} className="text-cyan hover:underline">
            {SITE.email}
          </a>{" "}
          and we’ll action it promptly. If you have a privacy concern, contact
          us first; you may also lodge a complaint with the Office of the
          Australian Information Commissioner (oaic.gov.au).
        </p>

        <H2>Third-party services</H2>
        <p className="text-muted">
          We use trusted infrastructure providers to operate the Service
          (telephony, AI speech processing, payments via Stripe, email
          delivery). Each processes data only as needed to provide their
          function to us, under their own privacy safeguards.
        </p>

        <H2>Contact</H2>
        <p className="text-muted">
          {SITE.fullName} · {SITE.founder} · {SITE.phoneDisplay} · {SITE.email}{" "}
          · Perth, WA.
        </p>
      </div>
    </main>
  );
}
