export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-ink ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        {/* two steps of a run, offset — the mark is the product */}
        <rect x="0.5" y="3" width="9" height="4" rx="1" fill="var(--iris)" />
        <rect
          x="4.5"
          y="9"
          width="11"
          height="4"
          rx="1"
          fill="var(--iris-soft)"
        />
      </svg>
      Nexora
    </span>
  );
}
