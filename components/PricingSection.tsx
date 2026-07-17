"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import Reveal from "./Reveal";
import { PLANS, SETUP_FEE, EXCESS_RATE, type BillingMode } from "@/lib/site";

const fmt = (n: number) => `$${n.toLocaleString("en-AU")}`;

export default function PricingSection() {
  const [mode, setMode] = useState<BillingMode>("twelve");

  return (
    <section id="pricing" className="px-6 py-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="kicker">Launch pricing</div>
        <h2 className="mb-6 mt-2.5 text-center text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
          Less than one missed table a week. Per month.
        </h2>

        {/* Billing toggle */}
        <div
          className="mx-auto mb-12 flex w-fit rounded-full border border-cyan/30 p-1"
          role="radiogroup"
          aria-label="Billing period"
        >
          {(
            [
              ["twelve", "12-month plan"],
              ["flex", "Month-to-month"],
            ] as [BillingMode, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              role="radio"
              aria-checked={mode === value}
              onClick={() => setMode(value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                mode === value
                  ? "bg-cyan text-navy3"
                  : "text-muted hover:text-cyan"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mx-auto grid max-w-[820px] gap-6 md:grid-cols-2">
          {PLANS.map((plan) => {
            const price = plan.prices[mode];
            return (
              <Reveal key={plan.key}>
                <div
                  className={`card relative flex h-full flex-col text-center ${
                    plan.featured ? "!border-cyan bg-cyan/5" : ""
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-cyan px-3.5 py-1 text-xs font-bold text-navy3">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted">{plan.blurb}</p>
                  <div className="my-3.5 text-[2.6rem] font-extrabold">
                    {fmt(price.monthly)}
                    <small className="text-base font-normal text-muted">/mo</small>
                  </div>
                  <div className="text-sm font-semibold text-cyan">
                    + one-time {fmt(SETUP_FEE)} setup
                  </div>
                  <ul className="my-6 flex-1 space-y-0 text-[0.95rem] text-muted">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="border-b border-dashed border-white/10 py-2 last:border-0"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mb-4 rounded-lg bg-navy3/60 px-4 py-3 text-[0.85rem] text-ink">
                    First payment <b className="text-cyan">{fmt(price.firstPayment)}</b>{" "}
                    — includes {fmt(SETUP_FEE)} setup + first month.
                    <br />
                    Then {fmt(price.monthly)}/mo
                    {mode === "twelve" ? " for 12 months" : ", cancel anytime"}.
                  </div>
                  <a
                    className={`btn ${plan.featured ? "btn-primary" : "btn-ghost"}`}
                    href={price.stripeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("stripe_checkout", { plan: plan.key, mode })
                    }
                  >
                    Get started — pay {fmt(price.firstPayment)}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-6 max-w-[720px] text-center text-[0.85rem] text-muted">
          Setup ({fmt(SETUP_FEE)}, one-time, all plans) includes your number,
          configuration, training on your venue, testing and go-live within 48
          hours. 12-month plans save $50/month. Excess calls {EXCESS_RATE} beyond
          your quota. Prices in AUD, GST included. Secure checkout by Stripe —
          after payment you’ll be taken straight to your onboarding form.
        </p>
      </div>
    </section>
  );
}
