"use client";

import { track } from "@vercel/analytics";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  data?: Record<string, string | number>;
};

/** Anchor that fires a Vercel Analytics custom event on click. */
export default function TrackedLink({ event, data, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, data);
        onClick?.(e);
      }}
    />
  );
}
