import Reveal from "@/components/Reveal";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import RoiCalculator from "@/components/RoiCalculator";
import TrackedLink from "@/components/TrackedLink";
import {
  PhoneIcon,
  CalendarIcon,
  MailIcon,
  HelpCircleIcon,
  PhoneForwardedIcon,
  GlobeIcon,
} from "@/components/Icons";
import {
  SITE,
  FAQS,
  PROOF_POINTS,
  TESTIMONIALS,
  REFERRAL_SETUP_FEE,
  SETUP_FEE,
} from "@/lib/site";

const FEATURES = [
  {
    icon: <PhoneIcon />,
    title: "24/7 call answering",
    text: "Every call answered in seconds, in your venue’s name, with a natural Australian voice. Mid-service, after close, public holidays — no voicemail, no lost bookings.",
  },
  {
    icon: <CalendarIcon />,
    title: "Bookings taken for you",
    text: "ANSA takes reservations straight into your calendar — Now Book It, SevenRooms, OpenTable, ResDiary or Google Calendar.",
  },
  {
    icon: <MailIcon />,
    title: "Instant recaps",
    text: "Message taken, caller details captured, and a recap sent to you by SMS or email the moment the call ends.",
  },
  {
    icon: <HelpCircleIcon />,
    title: "FAQs handled",
    text: "Opening hours, parking, BYO, dietaries, dress code — ANSA answers the questions your team repeats ten times a shift.",
  },
  {
    icon: <PhoneForwardedIcon />,
    title: "Smart transfers",
    text: "Urgent caller? ANSA recognises it and transfers live to you or the manager on duty, with context.",
  },
  {
    icon: <GlobeIcon />,
    title: "Multilingual",
    text: "English by default, with additional languages available for your customer base.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Tell us about your venue",
    text: "Menu, hours, booking system, tone. We train ANSA on your business in one short call plus a 15-minute form.",
  },
  {
    num: "2",
    title: "Divert your number",
    text: "Keep your existing number. Divert missed calls — or all calls — to ANSA in two minutes.",
  },
  {
    num: "3",
    title: "Get back to service",
    text: "ANSA answers, books and reports. You focus on the room, not the phone.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* HERO */}
      <header className="relative overflow-hidden px-6 pb-16 pt-28 text-center">
        <div className="pulse" aria-hidden="true" />
        <div className="mx-auto max-w-[1100px]">
          <span className="mb-7 inline-block rounded-full border border-cyan/40 px-4 py-1.5 text-[0.85rem] tracking-[0.08em] text-cyan">
            PERTH, WA · AI RECEPTIONIST · 24/7
          </span>
          <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-extrabold leading-[1.1]">
            Never miss
            <br />
            another <span className="text-cyan">call.</span>
          </h1>
          <p className="mx-auto mb-10 mt-6 max-w-[640px] text-[1.15rem] text-muted">
            ANSA is the AI receptionist for Perth restaurants and venues. She
            answers every call in your venue’s name — mid-service, late night
            and weekends — takes bookings straight into your calendar, and
            sends you the recap instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <TrackedLink
              event="call_click"
              data={{ location: "hero" }}
              className="btn btn-primary"
              href={`tel:${SITE.phoneIntl}`}
            >
              Call {SITE.phoneDisplay}
            </TrackedLink>
            <TrackedLink
              event="calendly_click"
              data={{ location: "hero" }}
              className="btn btn-ghost"
              href={SITE.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a demo online
            </TrackedLink>
          </div>
          <p className="mt-8 text-sm text-muted">
            <span className="text-cyan">“ANSA”</span> — say it out loud. The
            name is the product: someone calls, ANSA answers.
          </p>

          {/* Proof bar */}
          <div className="mx-auto mt-12 grid max-w-[860px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-cyan/15 bg-cyan/15 sm:grid-cols-4">
            {PROOF_POINTS.map((p) => (
              <div key={p.label} className="bg-navy3/80 px-4 py-5">
                <div className="text-2xl font-extrabold text-cyan">{p.stat}</div>
                <div className="mt-1 text-xs text-muted">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="kicker">Automated Natural Speech Assistant</div>
          <h2 className="mb-12 mt-2.5 text-center text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
            Everything a great front-of-house does. Without the sick days.
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Reveal key={f.title}>
                <div className="card h-full">
                  <div className="mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-[1.12rem] font-bold">{f.title}</h3>
                  <p className="text-[0.95rem] text-muted">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Built for hospitality — also great for clinics, salons and trades.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS — renders once TESTIMONIALS in lib/site.ts is filled */}
      {TESTIMONIALS.length > 0 && (
        <section id="testimonials" className="px-6 py-20">
          <div className="mx-auto max-w-[1100px]">
            <div className="kicker">What venues say</div>
            <h2 className="mb-12 mt-2.5 text-center text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
              Don’t take our word for it
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <Reveal key={t.name}>
                  <figure className="card h-full">
                    <blockquote className="text-[1.02rem] leading-relaxed text-ink">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-4 text-sm text-muted">
                      <b className="text-cyan">{t.name}</b> — {t.venue}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="kicker">Simple setup</div>
          <h2 className="mb-12 mt-2.5 text-center text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
            Live in 48 hours
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <Reveal key={s.num}>
                <div className="text-center">
                  <div className="mx-auto mb-4.5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan text-[1.4rem] font-extrabold text-cyan">
                    {s.num}
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
                  <p className="text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <RoiCalculator />

      {/* PRICING */}
      <PricingSection />

      {/* REFERRAL */}
      <section
        id="referral"
        className="border-y border-cyan/15 bg-cyan/5 px-6 py-20"
      >
        <div className="mx-auto max-w-[760px] text-center">
          <div className="kicker">Referral program</div>
          <h2 className="mb-6 mt-2.5 text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
            Know a venue that misses calls?
          </h2>
          <p className="mx-auto mb-4 max-w-[640px] text-lg text-ink">
            Refer them. When they go live,{" "}
            <b className="text-cyan">your next month is free</b> — and they get{" "}
            <b className="text-cyan">50% off their setup</b> (${REFERRAL_SETUP_FEE}{" "}
            instead of ${SETUP_FEE}). No limit: refer twelve venues, get a year
            on us.
          </p>
          <p className="mb-8 text-muted">
            How it works: they just mention your restaurant’s name when they
            sign up. That’s it.
          </p>
          <TrackedLink
            event="call_click"
            data={{ location: "referral" }}
            className="btn btn-ghost"
            href={`tel:${SITE.phoneIntl}`}
          >
            Refer a venue — call us
          </TrackedLink>
          <p className="mx-auto mt-8 max-w-[640px] text-xs leading-relaxed text-muted/80">
            The free month is credited to your next invoice once the referred
            venue has paid their setup and first month. Credit is not
            convertible to cash. You must be an active client when the credit
            is applied. A venue can only be referred once, and self-referrals
            (same ABN) aren’t eligible. Full details in our{" "}
            <a href="/terms" className="text-cyan hover:underline">
              Terms
            </a>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* FINAL CTA */}
      <section
        id="contact"
        className="border-y border-cyan/15 bg-cyan/5 px-6 py-20 text-center"
      >
        <div className="mx-auto max-w-[1100px]">
          <h2 className="mb-3.5 text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
            Your phone is ringing right now.
            <br />
            Who’s answering?
          </h2>
          <p className="mb-9 text-muted">
            Book a free demo — hear ANSA answer a call for your venue.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <TrackedLink
              event="call_click"
              data={{ location: "final_cta" }}
              className="btn btn-primary"
              href={`tel:${SITE.phoneIntl}`}
            >
              Call {SITE.phoneDisplay}
            </TrackedLink>
            <TrackedLink
              event="calendly_click"
              data={{ location: "final_cta" }}
              className="btn btn-ghost"
              href={SITE.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a 15-min demo
            </TrackedLink>
            <TrackedLink
              event="email_click"
              data={{ location: "final_cta" }}
              className="btn btn-ghost"
              href={`mailto:${SITE.email}`}
            >
              Email us
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
