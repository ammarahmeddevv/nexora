"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RUN_PHASES, HERO_RUN, type StepState } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { StatusDot } from "./ui/status-dot";

gsap.registerPlugin(ScrollTrigger);

const PHASE_VIEW: Record<
  string,
  { active: number; states: (string | null)[]; badge: string }
> = {
  queued: { active: -1, states: [null, null, null, null, null], badge: "in queue" },
  running: { active: 1, states: ["done", "running", null, null, null], badge: "step 2 of 5" },
  retry: { active: 1, states: ["done", "retry", null, null, null], badge: "retry 2 · backoff 8s" },
  sleeping: { active: 2, states: ["done", "done", "sleeping", null, null], badge: "wakes in 30s" },
  done: { active: 4, states: ["done", "done", "done", "done", "done"], badge: "sealed · 2m 41s" },
};

const BAR_W: Record<string, string> = {
  done: "100%",
  running: "60%",
  retry: "45%",
  sleeping: "70%",
};
const BAR_BG: Record<string, string> = {
  done: "var(--iris)",
  running: "var(--state-run)",
  retry: "var(--state-retry)",
  sleeping: "var(--ink-faint)",
};

function Trace({ viewKey }: { viewKey: StepState | "queued" }) {
  const view = PHASE_VIEW[viewKey];
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <div className="flex items-center justify-between border-b border-line-soft pb-3 font-mono text-[12px]">
        <span className="text-ink">{HERO_RUN.id}</span>
        <span className="flex items-center gap-2 text-ink-dim">
          <StatusDot state={viewKey} />
          {view.badge}
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {HERO_RUN.steps.map((s, i) => {
          const state = view.states[i];
          return (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-md px-2 py-1.5"
              style={{
                background:
                  i === view.active
                    ? "color-mix(in oklab, var(--iris) 10%, transparent)"
                    : "transparent",
              }}
            >
              <span className="w-40 shrink-0 font-mono text-[12px] text-ink-dim">
                {s.name}
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel-2">
                <span
                  className="block h-full rounded-full transition-all duration-500"
                  style={{
                    width: state ? BAR_W[state] : "0%",
                    background: state ? BAR_BG[state] : "var(--iris)",
                    opacity: state ? 1 : 0.25,
                  }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HowARunWorks() {
  const wrap = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    if (!wrap.current) return;
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: "bottom bottom",
      pin: ".run-sticky",
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) =>
        setPhase(
          Math.min(
            RUN_PHASES.length - 1,
            Math.floor(self.progress * RUN_PHASES.length),
          ),
        ),
    });
    return () => st.kill();
  }, []);

  if (reduced) {
    return (
      <section id="how-it-works" className="border-t border-line bg-canvas py-24">
        <div className="container-x">
          <SectionHeading
            title="What one run does"
            lead="A run moves through a few states. It never holds a worker while it waits, and it never repeats work it has already finished."
            className="mb-12"
          />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
            <ol className="space-y-8">
              {RUN_PHASES.map((p, i) => (
                <li key={p.key} className="grid grid-cols-[100px_minmax(0,1fr)] gap-5">
                  <div className="pt-1 font-mono text-[12.5px] text-ink-dim">
                    {String(i + 1).padStart(2, "0")} {p.label}
                  </div>
                  <div>
                    <h3 className="text-h3 font-medium leading-snug text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink-dim">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Trace viewKey="done" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const current = RUN_PHASES[phase];

  return (
    <section
      id="how-it-works"
      ref={wrap}
      className="border-t border-line bg-canvas"
      style={{ height: `${RUN_PHASES.length * 76}vh` }}
    >
      <div className="run-sticky flex min-h-screen items-center overflow-hidden">
        <div className="container-x w-full py-20">
          <SectionHeading
            title="What one run does"
            lead="A run moves through a few states. It never holds a worker while it waits, and it never repeats work it has already finished."
            className="mb-14"
          />
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center">
            <ol className="space-y-6">
              {RUN_PHASES.map((p, i) => (
                <li
                  key={p.key}
                  className="grid grid-cols-[110px_minmax(0,1fr)] gap-5 transition-opacity duration-300"
                  style={{ opacity: i === phase ? 1 : 0.32 }}
                >
                  <div className="pt-1 font-mono text-[12.5px] text-ink-dim">
                    {String(i + 1).padStart(2, "0")} {p.label}
                  </div>
                  <div>
                    <h3 className="text-h3 font-medium leading-snug text-ink">
                      {p.title}
                    </h3>
                    {i === phase && (
                      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink-dim">
                        {p.body}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <Trace viewKey={current.key} />
          </div>
        </div>
      </div>
    </section>
  );
}
