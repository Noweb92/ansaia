"use client";

import { useState } from "react";
import { FAQS } from "@/lib/site";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-[760px]">
        <div className="kicker">Questions</div>
        <h2 className="mb-12 mt-2.5 text-center text-[clamp(1.7rem,4vw,2.4rem)] font-bold">
          Frequently asked
        </h2>
        {FAQS.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div
              key={faq.q}
              className="mb-3 overflow-hidden rounded-xl border border-cyan/15"
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left text-[1.02rem] font-semibold"
              >
                {faq.q}
                <span
                  aria-hidden="true"
                  className={`ml-4 text-2xl text-cyan transition-transform ${open ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              <div
                id={`faq-panel-${i}`}
                className={`grid transition-[grid-template-rows] duration-300 ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-muted">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
