import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="px-6 py-11 text-[0.9rem] text-muted">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-start justify-between gap-5">
        <div>
          <div>
            © {new Date().getFullYear()} {SITE.fullName} · {SITE.location}
          </div>
          <div className="mt-1 text-[0.8rem]">
            {SITE.founder} — Founder · ABN: {SITE.abn}
          </div>
          <div className="mt-1 text-[0.8rem] italic text-cyan/80">
            {SITE.tagline}
          </div>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <div>
            <a className="text-cyan hover:underline" href={`tel:${SITE.phoneIntl}`}>
              {SITE.phoneDisplay}
            </a>{" "}
            ·{" "}
            <a className="text-cyan hover:underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </div>
          <div className="text-[0.85rem]">
            <Link className="hover:text-cyan" href="/terms">
              Terms of Service
            </Link>{" "}
            ·{" "}
            <Link className="hover:text-cyan" href="/privacy">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
