import type { Metadata } from "next";
import OnboardingForm from "@/components/OnboardingForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Welcome aboard — Onboarding",
  description:
    "Payment received — complete your onboarding form and your AI receptionist will be live within 48 hours.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/welcome" },
};

export default function WelcomePage() {
  return (
    <main className="px-6 pb-24 pt-16">
      <div className="mx-auto max-w-[860px]">
        <header className="mb-12 text-center">
          <span className="mb-6 inline-block rounded-full border border-cyan/40 px-4 py-1.5 text-[0.85rem] tracking-[0.08em] text-cyan">
            PAYMENT RECEIVED · WELCOME ABOARD
          </span>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight">
            Thank you — <span className="text-cyan">you’ll be live within 48 hours.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-lg text-muted">
            One last step: this form gives your AI receptionist everything she
            needs to answer <b className="text-ink">exactly like a member of your team</b>.
            It takes about 15 minutes. The more detail you give, the better she
            sounds on day one — and we fine-tune everything with you during
            your first two weeks.
          </p>
          <p className="mt-4 text-sm text-muted">
            The 48-hour countdown starts when we receive this form. Questions?
            Call{" "}
            <a className="text-cyan" href={`tel:${SITE.phoneIntl}`}>
              {SITE.phoneDisplay}
            </a>
            .
          </p>
        </header>

        <OnboardingForm />
      </div>
    </main>
  );
}
