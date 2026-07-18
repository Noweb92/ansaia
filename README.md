# ANSA — Website (ansaia.com.au)

Production website for **ANSA — Automated Natural Speech Assistant**, the AI
receptionist for Perth restaurants & venues.

Next.js (App Router) + Tailwind CSS 4 · deployable on Vercel in one click.

## Pages

| Route      | Purpose                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `/`        | Landing: hero, features, how it works, pricing (12-mo/monthly toggle + Stripe checkout), referral program, FAQ, final CTA |
| `/welcome` | Post-payment confirmation + online onboarding form (emails answers to contact@ansaia.com.au, PDF download option). Not indexed. |
| `/terms`   | Terms of Service (plans, cancellation, referral clause, WA call-recording) |
| `/privacy` | Privacy Policy (Australian Privacy Principles)                          |

Also generated: `sitemap.xml`, `robots.txt`, Open Graph image
(`/opengraph-image`), favicon + apple icon, `schema.org` LocalBusiness JSON-LD.

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server on http://localhost:3000
npm run build     # production build
npm start         # serve the production build
```

## Environment variables

Copy `.env.example` to `.env.local` (locally) or set them in Vercel →
Project → Settings → Environment Variables.

| Variable                    | Required | Purpose                                                                                  |
| --------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`            | No\*     | Sends the onboarding form by email via [Resend](https://resend.com) to contact@ansaia.com.au + a confirmation copy to the client. \*Without it, the form falls back to opening the visitor's mail app (`mailto:`) — works, but set it up for a professional flow. |
| `RESEND_FROM`               | No       | Custom From address (default `ANSA Onboarding <onboarding@ansaia.com.au>`). The domain must be verified in Resend (DNS records). |
| `NEXT_PUBLIC_META_PIXEL_ID` | No       | Meta (Facebook) Pixel ID. **Disabled by default** — the pixel only loads if this is set. |

Vercel Analytics is included and needs zero config — it activates
automatically once deployed on Vercel. Custom conversion events are
instrumented (`call_click`, `email_click`, `calendly_click`,
`stripe_checkout`, `calculator_used`, `onboarding_submitted`) — note that
custom events require a Vercel Pro plan to appear in the dashboard; on the
free (Hobby) plan only page views are recorded.

## Calendly

"Book a demo online" buttons point to `SITE.calendlyUrl` in `lib/site.ts`
(currently the generic `calendly.com/nowebcontact/30min`). Recommended:
create a dedicated **"ANSA demo — 15 min"** event type in Calendly and set
the account timezone to Perth (it is currently America/New_York), then update
the URL in `lib/site.ts`.

## Stripe

The four payment links are live and hard-coded in `lib/site.ts`:

| Offer                      | First payment | Then    |
| -------------------------- | ------------- | ------- |
| Essential — 12 months      | $1,289        | $299/mo |
| Growth — 12 months         | $1,439        | $449/mo |
| Essential — month-to-month | $1,339        | $349/mo |
| Growth — month-to-month    | $1,489        | $499/mo |

First payment = $990 setup + first month. The pricing section shows this
breakdown before the click so there are no surprises at checkout.

## ⚠️ Manual actions remaining (to do once, by you)

1. **Stripe → redirect to /welcome after payment.** For **each of the 4
   Payment Links**: Stripe Dashboard → Payment Links → select the link →
   **After payment** → "Don't show confirmation page" → redirect to
   `https://ansaia.com.au/welcome`. This is what sends paying clients
   straight to the onboarding form.
2. **Connect the domain.** Vercel → Project → Settings → Domains → add
   `ansaia.com.au` (+ `www`), then point the DNS records at your registrar
   as instructed by Vercel.

Also worth doing before launch (not blocking):

- Set `RESEND_API_KEY` + verify the `ansaia.com.au` domain in Resend so the
  onboarding form emails itself (otherwise mailto fallback; the uploaded menu
  is attached to the email when Resend is configured).
- Have the Terms reviewed by an Australian solicitor (adapted from the Mia
  draft, which was pending legal review).
- Add real testimonials to `TESTIMONIALS` in `lib/site.ts` as they come in —
  the section appears automatically. Never invent one.

## Structure

```
app/
  layout.tsx         # fonts, metadata, JSON-LD, Analytics, Meta pixel slot
  page.tsx           # landing page
  welcome/           # post-payment: confirmation + onboarding form
  terms/  privacy/   # legal pages
  api/onboarding/    # POST → Resend email (fallback: 'not configured' → mailto)
  sitemap.ts robots.ts opengraph-image.tsx icon.svg apple-icon.png
components/
  Nav.tsx            # sticky nav + mobile burger (CTA always visible)
  Footer.tsx Logo.tsx Reveal.tsx
  PricingSection.tsx # billing toggle + Stripe links
  FaqSection.tsx     # accessible accordion
  OnboardingForm.tsx # 9-section form, submit → API, print-to-PDF
lib/site.ts          # ALL business data: contact, plans, prices, Stripe URLs, FAQs
public/branding/     # logo SVGs
```

To change prices, contact details or FAQ copy, edit `lib/site.ts` only.
