"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import Logo from "./Logo";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#referral", label: "Referral" },
  { href: "/#faq", label: "FAQ" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-cyan/15 bg-navy3/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-3 text-ink"
          aria-label="ANSA — home"
        >
          <Logo />
          <b className="text-[1.35rem] tracking-[0.28em]">ANSA</b>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.95rem] text-muted transition-colors hover:text-cyan"
            >
              {l.label}
            </Link>
          ))}
          <a
            className="btn btn-primary !text-navy3"
            href={`tel:${SITE.phoneIntl}`}
            onClick={() => track("call_click", { location: "nav" })}
          >
            Book a demo
          </a>
        </div>

        {/* Mobile: keep CTA visible + burger */}
        <div className="flex items-center gap-3 md:hidden">
          <a
            className="btn btn-primary !px-4 !py-2 text-sm !text-navy3"
            href={`tel:${SITE.phoneIntl}`}
            onClick={() => track("call_click", { location: "nav_mobile" })}
          >
            Call us
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg border border-cyan/30"
          >
            <span
              className={`block h-[2px] w-5 bg-cyan transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[2px] w-5 bg-cyan transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-[2px] w-5 bg-cyan transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-cyan/15 bg-navy3/95 px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-muted transition-colors hover:bg-cyan/10 hover:text-cyan"
              >
                {l.label}
              </Link>
            ))}
            <a
              className="btn btn-primary mt-2 text-center !text-navy3"
              href={`tel:${SITE.phoneIntl}`}
              onClick={() => setOpen(false)}
            >
              Book a demo — {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
