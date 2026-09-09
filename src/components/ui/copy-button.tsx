"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
      className={`inline-flex items-center gap-1.5 text-[13px] text-ink-dim transition-colors hover:text-ink ${className}`}
      aria-label={copied ? "Copied" : label}
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${
          copied ? "bg-state-ok" : "bg-ink-faint"
        }`}
      />
      {copied ? "Copied" : label}
    </button>
  );
}
