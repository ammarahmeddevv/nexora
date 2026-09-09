import { FEATURES } from "@/lib/content";
import { SectionHeading } from "./section-heading";

function Glyph({ kind }: { kind: string }) {
  const s = { className: "size-4", strokeWidth: 1.5, stroke: "currentColor", fill: "none" };
  switch (kind) {
    case "retry":
      return (
        <svg viewBox="0 0 16 16" {...s}>
          <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2v3h-3" strokeLinecap="round" />
        </svg>
      );
    case "cron":
      return (
        <svg viewBox="0 0 16 16" {...s}>
          <circle cx="8" cy="8" r="5.5" />
          <path d="M8 5v3l2 1.5" strokeLinecap="round" />
        </svg>
      );
    case "concurrency":
      return (
        <svg viewBox="0 0 16 16" {...s}>
          <path d="M2 5h12M2 8h8M2 11h12" strokeLinecap="round" />
        </svg>
      );
    case "history":
      return (
        <svg viewBox="0 0 16 16" {...s}>
          <path d="M3 3h10v10H3zM3 6.5h10M6.5 6.5V13" />
        </svg>
      );
    case "local":
      return (
        <svg viewBox="0 0 16 16" {...s}>
          <path d="M3 4l3 4-3 4M8 12h5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 16 16" {...s}>
          <path d="M8 2l5 3v6l-5 3-5-3V5zM3 5l5 3 5-3M8 8v6" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function Features() {
  return (
    <section className="border-t border-line bg-canvas py-24">
      <div className="container-x">
        <SectionHeading
          title="The parts you'd otherwise build yourself"
          lead="Everything here is the reason teams write a queue wrapper in the first place. Nexora ships it as the default behaviour."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-canvas p-6">
              <span className="inline-flex text-iris">
                <Glyph kind={f.kind} />
              </span>
              <h3 className="mt-4 text-[16px] font-medium text-ink">{f.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
