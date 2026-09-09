import { Button } from "./ui/button";
import { CopyButton } from "./ui/copy-button";
import { CHANGELOG } from "@/lib/content";

export function Cta() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-canvas py-28">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <h2 className="max-w-[16ch] text-h2 font-medium leading-tight tracking-[-0.015em] text-ink">
              Move the retry logic out of your codebase.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#quickstart">Start building</Button>
              <span className="inline-flex h-10 items-center gap-3 rounded-md border border-line bg-panel px-3 font-mono text-[13px] text-ink-dim">
                npm i nexora
                <CopyButton text="npm i nexora" label="" />
              </span>
            </div>
          </div>

          <div className="hairline-top pt-5 lg:border-t-0 lg:pt-0">
            <p className="font-mono text-[12px] text-ink-faint">Recent</p>
            <ul className="mt-3 space-y-2.5">
              {CHANGELOG.map((c) => (
                <li key={c.date} className="text-[13px] text-ink-dim">
                  <span className="font-mono text-ink-faint">{c.date}</span>{" "}
                  {c.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
