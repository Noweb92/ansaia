import { ImageResponse } from "next/og";

export const alt =
  "ANSA — AI Receptionist for Perth Restaurants & Venues. Never miss another call.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0E2A5C, #081831 60%)",
          color: "#E6EDF7",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 512 512">
          <rect width="512" height="512" rx="112" fill="#0E2A5C" />
          <g stroke="#22D3EE" strokeWidth="20" strokeLinecap="round">
            <line x1="256" y1="110" x2="150" y2="400" />
            <line x1="256" y1="110" x2="362" y2="400" />
            <line x1="188" y1="295" x2="324" y2="295" />
          </g>
          <circle cx="256" cy="110" r="32" fill="#22D3EE" />
          <circle cx="150" cy="400" r="32" fill="#22D3EE" />
          <circle cx="362" cy="400" r="32" fill="#22D3EE" />
          <circle cx="188" cy="295" r="20" fill="#FFFFFF" />
          <circle cx="324" cy="295" r="20" fill="#FFFFFF" />
        </svg>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: 24,
            marginTop: 30,
            display: "flex",
          }}
        >
          ANSA
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#22D3EE",
            letterSpacing: 4,
            marginTop: 12,
            display: "flex",
          }}
        >
          NEVER MISS ANOTHER CALL
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#9FB0C8",
            marginTop: 20,
            display: "flex",
          }}
        >
          AI Receptionist for Perth Restaurants &amp; Venues · 24/7 · Live in 48h
        </div>
      </div>
    ),
    { ...size },
  );
}
