export const SITE = {
  name: "ANSA",
  fullName: "ANSA — Automated Natural Speech Assistant",
  tagline: "Every call gets an ANSA.",
  descriptor: "Automated Natural Speech Assistant",
  url: "https://ansaia.com.au",
  founder: "David Navel",
  phoneDisplay: "0473 375 815",
  phoneIntl: "+61473375815",
  email: "contact@ansaia.com.au",
  location: "Perth, WA",
  abn: "15 863 113 585",
  // Calendly booking link — shown as "Book a 15-min demo" wherever CTAs appear.
  // TODO(Marwan): create a dedicated "ANSA demo" event type + set timezone to Perth.
  calendlyUrl: "https://calendly.com/nowebcontact/30min",
};

// Honest product facts shown under the hero. Keep these true.
export const PROOF_POINTS = [
  { stat: "< 3 sec", label: "to pick up, every time" },
  { stat: "24/7", label: "nights, weekends, public holidays" },
  { stat: "48 h", label: "from signup to live" },
  { stat: "Perth", label: "built for WA venues" },
];

// Add real testimonials here as they come in — the section renders
// automatically once this array is non-empty. Never invent one.
// Example: { quote: "…", name: "Jane Smith", venue: "Salt Jetty, Fremantle" }
export const TESTIMONIALS: { quote: string; name: string; venue: string }[] =
  [];

export const SETUP_FEE = 990;
export const REFERRAL_SETUP_FEE = 495;
export const EXCESS_RATE = "$0.50/min";

export type BillingMode = "twelve" | "flex";

export interface PlanPrice {
  monthly: number;
  firstPayment: number;
  stripeUrl: string;
}

export interface Plan {
  key: string;
  name: string;
  blurb: string;
  featured: boolean;
  features: string[];
  prices: Record<BillingMode, PlanPrice>;
}

export const PLANS: Plan[] = [
  {
    key: "essential",
    name: "Essential",
    blurb: "Every call answered, every message captured.",
    featured: false,
    features: [
      "Up to 300 calls / month",
      "24/7 answering in your venue’s name",
      "SMS + email recaps after every call",
      "FAQ answers — hours, parking, BYO",
    ],
    prices: {
      twelve: {
        monthly: 299,
        firstPayment: 1289,
        stripeUrl: "https://buy.stripe.com/9B68wQ4TV0AI8U9chA3sI0c",
      },
      flex: {
        monthly: 349,
        firstPayment: 1339,
        stripeUrl: "https://buy.stripe.com/3cI9AU1HJ4QY5HX1CW3sI0e",
      },
    },
  },
  {
    key: "growth",
    name: "Growth",
    blurb: "Bookings taken for you, straight into your calendar.",
    featured: true,
    features: [
      "Up to 600 calls / month",
      "Everything in Essential",
      "Bookings straight into your calendar",
      "Live call transfers to your team",
      "Custom voice & scripts",
    ],
    prices: {
      twelve: {
        monthly: 449,
        firstPayment: 1439,
        stripeUrl: "https://buy.stripe.com/9B69AU4TV0AI1rHftM3sI0d",
      },
      flex: {
        monthly: 499,
        firstPayment: 1489,
        stripeUrl: "https://buy.stripe.com/28E5kEgCDgzG2vLbdw3sI0f",
      },
    },
  },
];

export const FAQS = [
  {
    q: "Will callers know they’re talking to an AI?",
    a: "ANSA sounds natural and never pretends to be human — if asked, she says she’s the venue’s virtual receptionist. Most callers simply appreciate getting an immediate, helpful answer instead of voicemail or a busy signal mid-service.",
  },
  {
    q: "Do I need to change my phone number?",
    a: "No. You keep your number and simply set up call diversion — either for all calls, or only the ones you miss. It takes two minutes with your provider and can be switched off anytime.",
  },
  {
    q: "What happens with urgent or complex calls?",
    a: "You define the escalation rules. ANSA can transfer urgent calls to your mobile live, flag them as priority in your recap, or send an immediate SMS alert to the kitchen or manager.",
  },
  {
    q: "Which businesses is ANSA built for?",
    a: "Restaurants, cafés and hospitality venues in Perth — anywhere a missed call during service is a missed booking. She’s also great for clinics, salons and trades.",
  },
  {
    q: "Is my data safe?",
    a: "Call data is encrypted, stored in Australia, and never sold or shared. Recordings are kept for 90 days then deleted, and you can request deletion of your data at any time.",
  },
];
