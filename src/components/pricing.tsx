import { TIERS } from "@/lib/content";

/** The single light section — gives the page a spine instead of one mood. */
export function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-paper py-24 text-paper-ink"
      style={{ colorScheme: "light" }}
    >
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 className="text-h2 font-medium leading-tight tracking-[-0.015em]">
            Pricing that follows your usage
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-paper-ink/70">
            Every plan is the whole engine — retries, scheduling, history, local
            dev. Bigger plans raise the limits and add controls for teams.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-xl border p-6 ${
                t.featured
                  ? "border-[var(--iris)] bg-white shadow-[0_1px_20px_-6px_rgba(110,123,255,0.4)]"
                  : "border-paper-line bg-white/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold">{t.name}</h3>
                {t.featured && (
                  <span className="rounded-full bg-[var(--iris)] px-2 py-0.5 text-[11px] font-medium text-white">
                    Most teams
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span
                  className={`text-[26px] leading-none ${
                    /\d/.test(t.price) ? "font-mono" : "font-medium"
                  }`}
                >
                  {t.price}
                </span>
                {t.cadence && (
                  <span className="text-[12.5px] text-[color:var(--paper-ink)]/60">
                    {t.cadence}
                  </span>
                )}
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-paper-ink/70">
                {t.blurb}
              </p>

              <a
                href="#top"
                className={`mt-5 inline-flex h-9 items-center justify-center rounded-md px-4 text-[13.5px] font-medium transition-colors ${
                  t.featured
                    ? "bg-[#14171d] !text-white hover:bg-black"
                    : "border border-paper-line text-paper-ink hover:border-[color:var(--paper-ink)]/40"
                }`}
              >
                {t.cta}
              </a>

              <ul className="mt-6 space-y-2.5 border-t border-paper-line pt-5 text-[13.5px] text-paper-ink/80">
                {t.includes.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <svg
                      viewBox="0 0 16 16"
                      className="mt-0.5 size-3.5 shrink-0 text-[var(--iris)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 8.5l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
