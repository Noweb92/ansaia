import type { Metadata } from "next";
import { SITE, SETUP_FEE, REFERRAL_SETUP_FEE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for ANSA, the AI phone receptionist for Perth restaurants and venues.",
  alternates: { canonical: "/terms" },
};

const FEES = [
  ["Setup & onboarding (one-time, all plans)", `$${SETUP_FEE}`],
  ["Essential — 12-month plan (up to 300 calls/mo)", "$299/month"],
  ["Essential — month-to-month (up to 300 calls/mo)", "$349/month"],
  ["Growth — 12-month plan (up to 600 calls/mo)", "$449/month"],
  ["Growth — month-to-month (up to 600 calls/mo)", "$499/month"],
  ["Extra usage beyond included calls", "$0.50/minute, invoiced in arrears"],
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 mt-8 text-lg font-bold text-cyan">{children}</h2>;
}

export default function TermsPage() {
  return (
    <main className="px-6 pb-20 pt-14">
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-3xl font-extrabold">Terms of Service</h1>
        <p className="mb-8 mt-1.5 text-sm text-muted">
          {SITE.fullName} · {SITE.founder} · ABN: {SITE.abn} · Perth, Western
          Australia · Last updated 17 July 2026
        </p>

        <p className="text-muted">
          These terms govern the ANSA AI phone receptionist service (“the
          Service”). By completing payment through our checkout, you (“the
          Client”) accept these terms on behalf of your venue.
        </p>

        <H2>1. The Service</H2>
        <p className="text-muted">
          ANSA answers your venue’s inbound calls 24/7, takes table bookings,
          sends SMS confirmations, answers venue-related questions, takes
          messages, and escalates calls to your nominated contact, as
          configured during onboarding.
        </p>

        <H2>2. Plans &amp; fees (AUD, incl. GST)</H2>
        <div className="overflow-x-auto">
          <table className="my-3 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-cyan/20 px-3 py-2 text-left text-xs uppercase tracking-wider text-muted">
                  Item
                </th>
                <th className="border border-cyan/20 px-3 py-2 text-left text-xs uppercase tracking-wider text-muted">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {FEES.map(([item, fee]) => (
                <tr key={item}>
                  <td className="border border-cyan/20 px-3 py-2 text-muted">{item}</td>
                  <td className="border border-cyan/20 px-3 py-2 text-ink">{fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted">
          Your first payment covers the setup fee plus the first month.
          Subscriptions renew monthly in advance via Stripe. The 12-month rate
          reflects a $50/month saving for a 12-month commitment. Prices may be
          revised with 30 days’ written notice, effective from your next
          renewal.
        </p>

        <H2>3. Term &amp; cancellation</H2>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>
            <b className="text-ink">Month-to-month plans:</b> cancel anytime;
            the Service runs to the end of the paid month. No further charges.
          </li>
          <li>
            <b className="text-ink">12-month plans:</b> the reduced monthly
            rate reflects a 12-month commitment. Early exit incurs an
            early-exit fee equal to two months of the plan rate, in addition to
            the current month. After 12 months, the plan renews monthly and may
            be cancelled anytime.
          </li>
          <li>
            We may suspend the Service for non-payment after 14 days’ written
            notice.
          </li>
          <li>
            On cancellation, call forwarding is simply deactivated on your line
            — your phone number always remains yours and works as before.
          </li>
        </ul>

        <H2>4. Referral program</H2>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>
            When a venue you refer goes live, you receive one month of your
            subscription free, and the referred venue receives 50% off their
            setup fee (${REFERRAL_SETUP_FEE} instead of ${SETUP_FEE}).
          </li>
          <li>
            The free month is triggered only once the referred venue has paid
            their setup fee and first month.
          </li>
          <li>
            The credit is applied to your next invoice; it is not convertible
            to cash, and multiple credits roll over to subsequent invoices
            (one per month).
          </li>
          <li>You must be an active client at the time the credit is applied.</li>
          <li>
            A venue can only be referred once — the first referrer named at
            sign-up counts. Self-referral (same ABN or same establishment) is
            not eligible.
          </li>
          <li>There is no limit to the number of venues you may refer.</li>
        </ul>

        <H2>5. Your responsibilities</H2>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>
            Provide accurate venue information (hours, menu, policies) and
            update us when it changes — ANSA only knows what she is told.
          </li>
          <li>Activate call forwarding on your line (we assist with this at setup).</li>
          <li>Nominate a contact for escalated calls during service hours.</li>
          <li>
            Honour, amend or cancel the bookings ANSA takes — the bookings
            ledger remains your responsibility.
          </li>
        </ul>

        <H2>6. Service levels &amp; limitations</H2>
        <p className="text-muted">
          The Service targets 24/7 availability but depends on third-party
          infrastructure (telephony and AI processing). We are not liable for
          third-party outages, but will restore service promptly and credit any
          full day of outage. ANSA is an AI: occasional mishearings can occur;
          she is designed to take a callback rather than guess. The Service
          never asks callers for card numbers by voice.
        </p>

        <H2>7. Call recording &amp; privacy</H2>
        <p className="text-muted">
          All calls are recorded with a disclosure at the start of each call,
          consistent with the Surveillance Devices Act 1998 (WA). Recordings
          and transcripts are available to you and retained for 90 days, then
          deleted. Caller personal information (names, phone numbers, booking
          details) is processed only to deliver the Service, handled in
          accordance with the Privacy Act 1988 (Cth), and never sold or used
          for advertising. You should reference call recording in your own
          privacy notice if you maintain one. See our{" "}
          <a href="/privacy" className="text-cyan hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        <H2>8. Liability</H2>
        <p className="text-muted">
          To the extent permitted by law — including the Australian Consumer
          Law, whose consumer guarantees are not excluded — our total liability
          is capped at the fees you paid in the previous 3 months, and neither
          party is liable for indirect or consequential loss (including lost
          revenue from a missed booking).
        </p>

        <H2>9. Intellectual property</H2>
        <p className="text-muted">
          The ANSA service, prompts and configurations remain our property.
          Your menu, brand and business information remain yours.
        </p>

        <H2>10. General</H2>
        <p className="text-muted">
          Governing law: Western Australia. Disputes: good-faith negotiation
          first, then mediation before any court action. Questions: email{" "}
          <a href={`mailto:${SITE.email}`} className="text-cyan hover:underline">
            {SITE.email}
          </a>{" "}
          or call {SITE.phoneDisplay}.
        </p>

        <p className="mt-10 border-t border-cyan/15 pt-4 text-xs text-muted">
          {SITE.name} · AI receptionist for restaurants &amp; venues ·{" "}
          {SITE.founder}, ABN: {SITE.abn}, Perth WA
        </p>
      </div>
    </main>
  );
}
