import { SHOWCASE_CODE, SHOWCASE_ANNOTATION } from "@/lib/content";
import { CodeBlock } from "./ui/code-block";
import { SectionHeading } from "./section-heading";

export function CodeShowcase() {
  return (
    <section className="border-t border-line bg-panel py-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center">
          <CodeBlock code={SHOWCASE_CODE} file="workflows/fulfil.ts" />

          <div className="lg:pl-4">
            <SectionHeading
              title="Written like normal code. Recovered like a database."
              lead="The same order.fulfil from the trace at the top of the page. Every step.run is a checkpoint."
            />
            <p className="mt-6 border-l-2 border-iris pl-4 text-[15px] leading-relaxed text-ink-dim">
              {SHOWCASE_ANNOTATION.text}
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-dim">
              If the process dies after <span className="font-mono text-ink">charge-card</span>,
              the run resumes at <span className="font-mono text-ink">reserve-stock</span> on
              another worker — with the payment result it already had.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
