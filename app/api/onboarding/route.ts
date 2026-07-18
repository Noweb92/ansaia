import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL = "contact@ansaia.com.au";
const FROM_EMAIL = process.env.RESEND_FROM ?? "ANSA Onboarding <onboarding@ansaia.com.au>";
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024; // base64 of a ~6 MB file

interface Attachment {
  filename: string;
  content: string; // base64
}

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
  payload: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    reply_to?: string;
    attachments?: Attachment[];
  },
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
  let entries: Record<string, unknown>;
  try {
    entries = await req.json();
  } catch {
    return NextResponse.json({ sent: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
    return NextResponse.json({ sent: false, error: "Invalid payload" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "company_website" field. Pretend success.
  if (typeof entries["company_website"] === "string" && entries["company_website"].trim() !== "") {
    return NextResponse.json({ sent: true });
  }

  // Optional menu attachment
  let attachment: Attachment | undefined;
  const rawFile = entries["_menuFile"];
  if (
    rawFile &&
    typeof rawFile === "object" &&
    typeof (rawFile as Attachment).filename === "string" &&
    typeof (rawFile as Attachment).content === "string" &&
    (rawFile as Attachment).content.length <= MAX_ATTACHMENT_BYTES
  ) {
    const { filename, content } = rawFile as Attachment;
    attachment = { filename: filename.slice(0, 120).replace(/[\r\n"]/g, "_"), content };
  }

  // Sanitise: strings only, sane sizes
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(entries)) {
    if (k === "_menuFile" || k === "company_website") continue;
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
      attachments: attachment ? [attachment] : undefined,
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
