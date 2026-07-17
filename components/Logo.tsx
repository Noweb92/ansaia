export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      aria-hidden="true"
      focusable="false"
    >
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
  );
}
