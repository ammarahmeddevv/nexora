import { DASHBOARD_RUNS, DASHBOARD_STATS } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { StatusDot } from "./ui/status-dot";

function Sparkline() {
  const pts = [7, 9, 6, 11, 8, 10, 7, 13, 9, 12, 8, 6, 9, 7];
  const max = Math.max(...pts);
  const d = pts
    .map((p, i) => `${(i / (pts.length - 1)) * 100},${28 - (p / max) * 24}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" className="h-8 w-full" preserveAspectRatio="none">
      <polyline
        points={d}
        fill="none"
        stroke="var(--iris)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Observability() {
  return (
    <section id="changelog" className="border-t border-line bg-canvas py-24">
      <div className="container-x">
        <SectionHeading
          title="Every run is on the record"
          lead="Open a run and you see its inputs, each step's output, how long it took, and every retry. Nothing to instrument — it's how the engine works."
        />

        <div className="mt-12 overflow-hidden rounded-xl border border-line bg-panel">
          {/* stat strip */}
          <div className="grid grid-cols-2 divide-x divide-line border-b border-line md:grid-cols-4">
            {DASHBOARD_STATS.map((s) => (
              <div key={s.label} className="p-5">
                <div className="flex items-center gap-2">
                  {"state" in s && s.state && (
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        background:
                          s.state === "ok"
                            ? "var(--state-ok)"
                            : "var(--state-retry)",
                      }}
                    />
                  )}
                  <span className="font-mono text-[19px] text-ink">{s.value}</span>
                </div>
                <p className="mt-1 text-[12.5px] text-ink-dim">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_260px]">
            {/* runs table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[12.5px]">
                <thead className="text-ink-faint">
                  <tr className="border-b border-line-soft [&>th]:px-5 [&>th]:py-2.5 [&>th]:font-normal">
                    <th>run</th>
                    <th>workflow</th>
                    <th>trigger</th>
                    <th className="text-right">took</th>
                    <th className="text-right">when</th>
                  </tr>
                </thead>
                <tbody>
                  {DASHBOARD_RUNS.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-line-soft last:border-0 [&>td]:px-5 [&>td]:py-2.5"
                    >
                      <td className="text-ink">
                        <span className="inline-flex items-center gap-2">
                          <StatusDot state={r.state} />
                          {r.id}
                        </span>
                      </td>
                      <td className="text-ink-dim">{r.workflow}</td>
                      <td className="text-ink-faint">{r.trigger}</td>
                      <td className="text-right text-ink-dim">{r.duration}</td>
                      <td className="text-right text-ink-faint">{r.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* side panel */}
            <div className="border-t border-line p-5 lg:border-l lg:border-t-0">
              <p className="text-[12.5px] text-ink-dim">Dispatch latency · 24h</p>
              <div className="mt-3">
                <Sparkline />
              </div>
              <p className="mt-2 font-mono text-[12px] text-ink-faint">
                p50 9ms · p99 41ms
              </p>
              <div className="mt-6 space-y-2 text-[12.5px] text-ink-dim">
                <p>
                  <span className="text-state-retry">3 runs</span> retried in the
                  last hour
                </p>
                <p>
                  <span className="text-state-ok">all</span> workflows healthy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
