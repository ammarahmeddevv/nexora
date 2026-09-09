import { SCALE_FIGURES } from "@/lib/content";

export function Scale() {
  return (
    <section className="border-t border-line bg-panel py-20">
      <div className="container-x">
        <div className="grid gap-10 sm:grid-cols-3">
          {SCALE_FIGURES.map((f) => (
            <div key={f.label}>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[28px] leading-none text-ink">
                  {f.value}
                </span>
              </div>
              <p className="mt-2 text-[14px] font-medium text-ink">{f.label}</p>
              <p className="mt-1.5 max-w-[38ch] text-[13.5px] leading-relaxed text-ink-dim">
                {f.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
