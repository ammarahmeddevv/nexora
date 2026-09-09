import { highlight } from "@/lib/highlight";
import { CopyButton } from "./copy-button";

export function CodeBlock({
  code,
  file,
  lang = "ts",
  className = "",
}: {
  code: string;
  file?: string;
  lang?: "ts" | "shell";
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-panel-2 ${className}`}
    >
      {file && (
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="font-mono text-[12px] text-ink-dim">{file}</span>
          <CopyButton text={code} />
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="p-4 font-mono text-[12.5px] leading-[1.7] text-ink">
          <code>{highlight(code, lang)}</code>
        </pre>
      </div>
    </div>
  );
}
