"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { HERO_RUN, TRACE_ROW as ROW } from "@/lib/content";
import { RunTraceSvg } from "./run-trace-svg";
import { Button } from "./ui/button";
import { CopyButton } from "./ui/copy-button";

const RunTrace3D = dynamic(() => import("./run-trace-3d"), { ssr: false });

export function Hero() {
  const [rich, setRich] = useState(false);
  const headline = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 900px)").matches;
    let webgl = false;
    try {
      webgl = !!document.createElement("canvas").getContext("webgl2");
    } catch {}
    setRich(wide && webgl);

    if (reduce || !headline.current) return;
    const root = headline.current;
    const lines = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-line]"));
    const fades = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-fade]"));
    const all = [...lines, ...fades];

    // fromTo (not from) so a Strict-Mode double-invoke can't leave content
    // stuck at the hidden start state.
    const tl = gsap.timeline();
    tl.fromTo(
      lines,
      { yPercent: 115 },
      { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 },
    ).fromTo(
      fades,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: "power2.out" },
      "-=0.55",
    );

    // failsafe for a tab that was backgrounded during load (rAF frozen)
    const failsafe = window.setTimeout(() => tl.progress(1), 2600);

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      gsap.set(all, { clearProps: "all" });
    };
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-40">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
          {/* copy */}
          <div ref={headline}>
            <p
              data-fade
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[12.5px] text-ink-dim"
            >
              <span className="size-1.5 rounded-full bg-state-ok" />
              v2 · replay a run against your latest deploy
            </p>

            <h1 className="text-hero font-medium leading-[1.02] tracking-[-0.02em]">
              <span className="block overflow-hidden">
                <span data-line className="block">
                  Durable workflows
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-line className="block">
                  that finish what
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-line className="block text-ink-dim">
                  they start.
                </span>
              </span>
            </h1>

            <p
              data-fade
              className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-ink-dim"
            >
              Nexora runs your functions as background jobs, cron schedules and
              multi-step pipelines — surviving restarts, retrying on failure, and
              keeping every run so you can inspect or replay it.
            </p>

            <div data-fade className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#quickstart">Start building</Button>
              <span className="inline-flex items-center gap-3 rounded-md border border-line bg-panel px-3 h-10 font-mono text-[13px] text-ink-dim">
                npm i nexora
                <CopyButton text="npm i nexora" label="" />
              </span>
            </div>
          </div>

          {/* run trace card */}
          <div className="w-full">
            <figure className="mx-auto w-full max-w-[560px] overflow-hidden rounded-xl border border-line bg-panel">
              <figcaption className="flex items-center justify-between border-b border-line-soft px-4 py-3 font-mono text-[12.5px]">
                <span className="text-ink">{HERO_RUN.id}</span>
                <span className="text-ink-dim">
                  {HERO_RUN.workflow} · {HERO_RUN.duration}
                </span>
              </figcaption>

              {rich ? (
                <div
                  className="flex"
                  style={{ height: HERO_RUN.steps.length * ROW }}
                >
                  {/* label column — row height matches the 3D lane height exactly */}
                  <ul className="shrink-0 border-r border-line-soft">
                    {HERO_RUN.steps.map((s) => (
                      <li
                        key={s.name}
                        className="flex items-center px-4 font-mono text-[11.5px] text-ink-dim"
                        style={{ height: ROW }}
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                  {/* timeline */}
                  <div className="relative flex-1">
                    <RunTrace3D />
                    {HERO_RUN.steps.map((s, i) =>
                      s.note ? (
                        <div
                          key={s.name}
                          className="pointer-events-none absolute right-3 font-mono text-[10.5px] text-ink-faint"
                          style={{ top: i * ROW + ROW / 2 - 7 }}
                        >
                          {s.note}
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              ) : (
                <RunTraceSvg className="w-full" />
              )}
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
