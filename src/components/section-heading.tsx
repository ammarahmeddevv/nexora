export function SectionHeading({
  title,
  lead,
  dark = true,
  className = "",
}: {
  title: string;
  lead?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <h2
        className={`text-h2 font-medium leading-tight tracking-[-0.015em] ${
          dark ? "text-ink" : "text-paper-ink"
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-4 text-[16.5px] leading-relaxed ${
            dark ? "text-ink-dim" : "text-[color:var(--paper-ink)]/70"
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
