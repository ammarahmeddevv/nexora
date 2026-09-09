"use client";

import { useState } from "react";
import { QUICKSTART_TABS } from "@/lib/content";
import { CodeBlock } from "./ui/code-block";
import { SectionHeading } from "./section-heading";

export function Quickstart() {
  const [active, setActive] = useState(QUICKSTART_TABS[0].id);
  const tab = QUICKSTART_TABS.find((t) => t.id === active)!;

  return (
    <section id="quickstart" className="border-t border-line bg-panel py-24">
      <div className="container-x">
        <SectionHeading
          title="A workflow is a function. Nexora runs it durably."
          lead="No queue to provision, no state machine to draw. Call step.run for work that should be checkpointed, step.sleep for waits, and deploy."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div
            role="tablist"
            aria-label="Quickstart"
            className="flex gap-2 lg:flex-col lg:gap-1"
          >
            {QUICKSTART_TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={active === t.id}
                onClick={() => setActive(t.id)}
                className={`rounded-md px-3 py-2 text-left text-[14px] transition-colors ${
                  active === t.id
                    ? "bg-panel-2 text-ink"
                    : "text-ink-dim hover:text-ink"
                }`}
              >
                {t.label}
                <span className="mt-0.5 block font-mono text-[11px] text-ink-faint">
                  {t.id === "define"
                    ? "write the steps"
                    : t.id === "schedule"
                      ? "attach a cron"
                      : "ship it"}
                </span>
              </button>
            ))}
          </div>

          <CodeBlock
            code={tab.code}
            file={tab.file}
            lang={tab.id === "deploy" ? "shell" : "ts"}
          />
        </div>
      </div>
    </section>
  );
}
