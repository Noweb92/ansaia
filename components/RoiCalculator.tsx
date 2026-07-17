"use client";

import { useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { PLANS } from "@/lib/site";

const WEEKS_PER_MONTH = 4.33;

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[0.95rem] text-muted">
          {label}
        </label>
        <span className="text-lg font-bold text-cyan">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan"
      />
    </div>
  );
}

export default function RoiCalculator() {
  const [missed, setMissed] = useState(20);
  const [bookingShare, setBookingShare] = useState(60);
  const [avgSpend, setAvgSpend] = useState(120);
  const tracked = useRef(false);

  const monthlyLoss =
    Math.round(
      (missed * (bookingShare / 100) * avgSpend * WEEKS_PER_MONTH) / 10,
    ) * 10;
  const essential = PLANS[0].prices.twelve.monthly;
  const multiple = monthlyLoss > 0 ? Math.round(monthlyLoss / essential) : 0;

  const onInteract = (fn: (v: number) => void) => (v: number) => {
    if (!tracked.current) {
      tracked.current = true;
      track("calculator_used");
    }
    fn(v);
  };

  return (
    <section id="calculator" className="px-6 py-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="kicker">The maths</div>
        <h2 className="mb-12 mt-2.5 text-center text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
          What are missed calls costing you?
        </h2>
        <div className="card mx-auto grid max-w-[900px] gap-10 !p-8 md:grid-cols-[1.2fr_1fr] md:!p-10">
          <div className="flex flex-col gap-7">
            <Slider
              label="Calls you miss per week"
              value={missed}
              min={0}
              max={80}
              step={1}
              format={(v) => `${v}`}
              onChange={onInteract(setMissed)}
            />
            <Slider
              label="Share that were trying to book"
              value={bookingShare}
              min={0}
              max={100}
              step={5}
              format={(v) => `${v}%`}
              onChange={onInteract(setBookingShare)}
            />
            <Slider
              label="Average spend per booking"
              value={avgSpend}
              min={20}
              max={300}
              step={10}
              format={(v) => `$${v}`}
              onChange={onInteract(setAvgSpend)}
            />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-cyan/25 bg-navy3/60 p-6 text-center">
            <div className="text-sm uppercase tracking-[0.15em] text-muted">
              You’re losing about
            </div>
            <div
              className="my-2 text-[2.8rem] font-extrabold leading-none text-cyan"
              aria-live="polite"
            >
              ${monthlyLoss.toLocaleString("en-AU")}
              <span className="text-lg font-normal text-muted">/month</span>
            </div>
            <div className="text-[0.95rem] text-muted">
              ANSA starts at{" "}
              <b className="text-ink">${essential}/month</b>
              {multiple >= 2 && (
                <>
                  {" "}
                  — that’s{" "}
                  <b className="text-ink">{multiple}× less</b> than what’s
                  walking out the door.
                </>
              )}
            </div>
            <a href="#pricing" className="btn btn-primary mt-5">
              Stop the leak
            </a>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-muted">
          Estimate only — based on your own numbers, not a guarantee. Not sure
          how many you miss? Check your phone’s missed-call log after one
          Friday service.
        </p>
      </div>
    </section>
  );
}
