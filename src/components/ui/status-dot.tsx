import type { StepState } from "@/lib/content";

const MAP: Record<StepState | "queued", { color: string; label: string }> = {
  done: { color: "var(--state-ok)", label: "Complete" },
  running: { color: "var(--state-run)", label: "Running" },
  retry: { color: "var(--state-retry)", label: "Retrying" },
  sleeping: { color: "var(--ink-dim)", label: "Sleeping" },
  queued: { color: "var(--ink-faint)", label: "Queued" },
};

export function StatusDot({
  state,
  withLabel = false,
}: {
  state: StepState | "queued";
  withLabel?: boolean;
}) {
  const { color, label } = MAP[state];
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow:
            state === "running" || state === "retry"
              ? `0 0 0 3px color-mix(in oklab, ${color} 22%, transparent)`
              : undefined,
        }}
      />
      {withLabel ? (
        <span className="text-[13px] text-ink-dim">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
