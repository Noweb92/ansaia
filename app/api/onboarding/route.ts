import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL = "contact@ansaia.com.au";
const FROM_EMAIL = process.env.RESEND_FROM ?? "ANSA Onboarding <onboarding@ansaia.com.au>";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(entries: Record<string, string>) {
  const rows = Object.entries(entries)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #D8E0EA;font-weight:bold;color:#0B1F3F;white-space:nowrap">${escapeHtml(
          k,
        )}</td><td style="padding:8px 12px;border:1px solid #D8E0EA;color:#26374F">${escapeHtml(
          v,
        )}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;max-width:720px">
    <h1 style="color:#0B1F3F">ANSA — New onboarding form</h1>
    <table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
  </div>`;
}

async function sendEmail(
  apiKey: string,
  payload: { from: string; to: string[]; subject: string; html: string; reply_to?: string },
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}

export async function POST(req: NextRequest) {
  let entries: Record<string, string>;
  try {
    entries = await req.json();
  } catch {
    return NextResponse.json({ sent: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
    return NextResponse.json({ sent: false, error: "Invalid payload" }, { status: 400 });
  }

  // Sanitise: strings only, sane sizes
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(entries)) {
    if (typeof v === "string" && k.length <= 120 && v.length <= 4000) {
      clean[k] = v;
    }
  }
  if (Object.keys(clean).length === 0) {
    return NextResponse.json({ sent: false, error: "Empty form" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured — the client falls back to a mailto: draft.
    return NextResponse.json({ sent: false, configured: false });
  }

  const venue = clean["Venue name"] ?? "Unknown venue";
  const clientEmail = clean["Contact email"];
  const html = buildHtml(clean);

  try {
    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Onboarding form — ${venue}`,
      html,
      reply_to: clientEmail,
    });

    if (clientEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      await sendEmail(apiKey, {
        from: FROM_EMAIL,
        to: [clientEmail],
        subject: `Your ANSA onboarding form — ${venue}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:720px">
          <p>Thanks — we’ve received your onboarding form for <b>${escapeHtml(venue)}</b>.</p>
          <p><b>You’ll be live within 48 hours.</b> We’ll build and train your
          receptionist, call you for a live test, then switch on the divert together.</p>
          <p>A copy of your answers is below for your records.</p>
          <p>— David Navel, ANSA · 0473 375 815 · contact@ansaia.com.au</p>
        </div>${html}`,
      }).catch(() => {
        /* confirmation copy is best-effort */
      });
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Onboarding email failed:", err);
    return NextResponse.json({ sent: false, error: "Email send failed" }, { status: 502 });
  }
}
